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
    
    @Query("SELECT oi.productId, p.name, SUM(oi.quantity), SUM(oi.subtotal) " +
           "FROM OrderItem oi " +
           "JOIN oi.order o " +
           "JOIN Product p ON p.id = oi.productId " +
           "WHERE DATE(o.orderDate) BETWEEN :startDate AND :endDate " +
           "GROUP BY oi.productId, p.name " +
           "ORDER BY SUM(oi.subtotal) DESC")
    List<Object[]> getTopSellingProducts(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
    
    @Query("SELECT p.categoryId, c.name, SUM(oi.subtotal) " +
           "FROM OrderItem oi " +
           "JOIN oi.order o " +
           "JOIN Product p ON p.id = oi.productId " +
           "JOIN Category c ON c.id = p.categoryId " +
           "WHERE DATE(o.orderDate) BETWEEN :startDate AND :endDate " +
           "GROUP BY p.categoryId, c.name " +
           "ORDER BY SUM(oi.subtotal) DESC")
    List<Object[]> getSalesByCategory(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
} 