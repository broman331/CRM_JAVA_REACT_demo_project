package com.primecrm.modules.crm;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class CompanyServiceTest {

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private ContactRepository contactRepository;

    @InjectMocks
    private CompanyService companyService;

    private Company company;
    private Contact contact;
    private final UUID companyId = UUID.randomUUID();

    @BeforeEach
    void setUp() {
        company = Company.builder()
                .name("Acme Corp")
                .industry("Tech")
                .build();
        company.setId(companyId);

        contact = Contact.builder()
                .firstName("John")
                .lastName("Doe")
                .company(company)
                .build();
    }

    @Test
    void shouldCreateCompany() {
        when(companyRepository.save(any(Company.class))).thenReturn(company);

        Company created = companyService.createCompany(company);

        assertNotNull(created);
        assertEquals("Acme Corp", created.getName());
        verify(companyRepository, times(1)).save(any(Company.class));
    }

    @Test
    void shouldGetCompanyById() {
        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));

        Company found = companyService.getCompany(companyId);

        assertNotNull(found);
        assertEquals(companyId, found.getId());
    }

    @Test
    void shouldThrowWhenCompanyNotFound() {
        when(companyRepository.findById(any())).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> companyService.getCompany(UUID.randomUUID()));
    }

    @Test
    void shouldGetCompanyContacts() {
        when(companyRepository.findById(companyId)).thenReturn(Optional.of(company));
        when(contactRepository.findByCompanyId(companyId)).thenReturn(List.of(contact));

        List<Contact> contacts = companyService.getContactsByCompany(companyId);

        assertFalse(contacts.isEmpty());
        assertEquals(1, contacts.size());
        assertEquals("John", contacts.get(0).getFirstName());
    }
}
