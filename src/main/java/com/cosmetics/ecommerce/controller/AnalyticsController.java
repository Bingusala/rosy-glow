package com.cosmetics.ecommerce.controller;

import com.cosmetics.ecommerce.dto.SalesAnalyticsDto;
import com.cosmetics.ecommerce.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/admin/analytics")
@PreAuthorize("hasRole('ADMIN')")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/sales")
    public ResponseEntity<SalesAnalyticsDto> getSalesAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        SalesAnalyticsDto analytics;
        if (startDate != null && endDate != null) {
            analytics = analyticsService.getSalesAnalytics(startDate, endDate);
        } else {
            analytics = analyticsService.getSalesAnalytics();
        }
        
        return ResponseEntity.ok(analytics);
    }
}