package com.primecrm.modules.analytics;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AnalyticsController.class, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
                com.primecrm.core.SecurityConfig.class,
                com.primecrm.core.JwtAuthenticationFilter.class
}), excludeAutoConfiguration = {
                SecurityAutoConfiguration.class,
                SecurityFilterAutoConfiguration.class
})
@AutoConfigureMockMvc(addFilters = false)
@SuppressWarnings("null")
class AnalyticsControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private AnalyticsService analyticsService;

        @Test
        void getRevenueOverTime_ShouldReturnList() throws Exception {
                Map<String, Object> data = new HashMap<>();
                data.put("date", "2023-11");
                data.put("value", 1000);
                when(analyticsService.getRevenueOverTime()).thenReturn(List.of(data));

                mockMvc.perform(get("/api/analytics/revenue")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].date").value("2023-11"));
        }

        @Test
        void getPipelineDistribution_ShouldReturnMap() throws Exception {
                when(analyticsService.getPipelineDistribution()).thenReturn(Collections.singletonMap("LEAD", 5L));

                mockMvc.perform(get("/api/analytics/pipeline")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.LEAD").value(5));
        }

        @Test
        void getActivityVolume_ShouldReturnList() throws Exception {
                Map<String, Object> data = new HashMap<>();
                data.put("date", "2023-11-01");
                data.put("count", 10);
                when(analyticsService.getActivityVolume()).thenReturn(List.of(data));

                mockMvc.perform(get("/api/analytics/activities")
                                .contentType(MediaType.APPLICATION_JSON))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$[0].date").value("2023-11-01"));
        }
}
