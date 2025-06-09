package com.cosmetics.ecommerce.service;

import com.cosmetics.ecommerce.dto.SalesAnalyticsDto;
import com.cosmetics.ecommerce.repository.OrderRepository;
import com.cosmetics.ecommerce.repository.OrderItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    public SalesAnalyticsDto getSalesAnalytics(LocalDate startDate, LocalDate endDate) {
        // Get total sales and order count
        BigDecimal totalSales = orderRepository.getTotalSalesBetweenDates(startDate, endDate);
        Long totalOrders = orderRepository.getTotalOrdersBetweenDates(startDate, endDate);
        
        // Handle case where there are no orders
        if (totalSales == null) totalSales = BigDecimal.ZERO;
        if (totalOrders == null) totalOrders = 0L;
        
        // Calculate average order value
        BigDecimal averageOrderValue = totalOrders > 0 
            ? totalSales.divide(BigDecimal.valueOf(totalOrders), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        // Get top selling products
        List<Object[]> topProductsData = orderItemRepository.getTopSellingProducts(startDate, endDate);
        List<SalesAnalyticsDto.TopProductDto> topSellingProducts = topProductsData.stream()
            .map(row -> new SalesAnalyticsDto.TopProductDto(
                ((Number) row[0]).longValue(),     // productId
                (String) row[1],                   // productName
                ((Number) row[2]).longValue(),     // totalQuantitySold
                (BigDecimal) row[3]                // totalRevenue
            ))
            .collect(Collectors.toList());

        // Get sales by category
        List<Object[]> categoryData = orderItemRepository.getSalesByCategory(startDate, endDate);
        List<SalesAnalyticsDto.CategorySalesDto> salesByCategory = categoryData.stream()
            .map(row -> new SalesAnalyticsDto.CategorySalesDto(
                ((Number) row[0]).longValue(),     // categoryId
                (String) row[1],                   // categoryName
                (BigDecimal) row[2]                // totalSales
            ))
            .collect(Collectors.toList());

        return new SalesAnalyticsDto(totalSales, totalOrders, averageOrderValue, 
                                   topSellingProducts, salesByCategory);
    }

    public SalesAnalyticsDto getSalesAnalytics() {
        // Default to last 30 days if no date range specified
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusDays(30);
        return getSalesAnalytics(startDate, endDate);
    }
}