package com.primecrm.modules.analytics;

import com.primecrm.modules.activity.ActivityRepository;
import com.primecrm.modules.sales.DealRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AnalyticsServiceTest {

    @Mock
    private DealRepository dealRepository;

    @Mock
    private ActivityRepository activityRepository;

    @InjectMocks
    private AnalyticsService analyticsService;

    @Test
    void getRevenueOverTime_ShouldReturnMappedResults() {
        // Given
        List<Object[]> queryResults = Arrays.asList(
                new Object[] { "2023-11", 1000 },
                new Object[] { "2023-12", 2000 });
        when(dealRepository.sumValueByDate(any())).thenReturn(queryResults);

        // When
        List<Map<String, Object>> result = analyticsService.getRevenueOverTime();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0)).containsEntry("date", "2023-11").containsEntry("value", 1000);
    }

    @Test
    void getPipelineDistribution_ShouldReturnMappedResults() {
        // Given
        List<Object[]> queryResults = Arrays.asList(
                new Object[] { "LEAD", 5L },
                new Object[] { "CLOSED_WON", 2L });
        when(dealRepository.countByStage()).thenReturn(queryResults);

        // When
        Map<String, Long> result = analyticsService.getPipelineDistribution();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result).containsEntry("LEAD", 5L).containsEntry("CLOSED_WON", 2L);
    }

    @Test
    void getActivityVolume_ShouldReturnMappedResults() {
        // Given
        List<Object[]> queryResults = Arrays.asList(
                new Object[] { "2023-11-01", 10L },
                new Object[] { "2023-11-02", 5L });
        when(activityRepository.countByDate(any())).thenReturn(queryResults);

        // When
        List<Map<String, Object>> result = analyticsService.getActivityVolume();

        // Then
        assertThat(result).hasSize(2);
        assertThat(result.get(0)).containsEntry("date", "2023-11-01").containsEntry("count", 10L);
    }
}
