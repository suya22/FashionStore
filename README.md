# Fashion Store E-commerce Platform

A full-stack e-commerce platform for clothing and fashion accessories built with the MERN stack (MongoDB, Express, React, Node.js).

![Fashion Store Screenshot](https://placeholder.svg?height=400&width=800)

## Features

- *User Authentication*: Secure login and registration system
- *Product Catalog*: Browse products with filtering and search capabilities
- *Shopping Cart*: Add, remove, and update items in cart
- *Checkout Process*: Complete purchase flow with shipping and payment options
- *User Profiles*: View order history and manage account details
- *Admin Dashboard*: Manage products, orders, and users
- *Responsive Design*: Mobile-friendly interface
- *Image Optimization*: Cloudinary integration for efficient image delivery
- *Payment Integration*: Ready for payment gateway integration

## Technologies Used

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- Bootstrap 5 for UI components
- Framer Motion for animations
- Axios for API requests

### Backend
- Node.js with Express
- MongoDB with Mongoose ODM
- JWT for authentication
- Bcrypt for password hashing
- Multer for file uploads
- Cloudinary for image storage and optimization

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Cloudinary account

### Setup Instructions

1. *Clone the repository*
   \\\`bash
   git clone https://github.com/yourusername/fashion-store.git
   cd fashion-store
   \\\`

2. *Install server dependencies*
   \\\`bash
   cd server
   npm install
   \\\`

3. *Install client dependencies*
   \\\`bash
   cd ../client
   npm install
   \\\`

4. *Set up environment variables*
   
   Create a .env file in the server directory with the following variables:
   \\\`
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   \\\`

5. *Seed the database (optional)*
   \\\`bash
   cd ../server
   node seeder.js
   \\\`
   This will create initial categories and an admin user.

## Running the Application

1. *Start the backend server*
   \\\`bash
   cd server
   npm run dev
   \\\`

2. *Start the frontend development server*
   \\\`bash
   cd client
   npm run dev
   \\\`

3. *Access the application*
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## Admin Access

After running the seeder script, you can log in as an admin with:
- Email: admin@example.com
- Password: admin123


## Image Optimization

The project uses Cloudinary for image storage and optimization. Images are automatically optimized with:
- Responsive sizing
- Format conversion
- Quality optimization
- Lazy loading

## Deployment

### Backend Deployment
1. Set up a MongoDB Atlas cluster
2. Deploy the Node.js application to a hosting service like Heroku, Vercel, or AWS
3. Set the environment variables on your hosting platform

### Frontend Deployment
1. Build the React application:
   \\\`bash
   cd client
   npm run build
   \\\`
2. Deploy the build folder to a static hosting service like Netlify, Vercel, or Firebase Hosting

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/amazing-feature)
3. Commit your changes (git commit -m 'Add some amazing feature')
4. Push to the branch (git push origin feature/amazing-feature)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Framer Motion](https://www.framer.com/motion/)
- [Cloudinary](https://cloudinary.com/)
