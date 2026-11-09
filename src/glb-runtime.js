import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';

// The build only advertises models whose local source files are present.
const available = typeof __GLB_MODEL_IDS__ === 'undefined' ? [] : __GLB_MODEL_IDS__;
const pending = new Map();
function data(id) {
  if (!available.includes(id)) return Promise.reject(Error('模型尚未下载'));
  if (!pending.has(id)) pending.set(id, new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `assets/models/${id}-data.js`;
    const fail = error => { pending.delete(id); script.remove(); reject(error); };
    script.onerror = () => fail(Error('模型文件读取失败'));
    script.onload = () => {
      try {
        const key = `ModelGLBData_${id}`;
        const bytes = Uint8Array.from(atob(globalThis[key]), c => c.charCodeAt(0));
        delete globalThis[key]; script.remove(); resolve(bytes.buffer);
      } catch (error) { fail(error); }
    };
    document.head.append(script);
  }));
  return pending.get(id);
}

async function load(id) {
  const loader = new GLTFLoader();
  // Wails accepts data URI textures without blob URLs or external requests.
  loader.register(parser => {
    parser.textureLoader = new THREE.TextureLoader(parser.options.manager).setCrossOrigin(undefined);
    return {name: 'MagpieEmbeddedTextures'};
  });
  const result = await loader.parseAsync(await data(id), '');
  const scene = result.scene, morphs = [];
  scene.traverse(object => {
    if (!object.isMesh) return;
    object.castShadow = true; object.receiveShadow = true;
    object.frustumCulled = false;
    if (object.morphTargetDictionary && object.morphTargetInfluences) morphs.push(object);
  });
  const bounds = new THREE.Box3().setFromObject(scene);
  const height = bounds.max.y - bounds.min.y;
  if (!Number.isFinite(height) || height <= 0) throw Error('模型尺寸无效');
  const center = bounds.getCenter(new THREE.Vector3());
  scene.position.set(-center.x, -bounds.min.y, -center.z);
  const mount = new THREE.Group(); mount.add(scene); mount.scale.setScalar(2.25 / height);
  return {model: {scene, morphs}, mount};
}

function animate(model, phase, time) {
  const speaking = phase === 'replying';
  const values = {
    Breath: .35 + .3 * Math.sin(time * 2),
    Head_Nod: (.5 + .5 * Math.sin(time * (speaking ? 3 : 1.6))) * (phase === 'tool' || speaking ? .65 : .4),
    Head_Turn: (.5 + .5 * Math.sin(time * .9)) * (phase === 'thinking' ? .75 : .35),
    Arm_L: phase === 'tool' ? .25 + .2 * Math.sin(time * 4) : 0,
    Arm_R: phase === 'approval' || phase === 'ask' ? .6 + .2 * Math.sin(time * 3) : 0,
    Mouth_A: speaking ? .3 * Math.max(0, Math.sin(time * 8)) : 0,
    Mouth_I: speaking ? .15 * Math.max(0, Math.sin(time * 8 + 2)) : 0,
    Mouth_U: speaking ? .15 * Math.max(0, Math.sin(time * 8 + 4)) : 0,
  };
  for (const mesh of model.morphs) for (const [name, value] of Object.entries(values)) {
    const index = mesh.morphTargetDictionary[name];
    if (index !== undefined) mesh.morphTargetInfluences[index] = value;
  }
}
globalThis.ModelGLB = {available, load, animate};
