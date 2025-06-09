import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  IconButton
} from '@mui/material';
import { Add, Remove, ShoppingCart } from '@mui/icons-material';
import { Product } from '../../types/api';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart({ productId: product.id, quantity: 1 });
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        height="240"
        image={product.imageUrl || 'https://via.placeholder.com/300x240?text=No+Image'}
        alt={product.name}
        sx={{ 
          objectFit: 'cover',
          cursor: 'pointer'
        }}
        onClick={() => navigate(`/products/${product.id}`)}
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography 
            gutterBottom 
            variant="h6" 
            component="h2"
            sx={{ 
              fontSize: '1.1rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': { color: '#e91e63' }
            }}
            onClick={() => navigate(`/products/${product.id}`)}
          >
            {product.name}
          </Typography>
          <Chip 
            label={product.categoryName} 
            size="small" 
            color="primary" 
            sx={{ backgroundColor: '#e91e63' }}
          />
        </Box>
        
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {product.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ color: '#e91e63', fontWeight: 'bold' }}>
            {formatPrice(product.price)}
          </Typography>
          <Typography 
            variant="body2" 
            color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
          >
            {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions sx={{ pt: 0, px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0}
          sx={{ 
            backgroundColor: '#e91e63',
            '&:hover': {
              backgroundColor: '#c2185b'
            }
          }}
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
}