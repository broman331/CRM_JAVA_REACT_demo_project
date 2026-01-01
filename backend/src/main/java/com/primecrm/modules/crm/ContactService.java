package com.primecrm.modules.crm;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }

    public Contact getContact(UUID id) {
        return contactRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Contact not found"));
    }

    @Transactional
    public Contact createContact(Contact contact) {
        return contactRepository.save(contact);
    }

    public long countContacts() {
        return contactRepository.count();
    }
}
