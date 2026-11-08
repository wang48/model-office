# 灵感与致谢

「模型在干嘛」的创作灵感来自 **[Agent 办公室（Agent Office）](https://github.com/magpie-community/plugins/tree/main/packages/agent-office)**：用办公室里的角色呈现 Agent 的工作状态。感谢原插件作者和所有贡献者。

本项目在这一灵感基础上，使用社区大模型娘化形象，加入 VRM 骨骼动画、GLB 形态键动画和本地会话状态展示。本项目独立维护，不代表 Agent Office 或模型品牌的官方作品。

## 代码复用

复用 Agent Office 的 `lib/readers.mjs` 与 `lib/scan.mjs`。上游仓库为 `magpie-community/plugins`，固定提交为 `2598c5355a9e18129c8db008f8ca3ac674231bad`，原路径为 `packages/agent-office`。

原始 MIT 许可全文保留于 [vendor/agent-office/LICENSE](vendor/agent-office/LICENSE)，来源记录见 [UPSTREAM.json](vendor/agent-office/UPSTREAM.json)。本项目的灵感声明不替代原代码许可与版权声明。

## 角色与运行库

角色模型、原画和 Three.js / three-vrm 的许可各自独立。请参阅 [README](README.md#许可与署名)、[模型来源](docs/models/README.md)、`docs/artwork/` 和 [运行库许可](docs/models/runtime-LICENSES.txt)。完整素材包含非商业素材；代码的 MIT 许可不将这些素材改为 MIT。
