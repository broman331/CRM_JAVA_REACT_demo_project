package com.primecrm.modules.analytics;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/revenue")
    public ResponseEntity<List<Map<String, Object>>> getRevenueOverTime() {
        return ResponseEntity.ok(analyticsService.getRevenueOverTime());
    }

    @GetMapping("/pipeline")
    public ResponseEntity<Map<String, Long>> getPipelineDistribution() {
        return ResponseEntity.ok(analyticsService.getPipelineDistribution());
    }

    @GetMapping("/activities")
    public ResponseEntity<List<Map<String, Object>>> getActivityVolume() {
        return ResponseEntity.ok(analyticsService.getActivityVolume());
    }
}
