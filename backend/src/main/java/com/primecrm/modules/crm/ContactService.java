package com.primecrm.modules.crm;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.primecrm.core.exception.ResourceNotFoundException;
import com.primecrm.core.search.SearchCriteria;
import com.primecrm.core.search.BaseSpecification;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public List<Contact> searchContacts(List<SearchCriteria> criteriaList) {
        if (criteriaList == null || criteriaList.isEmpty()) {
            return getAllContacts();
        }
        Specification<Contact> spec = Specification.where(null);
        for (SearchCriteria criteria : criteriaList) {
            spec = spec.and(new BaseSpecification<>(criteria));
        }
        return contactRepository.findAll(spec);
    }

    public List<Contact> searchGlobal(String query) {
        return contactRepository.searchGlobal(query);
    }

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact getContact(@lombok.NonNull UUID id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact not found with id: " + id));
    }

    @Transactional
    public Contact createContact(@lombok.NonNull Contact contact) {
        return contactRepository.save(contact);
    }

    public long countContacts() {
        return contactRepository.count();
    }

    @Transactional
    public Contact updateContact(@lombok.NonNull UUID id, @lombok.NonNull Contact contact) {
        Contact existing = getContact(id);
        if (contact.getFirstName() != null)
            existing.setFirstName(contact.getFirstName());
        if (contact.getLastName() != null)
            existing.setLastName(contact.getLastName());
        if (contact.getEmail() != null)
            existing.setEmail(contact.getEmail());
        if (contact.getPhone() != null)
            existing.setPhone(contact.getPhone());
        if (contact.getJobTitle() != null)
            existing.setJobTitle(contact.getJobTitle());
        if (contact.getCompany() != null)
            existing.setCompany(contact.getCompany());
        return java.util.Objects.requireNonNull(contactRepository.save(existing));
    }

    @Transactional
    public void deleteContact(@lombok.NonNull UUID id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
}
