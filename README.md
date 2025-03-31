# Luxe E-commerce Platform

A modern, responsive e-commerce platform built with the MERN stack (MongoDB, Express, React, Node.js) and Prisma ORM.

## 🚀 Live Demo

### Frontend

**[https://luxe-ecommerce.netlify.app/](https://luxe-ecommerce.netlify.app/)**

### Backend API

**[https://luxeecommercesite-production.up.railway.app/](https://luxeecommercesite-production.up.railway.app/)**

![Luxe E-commerce](https://luxe-ecommerce.netlify.app/screenshot.png)

## ✨ Features

- **User Authentication** - Register, login, and password recovery
- **Product Browsing** - View products by category, search functionality
- **Product Details** - Detailed product information with images
- **Shopping Cart** - Add/remove items, update quantities
- **Checkout Process** - Secure payment processing
- **User Profile** - View and update personal information
- **Responsive Design** - Optimized for mobile, tablet, and desktop
- **Dark/Light Mode** - Theme switching capabilities

## 🛠️ Technologies Used

### Frontend

- React.js with TypeScript
- Tailwind CSS for styling
- Shadcn UI components
- React Router for navigation
- React Query for data fetching
- Vite for fast development

### Backend

- Node.js with Express
- MongoDB with Prisma ORM
- JWT for authentication
- RESTful API architecture

### DevOps

- Netlify for frontend hosting
- Railway for backend deployment
- GitHub for version control
- Environment configuration for development/production

## 🚀 Deployment Guide

### Frontend Deployment (Netlify)

1. Sign up for a [Netlify](https://www.netlify.com/) account
2. Connect your GitHub repository
3. Configure build settings:
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables:
   - `VITE_API_URL`: Your backend URL
5. Deploy!

### Backend Deployment (Railway)

1. Sign up for a [Railway](https://railway.app/) account
2. Connect your GitHub repository
3. Configure environment variables:
   - `DATABASE_URL`: MongoDB connection string
   - `JWT_SECRET`: Secret for JWT tokens
   - `FRONTEND_URL`: Your Netlify frontend URL
4. Ensure your backend listens to the port provided by Railway
5. Deploy!

## 💻 Local Development

1. Clone the repository

   ```
   git clone https://github.com/yourusername/luxe-ecommerce.git
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

## 🧩 Project Structure

```
luxe-ecommerce/
├── frontend/                 # React frontend application
│   ├── public/               # Static files
│   ├── src/                  # Source files
│   │   ├── components/       # UI components
│   │   ├── contexts/         # Context providers
│   │   ├── pages/            # Page components
│   │   ├── services/         # API services
│   │   └── ...
│   └── ...
├── backend/                  # Node.js backend application
│   ├── prisma/               # Prisma schema and migrations
│   ├── src/                  # Source files
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Express middleware
│   │   ├── routes/           # API routes
│   │   └── ...
│   └── ...
└── ...
```

## 📜 API Documentation

The backend exposes RESTful APIs for the frontend to consume:

- `POST /api/users/login` - User authentication
- `POST /api/users/register` - User registration
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/categories` - Get all categories
- `POST /api/orders` - Create an order
- And more...

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

For questions or feedback, please contact:

- Email: your.email@example.com
- GitHub: [Your GitHub Profile](https://github.com/yourusername)
