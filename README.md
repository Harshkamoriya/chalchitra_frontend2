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

---

## Backend Overview

Although this repository is focused on the frontend, the project includes a robust backend built with Next.js API routes (in `app/api/`) and Mongoose models for MongoDB. The backend handles all business logic, authentication, and data management for the marketplace.

### API Structure

All backend logic is implemented using Next.js API routes under the `app/api/` directory. These endpoints provide RESTful APIs for the following resources:

- **Users**: Registration, authentication, profile management
- **Gigs**: CRUD operations for video editing gigs
- **Orders**: Placing and managing orders between clients and editors
- **Reviews**: User reviews for gigs and editors
- **Earnings**: Tracking editor earnings
- **Withdrawals**: Withdrawal requests and status tracking
- **Notifications**: User notifications for platform events
- **Saved Gigs**: Users can bookmark gigs for later
- **Chats**: Real-time messaging between users

### Data Models

The backend uses Mongoose models for MongoDB, located in the `models/` directory. The main models include:

- **User**: Stores user information, authentication details, and roles (client/editor)
- **Gigs**: Represents video editing service listings, including details, pricing, and owner
- **Orders**: Tracks transactions between clients and editors, including status and delivery
- **Review**: Stores user reviews and ratings for gigs and editors
- **Earnings**: Tracks editor earnings from completed orders
- **Withdrawal**: Handles withdrawal requests and payment status for editors
- **Notification**: Stores notifications for user actions and platform events
- **SavedGig**: Prevents duplicate bookmarks; each user can save a gig only once
- **Chat**: Stores chat messages and conversation metadata between users

Each model is designed with appropriate references and indexes for efficient querying and data integrity. For example, the `SavedGig` model uses a compound unique index to prevent a user from saving the same gig multiple times.

### Example: SavedGig Model

```js
import mongoose from "mongoose";
const savedGigSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  gig: { type: mongoose.Schema.Types.ObjectId, ref: "Gigs", required: true },
}, { timestamps: true });
savedGigSchema.index({ user: 1, gig: 1 }, { unique: true });
export default mongoose.models.SavedGig || mongoose.model("SavedGig", savedGigSchema);
```

### API Usage

The frontend communicates with these backend endpoints using `fetch` or `axios` for:

- User authentication and session management
- Fetching, creating, and updating gigs
- Placing and tracking orders
- Submitting and viewing reviews
- Managing earnings and withdrawals for editors
- Sending and receiving notifications
- Bookmarking gigs
- Real-time chat between users

---

## Additional Folders

- **lib/**: Contains utility functions and helpers used across the app and API routes.
- **providers/**: Contains context providers for authentication, state management, or third-party integrations.
- **public/**: Static files served at the root level (e.g., images, favicon, robots.txt).

---

## Roadmap

- [x] Modular frontend with Next.js App Router and Tailwind CSS
- [x] Comprehensive backend with RESTful API routes
- [x] User authentication and role management
- [x] Gigs CRUD and search
- [x] Orders and review system
- [x] Earnings and withdrawal management
- [x] Notifications and real-time chat
- [x] Saved gigs/bookmarking
- [ ] Payment gateway integration
- [ ] Admin dashboard and analytics

---


## Notable Frontend Pages

ChalChitra includes several custom pages to enhance the user and seller experience. Below are some key pages and their roles in the platform:

### Seller Onboarding & Tips

- **`/seller_form` (`app/seller_form/page.jsx`)**  
  This page guides new editors through the onboarding process. It features:
  - An engaging video introduction and live preview.
  - A three-step process for editors: building a profile, uploading work samples, and launching their first gig.
  - Highlights of platform benefits such as competitive rates, flexible schedules, and portfolio building.
  - Responsive design with a clear call-to-action to become a video editor.

- **`/seller_form/tips` (`app/seller_form/tips/page.jsx`)**  
  This page provides actionable tips for editors to create a successful profile, including:
  - Crafting a detailed profile and showcasing work.
  - Listing tools and software expertise.
  - Uploading a professional profile picture.
  - Clearly describing services and verifying identity.
  - Visual progress indicators and navigation for a smooth onboarding flow.

### Become a Seller Landing

- **`/become_seller` (`app/become_seller/page.jsx`)**  
  This page acts as a landing for users interested in joining as editors. It renders the `LandPage` component, which likely contains promotional content and a call-to-action for potential sellers.

---

These pages are designed to streamline the seller onboarding process, provide guidance, and encourage editors to present their skills effectively on the platform.


## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

---

## License

This project is licensed under the MIT License.


---