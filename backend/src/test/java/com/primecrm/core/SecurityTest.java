package com.primecrm.core;

import com.primecrm.modules.crm.ContactService;
import com.primecrm.modules.sales.DealService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class SecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ContactService contactService;

    @MockBean
    private DealService dealService;

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void deleteContact_AsAdmin_ShouldSucceed() throws Exception {
        mockMvc.perform(delete("/api/contacts/" + UUID.randomUUID()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "user", roles = { "SALES_REP" })
    void deleteContact_AsUser_ShouldBeForbidden() throws Exception {
        mockMvc.perform(delete("/api/contacts/" + UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = { "ADMIN" })
    void deleteDeal_AsAdmin_ShouldSucceed() throws Exception {
        mockMvc.perform(delete("/api/deals/" + UUID.randomUUID()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "user", roles = { "SALES_REP" })
    void deleteDeal_AsUser_ShouldBeForbidden() throws Exception {
        mockMvc.perform(delete("/api/deals/" + UUID.randomUUID()))
                .andExpect(status().isForbidden());
    }
}
