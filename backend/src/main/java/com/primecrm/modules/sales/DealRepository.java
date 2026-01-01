package com.primecrm.modules.sales;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DealRepository extends JpaRepository<Deal, UUID> {
    List<Deal> findByContactId(UUID contactId);

    List<Deal> findByStage(Deal.DealStage stage);

    List<Deal> findByOwnerId(UUID ownerId);
}
