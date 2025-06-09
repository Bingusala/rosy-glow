import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
  TextField,
  InputAdornment
} from '@mui/material';
import {
  ShoppingCart,
  AccountCircle,
  Search,
  Logout,
  Dashboard,
  Person,
  Receipt
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';

export function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#e91e63', mb: 2 }}>
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo and Brand */}
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: 'pointer', fontWeight: 'bold' }}
            onClick={() => navigate('/')}
          >
            💄 Rosy Glow
          </Typography>

          {/* Search Bar */}
          <Box sx={{ flex: 1, mx: 4, maxWidth: 400 }}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'white',
                    },
                  },
                  '& .MuiInputBase-input::placeholder': {
                    color: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton type="submit" sx={{ color: 'white' }}>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </form>
          </Box>

          {/* Right side buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Shopping Cart */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
            >
              <Badge badgeContent={cartCount} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated ? (
              <>
                {/* User Menu */}
                <Button
                  color="inherit"
                  startIcon={<AccountCircle />}
                  onClick={handleUserMenuOpen}
                  sx={{ textTransform: 'none' }}
                >
                  {user?.fullName || user?.username}
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
                    <Person sx={{ mr: 1 }} />
                    Profile
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleUserMenuClose(); }}>
                    <Receipt sx={{ mr: 1 }} />
                    My Orders
                  </MenuItem>
                  {isAdmin && (
                    <MenuItem onClick={() => { navigate('/admin'); handleUserMenuClose(); }}>
                      <Dashboard sx={{ mr: 1 }} />
                      Admin Dashboard
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <Logout sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  sx={{ textTransform: 'none' }}
                >
                  Login
                </Button>
                <Button
                  color="inherit"
                  variant="outlined"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    textTransform: 'none',
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                    '&:hover': {
                      borderColor: 'white',
                    }
                  }}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}