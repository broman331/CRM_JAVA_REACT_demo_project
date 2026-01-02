package com.primecrm.modules.crm;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.primecrm.core.search.SearchCriteria;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @GetMapping
    public ResponseEntity<List<Contact>> getAllContacts(@RequestParam(required = false) String search) {
        if (search != null && !search.isEmpty() && !search.contains(":") && !search.contains(">")
                && !search.contains("<")) {
            return ResponseEntity.ok(contactService.searchGlobal(search));
        }
        List<SearchCriteria> criteria = SearchCriteria.parse(search);
        return ResponseEntity.ok(contactService.searchContacts(criteria));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContact(@PathVariable UUID id) {
        return ResponseEntity.ok(contactService.getContact(id));
    }

    @PostMapping
    public ResponseEntity<Contact> createContact(@RequestBody @Valid Contact contact) {
        return ResponseEntity.ok(contactService.createContact(contact));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(@PathVariable UUID id, @RequestBody @Valid Contact contact) {
        return ResponseEntity.ok(contactService.updateContact(id, contact));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteContact(@PathVariable UUID id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }
}
