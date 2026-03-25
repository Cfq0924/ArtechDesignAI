# 白模图转渲染工具 (Artech Design AI)

基于 AI 的建筑白模图转渲染图工具，通过 DeepSeek 生成渲染 prompt，Nano Banana2 进行图像渲染。

## 快速开始

```bash
pnpm install        # 安装依赖
pnpm dev           # 启动开发服务器
```

## 可用命令

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器（自动安装依赖） |
| `pnpm build` | 生产构建 |
| `pnpm build:prod` | 生产构建（启用 prod 模式，禁用源码标识插件） |
| `pnpm lint` | 运行 ESLint 检查 |
| `pnpm preview` | 预览生产构建 |
| `pnpm clean` | 清理 node_modules 和缓存 |

## 技术栈

- **框架:** React 18.3 + TypeScript 5.6
- **构建工具:** Vite 6
- **UI 组件:** shadcn/ui (New York 风格) + Radix UI
- **样式:** Tailwind CSS 3.4
- **图标:** Lucide React
- **表单:** React Hook Form + Zod

## API 配置

本项目使用以下外部 API：

| API | 用途 | 配置项 |
|-----|------|--------|
| DeepSeek Chat | 生成渲染 prompt | `VITE_DEEPSEEK_API_KEY` |
| Nano Banana2 | 图像渲染 | `VITE_NANO_BANANA_API_KEY` |

API Key 可通过应用界面的「API 配置」按钮设置，或通过环境变量预配置。

## 项目结构

```
src/
├── App.tsx              # 主应用组件
├── config/
│   └── api.ts          # API 配置（URL、模型、参数）
├── services/
│   └── api.ts          # API 调用逻辑
├── components/
│   ├── ImageCompare    # 图像对比组件
│   ├── ApiKeyModal     # API Key 配置弹窗
│   └── ErrorBoundary   # 错误边界组件
├── hooks/
│   └── use-mobile.tsx  # 移动端检测钩子
└── lib/
    └── utils.ts        # 工具函数 (cn)
```

## 环境变量（可选）

复制 `.env.example` 到 `.env` 并填入你的 API Key：

```bash
cp .env.example .env
```

## License

MIT
