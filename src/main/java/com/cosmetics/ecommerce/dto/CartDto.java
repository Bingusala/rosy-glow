package com.cosmetics.ecommerce.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {
    
    private Long id;
    private Long userId;
    private BigDecimal totalAmount;
    private Set<CartItemDto> items = new HashSet<>();
} 