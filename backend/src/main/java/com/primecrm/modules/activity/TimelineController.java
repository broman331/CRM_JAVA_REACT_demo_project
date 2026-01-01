package com.primecrm.modules.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/timeline")
@RequiredArgsConstructor
public class TimelineController {

    private final TimelineService timelineService;

    @GetMapping("/{entityType}/{entityId}")
    public ResponseEntity<List<Activity>> getTimeline(
            @PathVariable String entityType,
            @PathVariable UUID entityId) {
        return ResponseEntity.ok(timelineService.getTimeline(entityType, entityId));
    }
}
