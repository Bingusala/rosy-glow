package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.OrderDto;
import com.cosmetics.ecommerce.model.Order;
import com.cosmetics.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/orders")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<OrderDto> createOrder(
            Authentication authentication,
            @RequestBody Map<String, String> orderRequest) {
        Long userId = getUserIdFromAuthentication(authentication);
        String shippingAddress = orderRequest.get("shippingAddress");
        return new ResponseEntity<>(orderService.createOrder(userId, shippingAddress), HttpStatus.CREATED);
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('ROLE_CUSTOMER')")
    public ResponseEntity<Page<OrderDto>> getUserOrders(
            Authentication authentication,
            @PageableDefault(page = 0, size = 10) Pageable pageable) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId, pageable));
    }

    @GetMapping("/orders/{id}")
    @PreAuthorize("hasAnyRole('ROLE_CUSTOMER', 'ROLE_ADMIN')")
    public ResponseEntity<OrderDto> getOrderById(
            Authentication authentication,
            @PathVariable Long id) {
        Long userId = getUserIdFromAuthentication(authentication);
        return ResponseEntity.ok(orderService.getOrderById(id, userId));
    }

    @GetMapping("/admin/orders")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<Page<OrderDto>> getAllOrders(
            @PageableDefault(page = 0, size = 10) Pageable pageable,
            @RequestParam(required = false) String status) {
        if (status != null && !status.isEmpty()) {
            try {
                Order.OrderStatus orderStatus = Order.OrderStatus.valueOf(status.toUpperCase());
                List<OrderDto> orders = orderService.getOrdersByStatus(orderStatus);
                // This is a simplified approach - in a real app, you would implement proper pagination
                Page<OrderDto> page = new org.springframework.data.domain.PageImpl<>(orders, pageable, orders.size());
                return ResponseEntity.ok(page);
            } catch (IllegalArgumentException e) {
                // Invalid order status
                return ResponseEntity.badRequest().build();
            }
        }
        return ResponseEntity.ok(orderService.getAllOrders(pageable));
    }

    @PutMapping("/admin/orders/{id}/status")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {
        try {
            Order.OrderStatus status = Order.OrderStatus.valueOf(statusUpdate.get("status").toUpperCase());
            String trackingNumber = statusUpdate.get("trackingNumber");
            return ResponseEntity.ok(orderService.updateOrderStatus(id, status, trackingNumber));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
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