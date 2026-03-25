# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm install         # Install dependencies
pnpm dev             # Start development server (auto-installs deps)
pnpm build           # Production build
pnpm build:prod      # Production build with BUILD_MODE=prod
pnpm lint            # Run ESLint
pnpm preview         # Preview production build
pnpm clean           # Clean node_modules and cache
```

## Environment Variables

Copy `.env.example` to `.env` and configure API keys:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_DEEPSEEK_API_KEY` | Yes | DeepSeek API key for prompt generation |
| `VITE_DEEPSEEK_BASE_URL` | No | DeepSeek API URL (defaults to official endpoint) |
| `VITE_DEEPSEEK_MODEL` | No | DeepSeek model name (default: deepseek-chat) |
| `VITE_NANO_BANANA_API_KEY` | Yes | Nano Banana2 API key for image rendering |
| `VITE_NANO_BANANA_BASE_URL` | No | Nano Banana2 API URL (defaults to official endpoint) |

API configuration is file-based only, configured via `.env` file.

## Tech Stack

- **Framework:** React 18.3 with TypeScript 5.6
- **Bundler:** Vite 6 with `@vitejs/plugin-react`
- **UI:** shadcn/ui (New York style) with Radix UI primitives
- **Styling:** Tailwind CSS 3.4 with CSS variables for theming
- **Icons:** Lucide React
- **Routing:** React Router v6
- **State:** React hooks (useState, useCallback)
- **Forms:** React Hook Form with Zod validation

## Architecture

**Path Alias:** `@/*` resolves to `./src/*`

**Source Structure:**
- `src/App.tsx` - Main application component, contains all UI logic and state
- `src/services/api.ts` - External API integrations (DeepSeek, Nano Banana2)
- `src/config/api.ts` - API configuration (base URLs, models, system prompts, parameters)
- `src/components/` - Reusable UI components (ImageCompare, ErrorBoundary)
- `src/hooks/` - Custom React hooks
- `src/lib/utils.ts` - Utility functions (`cn` for className merging)

**Key Patterns:**
- All state managed in App.tsx, passed down to child components
- API keys read from environment variables via `import.meta.env`
- Fallback logic: API failures return locally-generated results
- Image processing uses HTML5 Canvas for demo renders

**External APIs:**
- DeepSeek Chat API - generates rendering prompts
  - URL: `https://api.deepseek.com/v1/chat/completions`
  - Model: `deepseek-chat`
  - Config: `src/config/api.ts` (systemPrompt, temperature, maxTokens)
- Nano Banana2 API - performs image-to-image rendering
  - URL: `https://api.nanobanana.io/v2/render`
  - Config: `src/config/api.ts` (imageParam, promptParam)

**Vite Plugins:**
- `vite-plugin-source-identifier` - adds `data-matrix` attributes for source tracking (disabled in prod mode)

## Conventions

- Components use `export default` for main export
- Interfaces defined at top of files using them
- Chinese UI text, English code/interface names
- Immutability: new objects spread from previous state

## Path Alias

`@/*` resolves to `./src/*` (configured in vite.config.ts)
