# Copilot Instructions for Nonogram Codebase


## Tech Stack (major versions)
Make sure to use correct syntax and functions for each version.
- **TypeScript**: 5
- **React**: 19
- **React Router**: 7
- **Vite**: 7
- **Tailwind CSS**: 4
- **shadcn/ui**: (pattern, install via `bunx shadcn@latest add <component>`)
- **Bun**: (use for all scripts and dependency management)
- **Biome**: 2 (linter/formatter)
- **marvinj-ts**: 0 (image processing)

## Project Overview
This project is a Nonogram (Picross) puzzle generator and player built with React, TypeScript, and Vite. It features modular UI, image-based puzzle generation, and a clean, maintainable codebase. Image processing uses MarvinJ (via marvinj-ts) and custom logic in `src/logic/image.ts`.

## Architecture & Key Patterns
- **UI Structure:**
    - All UI components use [shadcn/ui](https://ui.shadcn.com/) patterns, located in `src/components/ui/`.
    - Pages are in `src/pages/`, with each feature (game, generate, start) in its own folder.
    - State is grouped by concern (e.g., `pendingPreviewProps`, `appliedPreviewProps` in `src/pages/generate/page.tsx`).
- **Image Processing:**
    - All image manipulation (cropping, grayscale, boolean conversion) is in `src/logic/image.ts`.
    - MarvinJ is used for advanced processing; see `src/pages/generate/preview.tsx` for usage.
- **Puzzle Generation:**
    - Game logic and puzzle code validation are in `src/logic/game.ts` and `src/logic/code.ts`.
    - Random puzzle generation uses deterministic seeding for reproducibility.
- **File Upload:**
    - File upload UI is modular (`src/components/ui/file-upload.tsx`) and used in `src/pages/generate/upload.tsx`.
- **Navigation:**
    - Routing is handled in `src/app.tsx` using React Router.

## Developer Workflows
- **Development:**
    - Start dev server: `bun run dev`
    - Build: `bun run build`
    - Preview: `bun run preview`
- **Lint/Format:**
    - Lint & format: `bun run lint`
    - Type check: `bun run check`
- **Dependencies:**
    - Always use `bun` for installing/updating dependencies.
    - To add shadcn/ui components: `bunx shadcn@latest add <component>`

## Project-Specific Conventions
- **Preview Logic:**
    - Preview is only updated when the user clicks the "Preview" button (see `src/pages/generate/page.tsx`).
    - Maintain separate state for pending (editable) and applied (previewed) config.
- **State Management:**
    - Group related state into objects for clarity (e.g., file uploads, preview props).
- **Component Boundaries:**
    - Upload logic is modular; preview state is managed at the page level.
- **Naming:**
    - Use descriptive, camelCase names for variables and functions.
- **Testing:**
    - Follow modularity and state grouping patterns when adding new features or tests.

## Integration Points
- **Image Processing:**
    - Use MarvinJ and helpers in `src/logic/image.ts` for all image manipulation.
- **UI:**
    - All UI must follow shadcn/ui patterns. If a component is missing, install it with `bunx shadcn@latest add <component>`.

## Key Files & Examples
- `src/pages/generate/page.tsx`: State grouping, preview logic, explicit user triggers
- `src/pages/generate/preview.tsx`: Image processing pipeline
- `src/components/ui/file-upload.tsx`: Modular file upload UI
- `src/logic/game.ts`, `src/logic/code.ts`: Puzzle/game logic

---
_Last updated: 2025-08_
