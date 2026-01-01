package com.primecrm.modules.activity;

import com.primecrm.core.JwtAuthenticationFilter;
import com.primecrm.core.SecurityConfig;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(controllers = TimelineController.class, excludeAutoConfiguration = { SecurityAutoConfiguration.class,
        SecurityFilterAutoConfiguration.class }, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
                SecurityConfig.class, JwtAuthenticationFilter.class }))
public class TimelineControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TimelineService timelineService;

    @Test
    @WithMockUser
    public void getTimeline_ShouldReturnActivities() throws Exception {
        UUID contactId = UUID.randomUUID();
        Activity activity = Activity.builder()
                .subject("Test Activity")
                .type(Activity.ActivityType.CALL)
                .contactId(contactId)
                .build();
        activity.setCreatedAt(LocalDateTime.now()); // Mocking BaseEntity field if possible, or usually it's null unless
                                                    // set.
        // BaseEntity fields are usually set by JPA auditing. For unit test we might
        // need setter or reflection if @Setter is on BaseEntity.
        // BaseEntity has @Setter? Let's check. Yes it usually does via Lombok @Data or
        // @Setter. Activity has @Getter/@Setter.

        Mockito.when(timelineService.getTimeline("contact", contactId)).thenReturn(List.of(activity));

        mockMvc.perform(get("/api/timeline/contact/" + contactId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].subject").value("Test Activity"));
    }
}
