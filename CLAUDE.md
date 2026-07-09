# CLAUDE.md

Guidance for AI assistants working on this repository.

## Project Overview

Frontend Capstone is a React application scaffolded with Vite and styled with Tailwind CSS. This file describes conventions and expectations for code generation and edits.

## Tech Stack

- **React** — UI rendering and component model
- **Vite** — Dev server, bundling, and HMR
- **Tailwind CSS** — Utility-first CSS framework

## Coding Conventions

### React

- Use **functional components** exclusively; do not use class components
- Prefer named exports for components; use default exports only for page/route entry points if the project adopts that pattern
- Extract reusable logic into custom hooks in `src/hooks/`
- Keep components focused; split large components into smaller, composable pieces
- Use meaningful prop names; destructure props in the function signature

### JavaScript

- Use **ES6+** features: arrow functions, `const`/`let`, destructuring, spread/rest, template literals, and ES modules (`import`/`export`)
- Prefer `async/await` over raw Promise chains for asynchronous code
- Avoid unnecessary abstractions; favor readable, direct code

### Styling

- Use Tailwind utility classes as the primary styling approach
- Extract repeated class combinations into reusable components rather than duplicating long class strings
- Keep custom CSS minimal; place global styles in the main CSS entry file if needed

### Folder Structure

```
src/
├── assets/       # Static media (images, icons, fonts)
├── components/   # Shared, reusable UI components
│   └── ui/       # Primitive UI elements (buttons, inputs, etc.)
├── hooks/        # Custom React hooks
├── pages/        # Route-level views
├── utils/        # Pure helpers, constants, formatters
├── App.jsx       # Root component
└── main.jsx      # Entry point
```

- Colocate component-specific helpers near the component when they are not reused elsewhere
- Move shared logic to `hooks/` or `utils/` when used in multiple places
- Name files in PascalCase for components (`Button.jsx`) and camelCase for hooks/utilities (`useAuth.js`, `formatDate.js`)

### Git Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>
```

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, no logic change |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test` | Adding or updating tests |
| `chore` | Tooling, deps, config |

Examples:

- `feat(dashboard): add summary cards`
- `fix(form): prevent double submit on enter`
- `chore: update vite to latest patch`

## What to Avoid

- Do not introduce class components
- Do not add heavy UI libraries without explicit request
- Do not create overly nested folder hierarchies
- Do not commit secrets, API keys, or `.env` files
- Do not generate application code unless explicitly asked

## Scope of Changes

When making edits:

1. Match existing patterns in the codebase
2. Keep diffs minimal and focused on the requested task
3. Update documentation when setup or conventions change
4. Do not refactor unrelated code in the same change
