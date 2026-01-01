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
    public ResponseEntity<List<Deal>> getAllDeals() {
        return ResponseEntity.ok(dealService.getDealsByPipeline());
    }

    @PostMapping
    public ResponseEntity<Deal> createDeal(@RequestBody @Valid Deal deal) {
        return ResponseEntity.ok(dealService.createDeal(deal));
    }

    @PatchMapping("/{id}/stage")
    public ResponseEntity<Deal> updateStage(@PathVariable UUID id, @RequestParam Deal.DealStage stage) {
        return ResponseEntity.ok(dealService.updateStage(id, stage));
    }
}
