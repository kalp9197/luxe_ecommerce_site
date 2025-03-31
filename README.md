# Luxe E-commerce Platform

A full-featured e-commerce platform with a beautiful UI and smooth animations built with the MERN stack (MongoDB, Express, React, Node.js) and Prisma ORM.

## Features

- **User Authentication**: Sign up, login, and profile management with JWT
- **Product Management**: Browse, search, filter, and sort products
- **Shopping Cart**: Add, update, remove items
- **Checkout Process**: Integrated with Stripe
- **Order Management**: Track orders and order history
- **Admin Dashboard**: Manage products, categories, orders, and users
- **Responsive Design**: Works on all devices
- **Animations**: Smooth transitions and interactive elements

## Tech Stack

### Frontend

- React (with TypeScript)
- Tailwind CSS
- Framer Motion (for animations)
- React Query
- Context API

### Backend

- Node.js & Express
- MongoDB
- Prisma ORM
- JSON Web Tokens (JWT)
- Stripe (payment processing)

## Project Structure

```
luxe_ecommerce_site/
├── frontend/               # React frontend
│   ├── public/             # Static files
│   ├── src/                # React source code
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # Utilities
│   │   ├── pages/          # Page components
│   │   └── services/       # API service functions
│   └── ...
├── backend/                # Node.js backend
│   ├── prisma/             # Prisma schema & migrations
│   ├── src/                # Express source code
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── utils/          # Utility functions
│   │   └── server.js       # Express app
│   └── ...
├── package.json            # Root package.json for project
└── ...
```

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- MongoDB account (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kalp9197/luxe_ecommerce_site.git
   cd luxe_ecommerce_site
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   # Copy example env files
   cp backend/.env.example backend/.env
   ```

4. Update the `.env` file with your MongoDB connection string and other variables.

5. Generate Prisma client:

   ```bash
   npm run --workspace=backend prisma:generate
   ```

6. Seed the database:

   ```bash
   npm run seed
   ```

7. Start the development servers:

   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Login Credentials

For testing purposes, you can use these credentials:

- **Admin User**:

  - Email: admin@example.com
  - Password: admin123

- **Regular User**:
  - Email: john@example.com
  - Password: user123

## Deployment

### Frontend

The frontend can be deployed to platforms like Vercel, Netlify, or GitHub Pages.

```bash
npm run build:frontend
```

### Backend

The backend can be deployed to platforms like Heroku, Render, or AWS.

```bash
# Start production server
npm start
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
