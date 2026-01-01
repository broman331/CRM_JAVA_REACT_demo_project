package com.primecrm.modules.crm;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID>,
        org.springframework.data.jpa.repository.JpaSpecificationExecutor<Contact> {
    List<Contact> findByCompanyId(UUID companyId);

    List<Contact> findByEmail(String email);
}
