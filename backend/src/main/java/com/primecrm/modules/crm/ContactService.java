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
    public void deleteContact(@lombok.NonNull UUID id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Contact not found with id: " + id);
        }
        contactRepository.deleteById(id);
    }
}
