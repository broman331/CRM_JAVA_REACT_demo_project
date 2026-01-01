package com.primecrm.modules.activity;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {
    List<Activity> findByContactId(UUID contactId);

    List<Activity> findByDealId(UUID dealId);

    List<Activity> findByOwnerId(UUID ownerId);

    @org.springframework.data.jpa.repository.Query(value = "SELECT TO_CHAR(created_at, 'YYYY-MM-DD'), COUNT(*) FROM activities WHERE created_at >= :startDate GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD') ORDER BY TO_CHAR(created_at, 'YYYY-MM-DD')", nativeQuery = true)
    List<Object[]> countByDate(
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);
}
