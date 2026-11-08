# 原图与现成模型核查

## 新增可公开下载来源：AI Girls 3D（2026-11-07）

- 来源：https://github.com/ningfangtianwai-pixel/ai-girls-3d ，作者 Manny / ningfangtianwai-pixel，v1.0.0，CC BY 4.0。模之屋对应 Gemini 页面：https://www.aplaybox.com/details/model/ZqfaqjvVGpQC 。
- 已读取仓库许可、署名、模型统计并查看完整预览：Claude 橙发裙装、GPT 白发龙娘、Gemini 紫发猫娘均对应目标娘化设计。包含成年/幼年变体，共七个资产。
- 已启动下载 claude-adult.zip、chatgpt-adult.zip、gemini.zip 到 `/tmp/ai-girls-downloads`，尚未完成文件哈希和 GLB 内部核验，不能视为已经安装。
- 作者明确这些版本没有完整人体骨骼，提供点头、转头、呼吸等基础形态键；Gemini 统计 267626 三角面、0 骨骼、0 动画片段。可尝试形态键驱动，但不应称为完整骨骼动画。
- 许可、署名、预览及发布清单备份：`docs/models/ai-girls-3d/`。
- 新增八角色 Q 版来源：https://www.aplaybox.com/details/model/AqsidGCLuiHU ，作者渴望被问路的阿诺德。包括 Grok/Claude/Gemini/DeepSeek/GPT/GLM/Qwen/Kimi；预览为方块积木风娘化变体。页面允许修改、再分发、非视频用途，禁止商用；下载需要登录、关注、点赞。没有下载或替换当前角色，骨骼信息尚不明确。
- 已分别用模之屋站内搜索 Qwen 和 Kimi：相关结果仍为 sdn1111 全家桶及上述积木 Q 版合集；本轮未见独立、完整绑定且允许插件用途的目标形象结果。
- 接入准备：`src/glb-runtime.js` 支持独立 GLB 场景与形态键动画，构建脚本只启用本地已存在的 Claude/GPT/Gemini GLB。当前源文件仍在下载，因此尚未启用新角色。构建与现有 21 项检查通过；实际模型形态键效果仍待下载后验证。
- 部分文件结构核验：从持续下载的 ZIP 中解压已到达的 GLB JSON 头部（未导入、不算完整文件校验），确认 GPT/Gemini 各 3 个网格，含 Head_Nod/Head_Turn/Breath 和嘴型；Claude 1 个网格，额外含 Arm_L/Arm_R。三者均不依赖 Draco 等压缩扩展。完整 ZIP 哈希和实际顶点动画效果仍待后续验证。

## 最新突破：2026-11-07 模之屋站内核查

用户明确：只找现有娘化形象，不接受 Claudesona 吉祥物替代。

- **GPT 可接入候选**：[bxskl 的 ChatGpt 大白龙 VRM](https://www.aplaybox.com/details/model/RIcwk1JaSFTY)。作者明确参考 ZipZipPipe GPT 娘，带 MMD 表情键；预览确认白发、龙角、白紫长裙、龙翼和大龙尾。作者允许改模与二次发布、要求署名；页面允许非视频用途，禁止商用。作者提示长裙少量穿模。点击 Download 后出现登录页，另有点赞/收藏要求；当前未登录，尚未取得或验证文件，也未安装。
- **同形象全家桶**：[sdn1111 的 AI 娘全家桶](https://www.aplaybox.com/details/model/3uR3BbUTlkUW)。预览确认现有 Claude/GPT/Gemini/Qwen/Kimi 形象，还包含 GLM/Grok/MiniMax/豆包等。作者说明绑定和表情尚未成功。页面虽允许改模与二次配布，但明确禁止视频制作以外用途，不能直接打包进 Magpie，需作者另行授权软件交互用途。
- **Claude 单独配布**：[deepseek 娘 + claude 大小姐](https://www.aplaybox.com/details/model/QkZP5LeHUN2J)，同作者，骨骼不完善且同样限制视频用途。
- **豆包绑定版**：[鹿铃的绑定配布](https://www.aplaybox.com/details/model/b6GXXo740OUq)，原建模 sdn1111，作者声明包含 blend/fbx/obj/pmx，允许非视频用途、修改和再发布，禁止商用。预览为黑短发黑裙的官方风格豆包，不是目前六位角色之一，未擅自添加。
- sdn1111 的 B 站主页：https://space.bilibili.com/3546568969947566 （hihihihi202）。没有联系或发送消息。

以上核查了作者页、预览和下载入口，不代表已验证下载包内容。下一步需要取得 GPT VRM；全家桶则需要额外用途授权和骨骼修整。

当前：DeepSeek 已接入真实骨骼 VRM，其余五位保留原图，等待符合形象的现成模型。以下保留素材核查记录。

- 直接使用已存来源记录对应的六张原文件。Pixiv 原图和固定版本镜像按 SHA-256 校验，地址见各角色 `*-source.json`。
- 镜像：https://github.com/selinlee/ai-moe-atlas/tree/39101acd3ae252359e75d0ad25dc653682a220af/public/collected
- DeepSeek VRoid 配布线索：https://www.bilibili.com/video/BV1Zsb96dEDX/ 。发布描述允许非商业桌宠等用途，但尚未下载核对模型文件与目标立绘的一致性，不随插件打包。
- https://github.com/HABAI182/ai-girls-atlas/blob/main/characters/deepseek/README.md 列出其他 MMD/Live2D 来源。这是整理资料，不视为所有模型的统一使用许可。
- 对 Small-tailqwq/dsh-deep-whale 的固定版本 825d02b0e569c370ae15ceed12d9393559b3e4f4 及当前 6e51eeebaea277507f0a0369e208ad58d4d6a2e3 GitHub 文件树进行核查，未找到 .glb/.gltf/.vrm/.blend 文件。

早期版本使用原图 2.5D；现已由下述 DeepSeek VRM 替换该角色。

## 后续核查：真实 3D 模型（2026-11-06）

已取得并接入：
- https://github.com/tegnike/deepseek-chan-vrm ：DeepSeek-chan VRM 1.0，66 个网格、蒙皮与人形骨骼；作者ニケ，角色上善无形 / ZipZipPipe。CC BY-NC-SA 4.0。原始文件 SHA-256：9fa455e48ee2271dc7c2b62f2f2edcd47709406ca89067b6f544979589958f42。

其他线索及结果：
- https://booth.pm/ko/items/8777527 ：水原镜的 Blue Fat Fish，VRChat/Warudo 等格式，备选 DeepSeek 来源。
- https://github.com/SkyeShark/claudes-body ：有真实 Claude VRM，但外形是橙色放射头、紫毛衣的 Claudesona，不是本项目所选橙发书本少女，未替换。
- https://www.bilibili.com/video/BV192YX64EHu/ ：GPT 娘 3D 展示线索，指向 BV13PYx6GE66；未取得模型配布文件，不能算已接入。
- https://github.com/suhong11300/gpt-niang ：2D 分层桌宠素材，不是三维网格，未当作 3D 使用。
- 针对 Gemini / Qwen / Kimi 的娘化、VRM、PMX、GLB 和配布检索，尚未找到可核实且符合当前角色形象的文件。这不等同于断言网上不存在。

用户选择：无 Tripo 账号，继续找现成模型，不注册或购买生成服务。

2026-11-07 补充：Claude 娘桌宠 https://github.com/deanzhang2026-max/claude-chan-desktop-pet 的 B 站发布页 BV17enb6NE1y 明确介绍为 2.5D，未作为三维骨骼模型接入。

## 2026-11-07 第二轮检索

- GPT：新增核查 https://github.com/DavidHLP/gpt-maiden-pet 。作者明确为 2D sprite，虽然附 Blender 时间轴，也不能视为三维人物模型。
- GPT：新增核查 https://github.com/ycwycw2020/GPT_Dragon_girl_transformation ，作者标注 Live2D，不作为 VRM/PMX 接入。
- GPT 视频源追查：B 站公开接口确认 BV13PYx6GE66 标题「ds降价，gpt6发布结算画面」，作者「偏爱阁边一隅雪」，简介仅为「-」，没有模型配布地址。公开热门评论第一页未见模型来源；后续评论分页请求返回 HTTP 412，未能核完，不能断言作者从未配布。
- 新的设定资料：https://github.com/Dream-238/ai-chan-sheets-self ，提供三视图和饰品拆解等图片，属于建模参考，非现成三维文件。
- Gemini/Qwen/Kimi：本轮中英文名称搭配 VRM、PMX、MMD、配布、建模检索仍未取得对应形象的下载文件。搜索中的 Qwen 推理权重、其他同名人物和通用虚拟主播项目不算角色模型。

下一步仍可核查：模之屋/VRoid Hub 站内目录与作者作品页；GPT 视频评论因读取失败仍未结案。尚无新增可安装模型。

## 2026-11-07 平台站内核查

| 候选 | 作者/格式 | 核查结果 |
|---|---|---|
| [Grok Ani ver0.05](https://hub.vroid.com/en/characters/531637386647707645/models/6137393977179099395) | も〜り〜（Mory）♪；3D 同人作品 | 作者明确标注 xAI Grok Ani；使用栏 No，cannot be downloaded，仅平台展示。简介称计划在 BOOTH 等站发布，但本页未给配布地址。 |
| [Aniちゃん](https://hub.vroid.com/en/characters/8197449884000378437/models/1288086754473807137) | 黒葉/Viper；3D 角色 | 页面预览为金发双马尾黑裙，描述为重现 Twitter 热门角色；使用栏 No，不能下载。 |
| [GPTI2さん Maid Version](https://hub.vroid.com/en/characters/1617190024855737640/models/3012853532984880254) | 草薙涼音；VRM 1.0 | 可使用但禁止再分发。描述只是用 GPT Image 2 生成贴图，没有社区 GPT 白龙娘身份，排除。 |
| [AI Grok](https://sketchfab.com/3d-models/ai-grok-18a112e0218848ca8d0611d81a16e870) | mastertob；静态网格 | 官方公开 API 确认为爬虫 DNA 与纳米机器的战士角色，非 Ani；isDownloadable=false，animationCount=0，排除。 |
| [Ani Grok / RigModels](https://rigmodels.com/model.php?view=Ani_Grok-3d-model__ST8YD33AA7WSKRHSBAB7FFT7U) | 聚合站声称 FBX、OBJ 等；67016 面 | 页面声称免费下载，但没有可核实原作者和模型再分发许可，尚未作为可打包资产。 |

本轮没有新增已取得模型；不把仅供展示的资源或同名原创人物记为可安装资源。Claude 的 VRoid 搜索出现同名项，但详情尚未核实；模之屋页面需 JavaScript，网页读取没有返回目录。
