package com.primecrm.modules.sales;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/deals")
@RequiredArgsConstructor
public class DealController {

    private final DealService dealService;

    @GetMapping
    public ResponseEntity<List<Deal>> getAllDeals(@RequestParam(required = false) String search) {
        List<com.primecrm.core.search.SearchCriteria> criteria = com.primecrm.core.search.SearchCriteria.parse(search);
        return ResponseEntity.ok(dealService.searchDeals(criteria));
    }

    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody @Valid Deal deal) {
        return ResponseEntity.ok(dealService.createDeal(deal));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<Deal> updateStage(@PathVariable UUID id, @RequestParam Deal.DealStage stage) {
        return ResponseEntity.ok(dealService.updateStage(id, stage));
    }

    @DeleteMapping("/{id}")
    @org.springframework.security.access.prepost.PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDeal(@PathVariable UUID id) {
        dealService.deleteDeal(id);
        return ResponseEntity.noContent().build();
    }
}
