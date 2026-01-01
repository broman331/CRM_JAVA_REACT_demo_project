package com.primecrm.modules.sales;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface DealRepository
        extends JpaRepository<Deal, UUID>, org.springframework.data.jpa.repository.JpaSpecificationExecutor<Deal> {
    List<Deal> findByContactId(UUID contactId);

    List<Deal> findByStage(Deal.DealStage stage);

    List<Deal> findByOwnerId(UUID ownerId);

    @org.springframework.data.jpa.repository.Query("SELECT d.stage, COUNT(d) FROM Deal d GROUP BY d.stage")
    List<Object[]> countByStage();

    @org.springframework.data.jpa.repository.Query(value = "SELECT TO_CHAR(created_at, 'YYYY-MM-DD'), SUM(value) FROM deals WHERE created_at >= :startDate GROUP BY TO_CHAR(created_at, 'YYYY-MM-DD') ORDER BY TO_CHAR(created_at, 'YYYY-MM-DD')", nativeQuery = true)
    List<Object[]> sumValueByDate(
            @org.springframework.data.repository.query.Param("startDate") java.time.LocalDateTime startDate);
}
