package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.CartDto;
import com.cosmetics.ecommerce.dto.CartItemDto;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.model.Cart;
import com.cosmetics.ecommerce.model.CartItem;
import com.cosmetics.ecommerce.model.Product;
import com.cosmetics.ecommerce.model.User;
import com.cosmetics.ecommerce.repository.CartItemRepository;
import com.cosmetics.ecommerce.repository.CartRepository;
import com.cosmetics.ecommerce.repository.ProductRepository;
import com.cosmetics.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public CartService(CartRepository cartRepository, CartItemRepository cartItemRepository,
                      UserRepository userRepository, ProductRepository productRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    public CartDto getCartByUserId(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(user));
        
        return convertToDto(cart);
    }

    @Transactional
    public CartDto addItemToCart(Long userId, Long productId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));
        
        if (product.getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createNewCart(user));
        
        // Check if product already in cart
        CartItem existingItem = null;
        if (cart.getCartItems() != null) {
            existingItem = cart.getCartItems().stream()
                    .filter(item -> item.getProduct().getId().equals(productId))
                    .findFirst()
                    .orElse(null);
        }
        
        if (existingItem != null) {
            // Update existing item
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            existingItem.setSubtotal(existingItem.getUnitPrice().multiply(new BigDecimal(existingItem.getQuantity())));
            cartItemRepository.save(existingItem);
        } else {
            // Create new item
            CartItem cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(product.getPrice());
            cartItem.setSubtotal(product.getPrice().multiply(new BigDecimal(quantity)));
            
            if (cart.getCartItems() == null) {
                cart.setCartItems(new HashSet<>());
            }
            cart.getCartItems().add(cartItem);
            cartItemRepository.save(cartItem);
        }
        
        // Update cart total
        updateCartTotal(cart);
        
        return convertToDto(cart);
    }

    @Transactional
    public CartDto updateCartItem(Long userId, Long itemId, Integer quantity) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));
        
        // Verify item belongs to this cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to this user's cart");
        }
        
        if (cartItem.getProduct().getStockQuantity() < quantity) {
            throw new IllegalArgumentException("Not enough stock available");
        }
        
        cartItem.setQuantity(quantity);
        cartItem.setSubtotal(cartItem.getUnitPrice().multiply(new BigDecimal(quantity)));
        cartItemRepository.save(cartItem);
        
        // Update cart total
        updateCartTotal(cart);
        
        return convertToDto(cart);
    }

    @Transactional
    public CartDto removeCartItem(Long userId, Long itemId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
        
        CartItem cartItem = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart item not found with id: " + itemId));
        
        // Verify item belongs to this cart
        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new IllegalArgumentException("Cart item does not belong to this user's cart");
        }
        
        cart.getCartItems().remove(cartItem);
        cartItemRepository.delete(cartItem);
        
        // Update cart total
        updateCartTotal(cart);
        
        return convertToDto(cart);
    }

    @Transactional
    public CartDto clearCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
        
        cartItemRepository.deleteAll(cart.getCartItems());
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
        
        return convertToDto(cart);
    }

    private Cart createNewCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        cart.setTotalAmount(BigDecimal.ZERO);
        cart.setCartItems(new HashSet<>());
        return cartRepository.save(cart);
    }

    private void updateCartTotal(Cart cart) {
        BigDecimal total = cart.getCartItems().stream()
                .map(CartItem::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        cart.setTotalAmount(total);
        cartRepository.save(cart);
    }

    private CartDto convertToDto(Cart cart) {
        CartDto cartDto = new CartDto();
        cartDto.setId(cart.getId());
        cartDto.setUserId(cart.getUser().getId());
        cartDto.setTotalAmount(cart.getTotalAmount());
        
        if (cart.getCartItems() != null) {
            Set<CartItemDto> cartItemDtos = cart.getCartItems().stream()
                    .map(this::convertItemToDto)
                    .collect(Collectors.toSet());
            cartDto.setItems(cartItemDtos);
        }
        
        return cartDto;
    }

    private CartItemDto convertItemToDto(CartItem cartItem) {
        CartItemDto itemDto = new CartItemDto();
        itemDto.setId(cartItem.getId());
        itemDto.setProductId(cartItem.getProduct().getId());
        itemDto.setProductName(cartItem.getProduct().getName());
        itemDto.setQuantity(cartItem.getQuantity());
        itemDto.setUnitPrice(cartItem.getUnitPrice());
        itemDto.setSubtotal(cartItem.getSubtotal());
        itemDto.setImageUrl(cartItem.getProduct().getImageUrl());
        return itemDto;
    }
} 