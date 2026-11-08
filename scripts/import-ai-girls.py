"""Validate publisher ZIP hashes and import only GLB data, never execute assets."""
import hashlib
import json
from pathlib import Path
import struct
import sys
import zipfile

root = Path(__file__).resolve().parents[1]
downloads = Path(sys.argv[1]) if len(sys.argv) > 1 else Path('/tmp/ai-girls-downloads')
manifest = json.loads((root / 'docs/models/ai-girls-3d/release-manifest.json').read_text())
selected = {'claude-adult': 'claude', 'chatgpt-adult': 'gpt', 'gemini': 'gemini'}
validated = []
for asset in manifest['assets']:
    if asset['slug'] not in selected:
        continue
    archive = downloads / asset['name']
    payload = archive.read_bytes()
    if len(payload) != asset['bytes'] or hashlib.sha256(payload).hexdigest() != asset['sha256']:
        raise ValueError(f'Incomplete or mismatched archive: {archive.name}')
    with zipfile.ZipFile(archive) as bundle:
        models = [f for f in bundle.infolist() if f.filename.lower().endswith('.glb')]
        if len(models) != 1:
            raise ValueError(f'Expected one GLB in {archive.name}')
        data = bundle.read(models[0])
    magic, version, length, json_length, json_type = struct.unpack_from('<5I', data)
    if (magic, version, length, json_type) != (0x46546C67, 2, len(data), 0x4E4F534A):
        raise ValueError(f'Invalid GLB: {archive.name}')
    gltf = json.loads(data[20:20 + json_length])
    if any('uri' in b for b in gltf.get('buffers', [])):
        raise ValueError('External buffer in GLB')
    if any('uri' in i and not i['uri'].startswith('data:') for i in gltf.get('images', [])):
        raise ValueError('External texture in GLB')
    meshes = gltf.get('meshes', [])
    if not meshes:
        raise ValueError('No 3D mesh')
    names = sorted({n for m in meshes for n in m.get('extras', {}).get('targetNames', [])})
    if not {'Breath', 'Head_Nod', 'Head_Turn'}.issubset(names):
        raise ValueError(f'Missing expected animation morphs: {archive.name}: {names}')
    evidence = {'archive': asset['name'], 'archive_sha256': asset['sha256'],
                'glb_sha256': hashlib.sha256(data).hexdigest(), 'bytes': len(data),
                'meshes': len(meshes), 'skins': len(gltf.get('skins', [])),
                'morph_targets': names, 'source': 'https://github.com/ningfangtianwai-pixel/ai-girls-3d',
                'version': manifest['version'], 'license': 'CC-BY-4.0'}
    validated.append((selected[asset['slug']], data, evidence))

# No project assets change until every selected archive has passed validation.
for model_id, data, evidence in validated:
    (root / f'page/assets/models/{model_id}.glb').write_bytes(data)
    (root / f'docs/models/ai-girls-3d/{model_id}-verified.json').write_text(
        json.dumps(evidence, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'id': model_id, **evidence}, ensure_ascii=False))
