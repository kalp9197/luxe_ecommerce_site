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

## Deployment Guide

This guide will help you deploy the Luxe E-commerce application to Netlify (frontend) and Railway (backend).

### Backend Deployment to Railway

1. Sign up for a [Railway](https://railway.app/) account if you don't have one

2. Install the Railway CLI (optional)

   ```
   npm i -g @railway/cli
   ```

3. Configure environment variables on Railway:
   - DATABASE_URL - Your MongoDB connection string
   - JWT_SECRET - Secret for JWT token generation
   - NODE_ENV - Set to "production"
   - FRONTEND_URL - Your Netlify app URL (e.g., https://your-app.netlify.app)
4. Deploy using GitHub integration:

   - Connect your GitHub repository to Railway
   - Select the backend folder (if using monorepo)
   - Configure the build settings:
     - Build command: `npm install`
     - Start command: `npm start`

5. After deployment, note your Railway application URL (e.g., https://your-app.railway.app)

### Frontend Deployment to Netlify

1. Sign up for a [Netlify](https://www.netlify.com/) account if you don't have one

2. Prepare your frontend environment variables:

   - Create a `.env.production` file in your frontend directory with:
     ```
     VITE_API_URL=https://your-app.railway.app/api
     ```

3. Deploy using Netlify UI:

   - Log in to Netlify
   - Click "New site from Git"
   - Select your repository
   - Configure build settings:
     - Base directory: `frontend` (if using monorepo)
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Add environment variables:
     - VITE_API_URL: https://your-app.railway.app/api

4. Deploy site

   - Netlify will build and deploy your site
   - Your site will be available at a Netlify subdomain

5. Configure custom domain (optional):
   - Go to Site settings > Domain management
   - Add custom domain

### Post-Deployment Configuration

1. Update CORS settings:

   - In Railway, ensure FRONTEND_URL is set to your Netlify URL

2. Test the connection:

   - Open your Netlify site
   - Try to login/register to ensure connection to backend

3. Monitor for errors:
   - Check Railway logs
   - Check Netlify deploy logs
   - Monitor browser console for CORS or API errors

## Local Development

1. Clone the repository

   ```
   git clone <repository-url>
   ```

2. Install dependencies

   ```
   npm install
   ```

3. Set up environment variables

   - Create `.env` files in both frontend and backend directories

4. Start development servers

   ```
   npm run dev
   ```

5. Open http://localhost:8080 in your browser

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Prisma](https://www.prisma.io/)
- [MongoDB](https://www.mongodb.com/)
- [Stripe](https://stripe.com/)
