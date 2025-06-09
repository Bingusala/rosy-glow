# Rosy Glow Cosmetics - Frontend

This is the React TypeScript frontend for the Rosy Glow Cosmetics e-commerce platform.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend server running on `http://localhost:8080`

### Installation & Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd cosmetics-frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

4. **Open your browser:**
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080` (should be running)

## 🎨 Features

### ✅ Completed Features
- **Beautiful UI Design** - Material-UI with custom pink theme
- **User Authentication** - Login/Register with JWT tokens
- **Product Catalog** - Browse products with categories and search
- **Shopping Cart** - Add/remove items, quantity management
- **Responsive Design** - Mobile-friendly layout
- **Navigation** - Intuitive navbar with search functionality

### 🔧 Tech Stack
- **React 19** with TypeScript
- **Material-UI (MUI)** for components and styling
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management

### 📱 Pages & Components

#### Authentication
- `/login` - User login page
- `/register` - User registration page

#### Products
- `/` - Homepage with all products
- `/category/:id` - Products by category
- `/search?q=query` - Search results
- `/products/:id` - Product detail page (placeholder)

#### Shopping
- `/cart` - Shopping cart page
- `/checkout` - Checkout process (placeholder)

#### User Account
- `/profile` - User profile page (placeholder)
- `/orders` - Order history (placeholder)

#### Admin
- `/admin` - Admin dashboard (placeholder)

## 🔗 API Integration

The frontend connects to the Spring Boot backend API running on `http://localhost:8080`:

### Key API Endpoints Used:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/categories` - Fetch categories
- `GET /api/products` - Fetch products (with pagination)
- `GET /api/products/category/{id}` - Products by category
- `GET /api/products/search` - Search products
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/{id}` - Update cart item
- `DELETE /api/cart/items/{id}` - Remove from cart

## 🎯 Default Login Credentials

For testing, you can use the admin account created by the backend:
- **Username:** `admin`
- **Password:** `admin123`

## 🛠️ Development

### Project Structure
```
src/
├── components/
│   ├── auth/          # Login, Register components
│   ├── cart/          # Shopping cart components  
│   ├── layout/        # Navigation, Layout components
│   └── products/      # Product listing, cards
├── context/           # React Context (Auth, Cart)
├── services/          # API service layer
├── types/             # TypeScript type definitions
└── App.tsx           # Main app component with routing
```

### Available Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🎨 Design Features

- **Pink Color Scheme** (#e91e63) for cosmetics brand feel
- **Clean Cards** for product display
- **Responsive Grid** layout for products
- **Sticky Cart Badge** showing item count
- **Search Functionality** in navbar
- **Category Filtering** on homepage
- **Professional Typography** with Inter font

## 🔄 State Management

### Authentication Context
- User login/logout state
- JWT token management
- Role-based access (Admin/Customer)

### Cart Context  
- Shopping cart items
- Cart operations (add, update, remove)
- Cart count for navbar badge

## 🚧 Upcoming Features

- Product detail pages
- Checkout process
- Order management
- User profile management
- Admin dashboard
- Payment integration
- Product reviews
- Wishlist functionality

## 📞 Support

If you encounter any issues:
1. Ensure the backend server is running on port 8080
2. Check the browser console for any errors
3. Verify API connectivity in the Network tab
4. Try refreshing the page or clearing browser cache

---

**Happy Shopping! 💄✨**