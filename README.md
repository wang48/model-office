# model-office · 模型在干嘛

Magpie 的本地 Agent 会话观察插件。每个会话是一位伙伴，根据日志中的模型选择社区娘化形象，按状态进入工位、等待区或茶歇角落。本插件的创作灵感来自 [Agent 办公室（Agent Office）](https://github.com/magpie-community/plugins/tree/main/packages/agent-office)，并复用其 MIT 许可的会话解析器。感谢原插件及其贡献者；本项目独立维护。完整说明见 [致谢](ACKNOWLEDGEMENTS.md)。

## 使用

在 Magpie 插件管理中添加本项目文件夹，或执行：

```sh
magpie plugin add /path/to/model-zai-gan-ma
```

打开「模型在干嘛」。插件的 gateway hook 每 1.5 秒读取本机会话状态；启动受支持的 Agent 后，伙伴会自动入座。没有会话时，可点击「查看示例」。示例始终带明确标识，不代表真实活动。

- 点击伙伴或会话列表打开详情；按 Escape 关闭。
- 拖拽旋转场景，滚轮缩放；详情中的「近看角色」进入近景，「重置视角」回到办公室。
- 可搜索模型或 Agent，按状态筛选，切换 2D 或列表视图。
- 「暂停动画」冻结装饰动画和示例轮换；真实状态仍持续更新。默认遵循系统的减少动态效果设置。
- 等待批准、提问和错误仅供观察，需要回到原 Agent 处理。

## 角色与动画

| 角色 | 当前资源 | 动作方式 |
|---|---|---|
| DeepSeek | ニケ的 DeepSeek-chan VRM 1.0 | 人形骨骼、工作动作、眨眼 |
| Claude | Manny / ningfangtianwai-pixel 的 GLB | 点头、转头、呼吸、手臂形态键 |
| GPT | 同上，白龙娘 GLB | 点头、转头、呼吸、嘴型形态键 |
| Gemini | 同上，猫娘 GLB | 点头、转头、呼吸、嘴型形态键 |
| Qwen、Kimi | 作者原画 | 原图在场景中的位置与状态特效 |

GLB 角色是真实三维网格，但没有完整人体骨骼，不能套用完整行走或动捕动作。DeepSeek 的头发、裙摆二级物理暂时关闭，以避免缩放和工位移动时失稳。角色均为社区同人形象，不是品牌官方模型。

每个会话独立显示，同模型的多个会话不会合并。明确记录的子代理按较小尺寸显示，并与可见主会话连线；没有明确父子信息时不会猜测关系。未收录的模型用问号标识。

## 隐私与状态边界

会话扫描器在本机读取日志，默认扫描最近两天、最多 40 个文件。支持上游的 Claude Code、Codex、DSH、Gemini CLI、Qwen Code、Kimi Code 等格式；具体实现与固定提交见 `vendor/agent-office/UPSTREAM.json`。

传给页面和写盘的快照仅包含白名单字段：状态、工具名、模型、统计数字和散列会话标识。不包含提示词、回复正文、工具参数、项目路径或原始会话 ID。插件不发送会话内容到外部服务，不执行工具，不批准操作，不调用模型。

长时间没有新事件会标明无进展；快照超过 12 秒未更新时提示连接中断。日志状态不是逐 Token 的模型内部进度。原始日志格式发生变化时，状态可能暂时无法识别。

## 本地开发

```sh
npm ci
npm run dev
```

打开 `http://127.0.0.1:4173`。预览服务只显示示例，不提供宿主生成的会话快照。

独立实时模式：

```sh
npm run live
```

终端输出带随机访问令牌的本机地址，默认端口 4174。服务仅绑定 127.0.0.1，并检查 Host、请求来源和访问令牌。退出进程即停止读取。DSH 的 `.zstd` 压缩日志需要使用 `bun scripts/live.mjs`；Node 模式只支持未压缩日志。

```sh
npm run build:vrm
npm run check
npm pack --dry-run
```

模型通过随包脚本离线加载。安装包保留可直接运行的离线模型数据脚本；Git 不包含这些大型生成文件或原始 `.vrm` / `.glb`。首次克隆需要先恢复模型资源（见下文），才能显示四位 3D 角色或执行完整模型测试；来源、许可、哈希记录保存在 `docs/models/`。AI Girls 3D 的三个 v1.0.0 ZIP 可用 `python3 scripts/import-ai-girls.py /path/to/downloads` 校验并导入。

## 许可与署名

代码采用 MIT。第三方素材不适用本项目的 MIT 许可：

- 会话解析器：Agent Office，MIT，见 `vendor/agent-office/LICENSE`。
- DeepSeek VRM：ニケ；角色上善无形 / ZipZipPipe；CC BY-NC-SA 4.0。见 `docs/models/deepseek-LICENSE.txt`。
- Claude / GPT / Gemini GLB：Manny / ningfangtianwai-pixel，AI Girls 3D v1.0.0，CC BY 4.0。本插件添加状态驱动动画和离线包装。见 `docs/models/ai-girls-3d/ATTRIBUTION.md`。
- 五张原画：ZipZipPipe，需署名、非商业用途；DeepSeek 原画保留上善无形 → ZipZipPipe → Small-tailqwq 署名链及 CC BY-NC-SA 4.0 条件。详见 `docs/artwork/` 与插件「角色图鉴」。

随包的非商业素材意味着当前完整素材包不能作为商业素材包销售。来源与检索记录见 `docs/model-search.md`。

## 发布状态

当前首个公开版本为 `0.1.0`，npm 包名为 `magpie-page-model-office`。当前为上架准备版本，尚未发布 npm 或提交插件市场。已在 Magpie 原生宿主验证真实快照、示例、筛选、详情和四位 3D 角色加载；后续验收记录及未完成项见 `docs/release-audit.md`。Qwen / Kimi 仍保留原图，不能将本版描述为全角色骨骼 3D。

## 从源码恢复 3D 资源

1. 创建 `page/assets/models/` 目录。
2. 从 [DeepSeek-chan 作者仓库](https://github.com/tegnike/deepseek-chan-vrm) 下载原始 VRM，保存为 `page/assets/models/deepseek.vrm`。SHA-256 应为 `9fa455e48ee2271dc7c2b62f2f2edcd47709406ca89067b6f544979589958f42`。
3. 从 [AI Girls 3D v1.0.0](https://github.com/ningfangtianwai-pixel/ai-girls-3d/releases/tag/v1.0.0) 下载 `claude-adult.zip`、`chatgpt-adult.zip`、`gemini.zip` 到同一目录。
4. 执行 `python3 scripts/import-ai-girls.py /path/to/downloads`，脚本校验来源清单中的哈希后导入。
5. 执行 `npm ci`、`npm run build:vrm`、`npm run check`。之后可预览或 `npm pack`。

分发安装包已包含离线模型，无需用户执行上述源码构建步骤。
