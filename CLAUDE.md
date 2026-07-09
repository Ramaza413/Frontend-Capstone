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

### File Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components | `PascalCase.jsx` | `UserCard.jsx` |
| Pages | `PascalCase.jsx` | `Dashboard.jsx` |
| Hooks | `use` + `PascalCase.js` | `useAuth.js` |
| Utilities | `camelCase.js` | `formatDate.js` |
| Assets | `kebab-case.ext` | `hero-banner.png` |

Use `.jsx` for files that contain JSX; `.js` for hooks and pure utilities.

### Component Naming Conventions

- Match the file name: `UserCard.jsx` exports `UserCard`
- Use **PascalCase** for component names; **camelCase** for functions and variables
- Prefix event handlers with `handle` (`handleSubmit`, `handleClose`)
- Prefix boolean props with `is` or `has` (`isLoading`, `hasError`)
- Prefix custom hooks with `use` (`useAuth`, `useLocalStorage`)
- Prefer named exports; reserve default exports for page/route entry points

### Folder Organization Guidelines

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

- Group by **type** at the top level (`components/`, `hooks/`, `pages/`)
- Nest feature-specific code under a named folder only when a feature has multiple related files (e.g., `components/auth/LoginForm.jsx`)
- Colocate private helpers with their component; promote to `hooks/` or `utils/` when reused elsewhere
- Keep nesting shallow — prefer flat folders over deep hierarchies
- Do not create empty folders ahead of need

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
