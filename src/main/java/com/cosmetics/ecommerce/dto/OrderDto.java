package com.cosmetics.ecommerce.dto;

import com.cosmetics.ecommerce.model.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    
    private Long id;
    private Long userId;
    private String username;
    private LocalDateTime orderDate;
    private BigDecimal totalAmount;
    private Order.OrderStatus status;
    private String shippingAddress;
    private String trackingNumber;
    private List<OrderItemDto> items = new ArrayList<>();
} 