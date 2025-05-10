package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.OrderDto;
import com.cosmetics.ecommerce.dto.OrderItemDto;
import com.cosmetics.ecommerce.exception.ResourceNotFoundException;
import com.cosmetics.ecommerce.model.*;
import com.cosmetics.ecommerce.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    public OrderService(OrderRepository orderRepository, OrderItemRepository orderItemRepository,
                        UserRepository userRepository, CartRepository cartRepository,
                        ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public OrderDto createOrder(Long userId, String shippingAddress) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Cart not found for user: " + userId));
        
        if (cart.getCartItems() == null || cart.getCartItems().isEmpty()) {
            throw new IllegalArgumentException("Cannot create order with empty cart");
        }
        
        // Create order
        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING);
        order.setTotalAmount(cart.getTotalAmount());
        order.setShippingAddress(shippingAddress);
        
        // Save order first to get ID
        Order savedOrder = orderRepository.save(order);
        
        // Convert cart items to order items
        Set<OrderItem> orderItems = new HashSet<>();
        for (CartItem cartItem : cart.getCartItems()) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(savedOrder);
            orderItem.setProduct(cartItem.getProduct());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setUnitPrice(cartItem.getUnitPrice());
            orderItem.setSubtotal(cartItem.getSubtotal());
            
            orderItems.add(orderItem);
            
            // Update product stock
            Product product = cartItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() - cartItem.getQuantity());
            productRepository.save(product);
        }
        
        savedOrder.setOrderItems(orderItems);
        orderItemRepository.saveAll(orderItems);
        
        // Clear the cart
        cart.getCartItems().clear();
        cart.setTotalAmount(BigDecimal.ZERO);
        cartRepository.save(cart);
        
        return convertToDto(savedOrder);
    }

    public Page<OrderDto> getOrdersByUserId(Long userId, Pageable pageable) {
        userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        
        return orderRepository.findByUserId(userId, pageable).map(this::convertToDto);
    }

    public OrderDto getOrderById(Long id, Long userId) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        // Check if order belongs to user or user is admin
        if (!order.getUser().getId().equals(userId) && 
            !userRepository.findById(userId).get().getRoles().contains(User.Role.ROLE_ADMIN)) {
            throw new IllegalArgumentException("Not authorized to view this order");
        }
        
        return convertToDto(order);
    }

    public Page<OrderDto> getAllOrders(Pageable pageable) {
        return orderRepository.findAll(pageable).map(this::convertToDto);
    }

    public List<OrderDto> getOrdersByStatus(Order.OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OrderDto updateOrderStatus(Long id, Order.OrderStatus status, String trackingNumber) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        
        order.setStatus(status);
        
        if (trackingNumber != null) {
            order.setTrackingNumber(trackingNumber);
        }
        
        Order updatedOrder = orderRepository.save(order);
        return convertToDto(updatedOrder);
    }

    private OrderDto convertToDto(Order order) {
        OrderDto orderDto = new OrderDto();
        orderDto.setId(order.getId());
        orderDto.setUserId(order.getUser().getId());
        orderDto.setUsername(order.getUser().getUsername());
        orderDto.setOrderDate(order.getOrderDate());
        orderDto.setTotalAmount(order.getTotalAmount());
        orderDto.setStatus(order.getStatus());
        orderDto.setShippingAddress(order.getShippingAddress());
        orderDto.setTrackingNumber(order.getTrackingNumber());
        
        if (order.getOrderItems() != null) {
            List<OrderItemDto> items = order.getOrderItems().stream()
                    .map(this::convertItemToDto)
                    .collect(Collectors.toList());
            orderDto.setItems(items);
        }
        
        return orderDto;
    }

    private OrderItemDto convertItemToDto(OrderItem orderItem) {
        OrderItemDto itemDto = new OrderItemDto();
        itemDto.setId(orderItem.getId());
        itemDto.setProductId(orderItem.getProduct().getId());
        itemDto.setProductName(orderItem.getProduct().getName());
        itemDto.setQuantity(orderItem.getQuantity());
        itemDto.setUnitPrice(orderItem.getUnitPrice());
        itemDto.setSubtotal(orderItem.getSubtotal());
        return itemDto;
    }
} 