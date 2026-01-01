package com.primecrm.modules.dashboard;

import com.primecrm.modules.crm.ContactService;
import com.primecrm.modules.sales.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final ContactService contactService;
    private final DealService dealService;

    @GetMapping("/stats")
    @org.springframework.cache.annotation.Cacheable("dashboardStats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        long contactCount = contactService.countContacts();
        long dealCount = dealService.countDeals();
        BigDecimal totalRevenue = dealService.calculateTotalRevenue();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("activeDeals", dealCount);
        stats.put("newContacts", contactCount);
        stats.put("upcomingTasks", 0); // Placeholder for now

        return ResponseEntity.ok(stats);
    }
}
