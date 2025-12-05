# Campaigns management System Backend Frontend

This is the frontend application for the E-commerce System, built with React, TypeScript, and Vite.


## Tech Stack

- **Framework**: [React](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Routing**: [React Router](https://reactrouter.com/)

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation
From the repo root:
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Development Server

To start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is busy).

### Building for Production

To build the application for production:

```bash
npm run build
```

This will generate the static files in the `dist` directory.

## Project Structure

The `src` directory contains the source code:

- `components/`: Reusable UI components (e.g., Navbar, ProductCard).
- `pages/`: Page components corresponding to routes (e.g., LandingPage, CartPage).
- `context/`: React Context definitions (if any).
- `hooks/`: Custom React hooks.
- `types/`: TypeScript type definitions.
- `utils/`: Utility functions.
- `App.tsx`: Main application component and routing setup.
- `main.tsx`: Entry point of the application.