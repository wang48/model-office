# 社区提交草稿：模型在干嘛 0.1.0

本文件是待审核材料，尚未提交。registry-entry.json 采用已测试包名；只有在对应 npm 包公开可获取后才可作为可安装条目提交。community 字段按社区注册表约定填写，草稿不表示已获得社区认可。

## 建议标题

Add 模型在干嘛: local Agent office with animated community characters

## 建议正文

创作灵感来自 [Agent 办公室（Agent Office）](https://github.com/magpie-community/plugins/tree/main/packages/agent-office)。感谢原作者与贡献者；本项目独立维护，并复用其 MIT 许可的会话解析器，保留原许可和固定提交记录。

新增页面插件「模型在干嘛」：把本机 Agent 会话展示为办公室中的社区娘化伙伴。每个会话独立显示，支持状态筛选、搜索、详情、暂停及 3D / 2D / 列表视图。

DeepSeek 使用 VRM 骨骼动画；Claude、GPT、Gemini 使用 GLB 形态键动画；Qwen、Kimi 保留作者原画。本版不宣称所有角色均为骨骼 3D。模型离线随包提供，页面无需远程素材请求。

本地 gateway hook 读取日志，向页面提供状态、工具名、模型、计数及散列标识白名单。快照不含提示词、回复正文、工具参数和项目路径。角色图鉴使用 usage:summary 权限。插件不执行 Agent 工具或代替用户批准操作。

代码为 MIT，第三方素材遵循各自许可：DeepSeek VRM 为 CC BY-NC-SA 4.0，Claude / GPT / Gemini GLB 为 CC BY 4.0；原画含非商业要求。包内保留署名、来源和许可记录。当前完整素材包具有非商业限制。

验证：31 项自动测试、7 项独立服务访问控制检查通过；实际 tgz 解包安装到 Magpie，已验证四模型加载、真实会话、示例、筛选、详情焦点、暂停及视图切换。原生紧凑窗口检查通过。压缩包约 136 MB，首次加载需要读取较大模型，未作量化性能承诺。

## 发布操作前所需信息

1. 公共代码仓库：https://github.com/wang48/model-office 。发布前确定 npm 发布账号并检查包名可用性。
2. 若维护者要求纳入社区 monorepo，按其要求改为 @magpie-community/page-model-office，并由获授权维护者发布；改名后需重新打包和安装验证。
3. 对公共源码保留素材许可与重建说明。不要提交 page/live.js 等运行时快照。展示图优先使用明确标识的示例模式。
4. 发布 npm 后检查版本可下载，再提交注册表条目。此草稿未执行上述外部操作。

## 本地安装产物

`releases/magpie-page-model-office-0.1.0.tgz`

SHA-256：`f30a68d11f98ce40ce2812723ac2b9bfd9bf093528474997ce364ccb07a0bf5e`

解压到独立目录后，将其中 package 文件夹添加到 Magpie；也可执行 `magpie plugin add /absolute/path/to/package`。请保留该目录，插件运行仍需读取其中资源。

当前开发安装已保留在本机 Magpie，无需重复添加。

## 审核材料

- `docs/release-audit.md`：验收范围和限制。
- `docs/models/`、`docs/artwork/`：来源、许可、署名和模型校验记录。
- `docs/release/market-demo-0.1.0.png`：市场展示图，明确标识演示模式，不含真实会话。
- `docs/release/inspiration-credit-0.1.0.png`：Magpie 内的灵感声明。
- `docs/magpie-release-package.png`：0.4.0 分发包安装验收历史截图，不用作新版市场展示。
- `docs/magpie-compact-ui.png`：紧凑宿主布局。

规范来源：https://github.com/magpie-community/plugins#pages

注册表来源：https://github.com/magpie-community/plugins/blob/main/registry.json
