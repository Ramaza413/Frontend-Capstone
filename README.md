# Frontend Capstone

A modern frontend capstone project built with React, Vite, and Tailwind CSS.

## Tech Stack

| Tool | Purpose |
|------|---------|
| [React](https://react.dev/) | UI library |
| [Vite](https://vite.dev/) | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (included with Node.js)

## Getting Started

> Application scaffolding has not been generated yet. Once the project is initialized with Vite, use the steps below.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Project Structure

```
Frontend-Capstone/
├── public/              # Static assets
├── src/
│   ├── assets/          # Images, fonts, and other media
│   ├── components/      # Reusable UI components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route-level page components
│   ├── utils/           # Helper functions and constants
│   ├── App.jsx          # Root application component
│   └── main.jsx         # Application entry point
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Coding Conventions

- **Components** — Functional components only; no class components
- **JavaScript** — ES6+ syntax (arrow functions, destructuring, modules, etc.)
- **Structure** — Keep a clean, feature-oriented folder layout
- **Commits** — Follow [Conventional Commits](https://www.conventionalcommits.org/)

### Commit Message Format

```
<type>(<optional scope>): <description>

[optional body]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:

```
feat(auth): add login form validation
fix(navbar): correct mobile menu toggle state
docs: update README setup instructions
```

## License

This project is licensed under the [MIT License](LICENSE).
