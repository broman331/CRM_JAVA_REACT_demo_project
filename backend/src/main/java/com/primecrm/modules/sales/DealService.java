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

    public List<Deal> getDealsByPipeline() {
        // For now, return all deals. Later filter by pipeline/stage.
        return dealRepository.findAll();
    }

    @Transactional
    public Deal createDeal(Deal deal) {
        return dealRepository.save(deal);
    }

    @Transactional
    public Deal updateStage(UUID dealId, Deal.DealStage stage) {
        Deal deal = dealRepository.findById(dealId)
                .orElseThrow(() -> new IllegalArgumentException("Deal not found"));
        deal.setStage(stage);
        return dealRepository.save(deal);
    }

    public long countDeals() {
        return dealRepository.count();
    }

    public java.math.BigDecimal calculateTotalRevenue() {
        return dealRepository.findAll().stream()
                .map(Deal::getValue)
                .reduce(java.math.BigDecimal.ZERO, java.math.BigDecimal::add);
    }
}
