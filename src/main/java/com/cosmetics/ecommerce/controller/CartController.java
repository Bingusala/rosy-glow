package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.CartDto;
import com.cosmetics.ecommerce.service.CartService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@PreAuthorize("hasRole('ROLE_CUSTOMER')")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<CartDto> getCart(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(cartService.getCartByUserId(userId));
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> addItemToCart(
            Authentication authentication,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(cartService.addItemToCart(userId, productId, quantity));
    }

    @PutMapping("/items/{itemId}")
    public ResponseEntity<CartDto> updateCartItem(
            Authentication authentication,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(cartService.updateCartItem(userId, itemId, quantity));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> removeCartItem(
            Authentication authentication,
            @PathVariable Long itemId) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(cartService.removeCartItem(userId, itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<CartDto> clearCart(Authentication authentication) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(cartService.clearCart(userId));
    }

    private Long getUserIdFromAuthentication(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        // You would typically fetch the user's ID based on the username
        // For now, let's assume we can extract it from the authentication principal
        // In a real application, you would use a service to fetch the user ID
        return 1L; // Placeholder, needs to be implemented correctly
    }
} 