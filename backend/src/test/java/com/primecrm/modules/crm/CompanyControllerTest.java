package com.primecrm.modules.crm;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = CompanyController.class, excludeFilters = @ComponentScan.Filter(type = FilterType.ASSIGNABLE_TYPE, classes = {
                com.primecrm.core.SecurityConfig.class,
                com.primecrm.core.JwtAuthenticationFilter.class
}), excludeAutoConfiguration = {
                org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class,
                org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration.class
})
@AutoConfigureMockMvc(addFilters = false)
@SuppressWarnings("null")
class CompanyControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private CompanyService companyService;

        @Autowired
        private ObjectMapper objectMapper;

        @Test
        void shouldCreateCompany() throws Exception {
                Company company = Company.builder().name("Acme Corp").build();
                when(companyService.createCompany(any(Company.class))).thenReturn(company);

                mockMvc.perform(post("/api/companies")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(company)))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Acme Corp"));
        }

        @Test
        void shouldGetCompany() throws Exception {
                UUID id = UUID.randomUUID();
                Company company = Company.builder().name("Acme Corp").build();
                when(companyService.getCompany(id)).thenReturn(company);

                mockMvc.perform(get("/api/companies/" + id))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$.name").value("Acme Corp"));
        }
}
