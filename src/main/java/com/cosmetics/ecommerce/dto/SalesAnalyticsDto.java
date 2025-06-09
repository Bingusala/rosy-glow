package com.cosmetics.ecommerce.dto;

import java.math.BigDecimal;
import java.util.List;

public class SalesAnalyticsDto {
    private BigDecimal totalSales;
    private Long totalOrders;
    private BigDecimal averageOrderValue;
    private List<TopProductDto> topSellingProducts;
    private List<CategorySalesDto> salesByCategory;

    public SalesAnalyticsDto() {}

    public SalesAnalyticsDto(BigDecimal totalSales, Long totalOrders, BigDecimal averageOrderValue,
                           List<TopProductDto> topSellingProducts, List<CategorySalesDto> salesByCategory) {
        this.totalSales = totalSales;
        this.totalOrders = totalOrders;
        this.averageOrderValue = averageOrderValue;
        this.topSellingProducts = topSellingProducts;
        this.salesByCategory = salesByCategory;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    public List<TopProductDto> getTopSellingProducts() {
        return topSellingProducts;
    }

    public void setTopSellingProducts(List<TopProductDto> topSellingProducts) {
        this.topSellingProducts = topSellingProducts;
    }

    public List<CategorySalesDto> getSalesByCategory() {
        return salesByCategory;
    }

    public void setSalesByCategory(List<CategorySalesDto> salesByCategory) {
        this.salesByCategory = salesByCategory;
    }

    public static class TopProductDto {
        private Long productId;
        private String productName;
        private Long totalQuantitySold;
        private BigDecimal totalRevenue;

        public TopProductDto() {}

        public TopProductDto(Long productId, String productName, Long totalQuantitySold, BigDecimal totalRevenue) {
            this.productId = productId;
            this.productName = productName;
            this.totalQuantitySold = totalQuantitySold;
            this.totalRevenue = totalRevenue;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public Long getTotalQuantitySold() {
            return totalQuantitySold;
        }

        public void setTotalQuantitySold(Long totalQuantitySold) {
            this.totalQuantitySold = totalQuantitySold;
        }

        public BigDecimal getTotalRevenue() {
            return totalRevenue;
        }

        public void setTotalRevenue(BigDecimal totalRevenue) {
            this.totalRevenue = totalRevenue;
        }
    }

    public static class CategorySalesDto {
        private Long categoryId;
        private String categoryName;
        private BigDecimal totalSales;

        public CategorySalesDto() {}

        public CategorySalesDto(Long categoryId, String categoryName, BigDecimal totalSales) {
            this.categoryId = categoryId;
            this.categoryName = categoryName;
            this.totalSales = totalSales;
        }

        public Long getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Long categoryId) {
            this.categoryId = categoryId;
        }

        public String getCategoryName() {
            return categoryName;
        }

        public void setCategoryName(String categoryName) {
            this.categoryName = categoryName;
        }

        public BigDecimal getTotalSales() {
            return totalSales;
        }

        public void setTotalSales(BigDecimal totalSales) {
            this.totalSales = totalSales;
        }
    }
}