package com.primecrm.modules.analytics;

import com.primecrm.modules.activity.ActivityRepository;
import com.primecrm.modules.sales.DealRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final DealRepository dealRepository;
    private final ActivityRepository activityRepository;

    public List<Map<String, Object>> getRevenueOverTime() {
        LocalDateTime startDate = LocalDateTime.now().minusMonths(6);
        List<Object[]> results = dealRepository.sumValueByDate(startDate);
        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", row[0]);
            map.put("value", row[1]);
            return map;
        }).collect(Collectors.toList());
    }

    public Map<String, Long> getPipelineDistribution() {
        List<Object[]> results = dealRepository.countByStage();
        Map<String, Long> distribution = new HashMap<>();
        for (Object[] row : results) {
            distribution.put(row[0].toString(), (Long) row[1]);
        }
        return distribution;
    }

    public List<Map<String, Object>> getActivityVolume() {
        LocalDateTime startDate = LocalDateTime.now().minusDays(30);
        List<Object[]> results = activityRepository.countByDate(startDate);
        return results.stream().map(row -> {
            Map<String, Object> map = new HashMap<>();
            map.put("date", row[0]);
            map.put("count", row[1]);
            return map;
        }).collect(Collectors.toList());
    }
}
