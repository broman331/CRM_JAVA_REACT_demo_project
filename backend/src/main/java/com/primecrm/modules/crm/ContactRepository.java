package com.primecrm.modules.crm;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID>,
        org.springframework.data.jpa.repository.JpaSpecificationExecutor<Contact> {
    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "company")
    List<Contact> findByCompanyId(UUID companyId);

    List<Contact> findByEmail(String email);

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "company")
    @Override
    @org.springframework.lang.NonNull
    List<Contact> findAll();

    @org.springframework.data.jpa.repository.EntityGraph(attributePaths = "company")
    @org.springframework.data.jpa.repository.Query("SELECT c FROM Contact c WHERE " +
            "LOWER(c.firstName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.lastName) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(c.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Contact> searchGlobal(@org.springframework.web.bind.annotation.RequestParam("query") String query);
}
