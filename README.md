# ChalChitra Frontend
ChalChitra is a web-based marketplace where users can browse, hire, and collaborate with video editors. This is the frontend interface built using Next.js and Tailwind CSS.

This is the frontend for **ChalChitra**, a Next.js-based marketplace for video editing services. It is bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app) and uses modern React, Tailwind CSS, and a modular component structure.

## Project Structure

```
frontend/
│
├── app/           # Next.js app directory (routing, pages, layout, global styles)
│   ├── layout.js
│   ├── page.js
│   └── globals.css
│
├── components/    # Reusable React components (UI, layout, sections)
│   ├── Footer.jsx
│   ├── Navbar.jsx
│   ├── HeroWrapper.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── ui/        # Design system UI components (Button, Input, Badge, etc.)
│
├── lib/           # Utility functions and helpers
│   └── utils.js
│
├── assets/        # Static assets and product data
│   ├── assets.js
│   └── productData.js
│
├── public/        # Public static files (served at root)
│
├── .gitignore
├── components.json
├── eslint.config.mjs
├── jsconfig.json
├── next.config.mjs
├── package.json
├── postcss.config.mjs
└── README.md
```

### Key Folders

- **app/**  
  Contains the main application entry points, layouts, and global CSS. Uses the Next.js App Router for routing and layout composition.

- **components/**  
  Houses all React components, including layout (e.g., [`components/Footer.jsx`](components/Footer.jsx), [`components/Navbar.jsx`](components/Navbar.jsx)), page sections (e.g., [`components/HeroWrapper.jsx`](components/HeroWrapper.jsx)), and UI primitives (in [`components/ui/`](components/ui/)).

- **lib/**  
  Contains utility functions, such as [`lib/utils.js`](lib/utils.js) for class name merging and other helpers.

- **assets/**  
  Stores static assets (images, icons) and product data used throughout the app.

- **public/**  
  For static files that should be served directly (e.g., favicon, robots.txt).

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Features

- Modern Next.js App Router
- Tailwind CSS for styling
- Modular, reusable component structure
- Utility functions for class management
- Example product data and assets

## Customization

- Edit pages and layouts in the `app/` directory.
- Add or modify UI components in `components/` and `components/ui/`.
- Update utility functions in `lib/`.
- Add images or product data in `assets/`.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev/)

---

**Note:** This project does not include backend logic. See the `backend/` folder for backend code.