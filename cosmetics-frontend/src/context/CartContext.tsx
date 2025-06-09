import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Cart, AddToCartRequest, UpdateCartItemRequest } from '../types/api';
import { apiService } from '../services/api';
import { useAuth } from './AuthContext';

interface CartContextType {
  cart: Cart | null;
  cartCount: number;
  addToCart: (item: AddToCartRequest) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  loading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      return;
    }

    try {
      setLoading(true);
      const cartData = await apiService.getCart();
      setCart(cartData);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const addToCart = async (item: AddToCartRequest) => {
    try {
      setLoading(true);
      const updatedCart = await apiService.addToCart(item);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    try {
      setLoading(true);
      const updatedCart = await apiService.updateCartItem(itemId, { quantity });
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId: number) => {
    try {
      setLoading(true);
      const updatedCart = await apiService.removeFromCart(itemId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const updatedCart = await apiService.clearCart();
      setCart(updatedCart);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: CartContextType = {
    cart,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refreshCart,
    loading
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}