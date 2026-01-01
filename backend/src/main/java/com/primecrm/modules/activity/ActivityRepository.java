package com.primecrm.modules.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    List<Activity> findByContactId(UUID contactId);

    List<Activity> findByDealId(UUID dealId);

    List<Activity> findByOwnerId(UUID ownerId);
}
