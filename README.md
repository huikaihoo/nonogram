# Nonogram Online & Generator

This project is a modern Nonogram (Picross) online player and generator, built with React, TypeScript, and Vite. It features modular UI, image-based puzzle generation, and a clean, maintainable codebase. Image processing is powered by MarvinJ (via marvinj-ts) and custom logic.

## Features
- Play puzzles interactively in the browser
- Deterministic random puzzle generation for reproducibility
- Generate Nonogram puzzles from images (work in progress)

## Folder Structure

```
nonogram/
├── public/                # Static assets (favicon, etc)
├── src/
│   ├── app.tsx            # App entry, routing
│   ├── index.css          # Tailwind & global styles
│   ├── main.tsx           # React root
│   ├── assets/            # Image/logo assets
│   ├── components/        # UI components (shadcn/ui pattern)
│   │   ├── icon/          # Icon components
│   │   └── ui/            # Shared UI primitives (button, card, file-upload, etc)
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities functions
│   ├── logic/             # Core logic (image processing, puzzle/game logic)
│   └── pages/             # App pages (game, generate, start)
│       ├── game/          # Game board, cell, hint, etc
│       ├── generate/      # Image upload, preview, controls
│       └── start/         # Start page, random puzzle, puzzle input
├── .env                   # Environment variables for production build
├── biome.json             # Biome linter/formatter config
├── index.html             # Main HTML file
├── package.json           # Project metadata & scripts
├── pwa.apple.ts           # Config for pwa-assets-generator (apple-touch-icon)
├── tsconfig*.json         # TypeScript configs
└── vite.config.ts         # Vite configs
```

## Getting Started

### Prerequisites
```sh
brew install bun
bun install
bunx --bun simple-git-hooks

# Create .env.local for local development
echo -e "VITE_ENABLE_HTTPS=false\nVITE_BASE_URL=/" > .env.local
```

### Useful Commands
```sh
bun dev # Start development server
bun check # Lint & type check
bun run build # Build for production
bun preview # Preview production build

bunx --bun shadcn@latest add <component> # Add shadcn/ui component
bun pwa-assets-generator --config pwa.apple.ts # Generate apple-touch-icon

bunx --bun taze # Update dependencies
bunx --bun depcheck # Check for unused dependencies
bunx --bun vite-bundle-visualizer # Visualize Vite bundle
```

## Contributing

Pull requests and issues are welcome! Please follow the existing code style and patterns (see `.github/copilot-instructions.md` for AI automation conventions).
