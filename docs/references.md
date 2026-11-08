# 素材来源与实现依据

更新日期：2026-11-05。本版按用户要求直接使用网上已有形象，替换之前六张自行绘制的通用 SVG；旧 SVG 仅留作历史素材，不再被角色页面引用。

## 当前使用的图片

| 角色 | 版本 | 作者 / 创作链 | 条件 |
| --- | --- | --- | --- |
| DeepSeek | 深海女仆工坊 · 开心 Q 版 | 上善无形 → ZipZipPipe → Small-tailqwq | CC BY-NC-SA 4.0 |
| GPT | 《AI娘化》完整立绘 | ZipZipPipe | 署名、不可商用 |
| Claude | 《AI娘化》完整立绘 | ZipZipPipe | 署名、不可商用 |
| Gemini | 《AI娘化》完整立绘 | ZipZipPipe | 署名、不可商用 |
| Qwen | 《AI娘化》完整立绘 | ZipZipPipe | 署名、不可商用 |
| Kimi | 《AI娘化》完整立绘 | ZipZipPipe | 署名、不可商用 |

- ZipZipPipe 原图集：https://www.pixiv.net/artworks/148186519
- ZipZipPipe 主页：https://www.pixiv.net/users/18604994
- 鲸鱼娘原角色动态：https://www.bilibili.com/opus/1231977657712771073
- 二次设计声明：https://t.bilibili.com/1231980045693616162
- 深海女仆工坊素材：https://github.com/Small-tailqwq/dsh-deep-whale/tree/825d02b0e569c370ae15ceed12d9393559b3e4f4/maid-atelier
- 许可概要：https://creativecommons.org/licenses/by-nc-sa/4.0/

## 获取与处理记录

通过 AI Moe Atlas 收录的 `collected/` 目录取得现有图片，固定至提交 `39101acd3ae252359e75d0ad25dc653682a220af`：
https://github.com/SelinLee/ai-moe-atlas/tree/39101acd3ae252359e75d0ad25dc653682a220af/public/collected

采用该目录 `preview.webp` 的原始字节，未重新生成、裁剪、抠除背景或修改内容。网页以 CSS `object-fit: contain` 完整等比显示；上游已做技术性尺寸与格式规范化。未采用该图鉴 `generated/` 下的后续生成形象。

逐图下载 URL、SHA-256 和采集日期见 `artwork/manifest.json`。每位角色的 `*-source.json`、作者声明证据及 README 均随项目保留。证据快照为上游的采集记录；本次 Pixiv 原网页未能直接打开，不声称重新核验了其最新文本。

## 项目内展示与许可

卡片显示作者，详情提供原作链接和使用条件。角色昵称、房间名及台词是本项目的氛围文案，不冒充作者原设。第三方图片不适用本项目软件 MIT 许可，遵循各自上游条件。不同作者版本并存，这套形象不是厂商官方或社区唯一版本。

## 技术依据

- Magpie 社区插件：https://github.com/magpie-community/plugins
- 页面接口：https://usemagpie.ai/docs/plugins
- 用量数据示例：https://github.com/magpie-community/plugins/tree/main/packages/usage

## 3D 实现更新（2026-11-06）

新增程序化立体角色和关节动画，根据社区外观特征建模，并非声称取得原作者 3D 原件。2D 图鉴继续使用原立绘。新增几何表现沿用上游角色设计的署名与非商用条件，软件代码 MIT 不授予角色设计额外权利。

Three.js r169 取自同一 agent-office 固定提交的 `page/three.min.js`，完整 MIT 声明位于文件头。场景和动画实现为本项目 `page/scene3d.js`。
