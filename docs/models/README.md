# DeepSeek-chan VRM

- 作者发布仓库：https://github.com/tegnike/deepseek-chan-vrm
- 模型：DeepSeek-chan.vrm，VRM 1.0 / MToon。
- 原角色：上善无形；女仆设计：ZipZipPipe；3D 模型：ニケ。
- 使用条件：CC BY-NC-SA 4.0；非商业使用，署名，修改后以同许可分享。原许可证：deepseek-LICENSE.txt。
- 原始 VRM 文件保留。离线数据脚本仅重封装图片 URI 和二进制数据以兼容 Magpie，不改变几何、贴图像素或骨骼。
- 动画代码由本项目编写，驱动 VRM 人形骨骼及眨眼、开心表情。角色资源仍遵守上述许可。

# AI Girls 3D GLB

- 发布者：Manny / ningfangtianwai-pixel。
- 来源：https://github.com/ningfangtianwai-pixel/ai-girls-3d/releases/tag/v1.0.0
- 导入：claude-adult → claude.glb；chatgpt-adult → gpt.glb；gemini → gemini.glb。
- CC BY 4.0，署名与许可见 `ai-girls-3d/ATTRIBUTION.md` 和 `ai-girls-3d/LICENSE`。
- 三个压缩包的 SHA-256 已与作者清单比对；原始 GLB 哈希、网格数与形态键记录在 `ai-girls-3d/*-verified.json`。
- 本项目添加状态驱动形态键动画及离线数据包装，不改变原始模型网格和贴图像素。模型没有完整人体骨骼，不宣称支持全身动捕。
- 安装包仅包含运行所需离线数据脚本；原始 GLB/VRM 保留在开发目录。构建脚本去除已转为 data URI 的重复贴图二进制载荷，所有仍被引用的 bufferView 字节经过测试核验。
