import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { ProductList } from './components/products/ProductList';
import { CartPage } from './components/cart/CartPage';
import { useSearchParams } from 'react-router-dom';

// Create theme with pink color scheme
const theme = createTheme({
  palette: {
    primary: {
      main: '#e91e63',
      light: '#f8bbd9',
      dark: '#c2185b',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

// Home page component
function HomePage() {
  return <ProductList />;
}

// Category page component
function CategoryPage() {
  const categoryId = parseInt(window.location.pathname.split('/')[2]);
  return <ProductList categoryId={categoryId} />;
}

// Search page component
function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  return <ProductList searchQuery={query} />;
}

// Placeholder components for missing pages

function ProfilePage() {
  return <div>Profile Page - Coming Soon!</div>;
}

function OrdersPage() {
  return <div>Orders Page - Coming Soon!</div>;
}

function AdminPage() {
  return <div>Admin Dashboard - Coming Soon!</div>;
}

function ProductDetailPage() {
  return <div>Product Detail Page - Coming Soon!</div>;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/category/:id" element={<CategoryPage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/admin" element={<AdminPage />} />
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;