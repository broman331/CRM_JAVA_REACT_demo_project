package com.primecrm.modules.sales;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class DealService {

    private final DealRepository dealRepository;

    public List<Deal> searchDeals(List<com.primecrm.core.search.SearchCriteria> criteriaList) {
        if (criteriaList == null || criteriaList.isEmpty()) {
            return getDealsByPipeline();
        }
        org.springframework.data.jpa.domain.Specification<Deal> spec = org.springframework.data.jpa.domain.Specification
                .where(null);
        for (com.primecrm.core.search.SearchCriteria criteria : criteriaList) {
            spec = spec.and(new com.primecrm.core.search.BaseSpecification<>(criteria));
        }
        return dealRepository.findAll(spec);
    }

    public List<Deal> getDealsByPipeline() {
        // For now, return all deals. Later filter by pipeline/stage.
        return dealRepository.findAll();
    }

    @Transactional
    public Deal createDeal(@lombok.NonNull Deal deal) {
        return dealRepository.save(deal);
    }

    @Transactional
    public Deal updateStage(@lombok.NonNull UUID dealId, Deal.DealStage stage) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new IllegalArgumentException("Deal not found"));
        deal.setStage(stage);
        return dealRepository.save(deal);
    }

    public long countDeals() {
        return dealRepository.count();
    }

    @Transactional
    public void deleteDeal(@lombok.NonNull UUID id) {
        if (!dealRepository.existsById(id)) {
            throw new IllegalArgumentException("Deal not found");
        }
        dealRepository.deleteById(id);
    }

    public java.math.BigDecimal calculateTotalRevenue() {
        return dealRepository.findAll().stream()
                .map(Deal::getValue)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
    }
}
