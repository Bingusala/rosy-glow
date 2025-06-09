package com.cosmetics.ecommerce.repository;

import com.cosmetics.ecommerce.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    List<OrderItem> findByOrderId(Long orderId);
    
    @Query("SELECT oi.product.id, oi.product.name, SUM(oi.quantity), SUM(oi.subtotal) " +
           "FROM OrderItem oi " +
           "WHERE DATE(oi.order.orderDate) BETWEEN :startDate AND :endDate " +
           "GROUP BY oi.product.id, oi.product.name " +
           "ORDER BY SUM(oi.subtotal) DESC")
    List<Object[]> getTopSellingProducts(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT oi.product.category.id, oi.product.category.name, SUM(oi.subtotal) " +
           "FROM OrderItem oi " +
           "WHERE DATE(oi.order.orderDate) BETWEEN :startDate AND :endDate " +
           "GROUP BY oi.product.category.id, oi.product.category.name " +
           "ORDER BY SUM(oi.subtotal) DESC")
    List<Object[]> getSalesByCategory(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
} 