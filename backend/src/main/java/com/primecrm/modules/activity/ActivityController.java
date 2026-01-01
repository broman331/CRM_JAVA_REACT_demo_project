package com.primecrm.modules.activity;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public ResponseEntity<List<Activity>> getAll() {
        return ResponseEntity.ok(activityService.getAllActivities());
    }

    @GetMapping("/deal/{dealId}")
    public ResponseEntity<List<Activity>> getByDeal(@PathVariable UUID dealId) {
        return ResponseEntity.ok(activityService.getActivitiesByDeal(dealId));
    }

    @GetMapping("/contact/{contactId}")
    public ResponseEntity<List<Activity>> getByContact(@PathVariable UUID contactId) {
        return ResponseEntity.ok(activityService.getActivitiesByContact(contactId));
    }

    @PostMapping
    public ResponseEntity<Activity> create(@RequestBody @Valid Activity activity) {
        return ResponseEntity.ok(activityService.createActivity(activity));
    }

    @PatchMapping("/{id}/complete")
    public ResponseEntity<Activity> complete(@PathVariable UUID id) {
        return ResponseEntity.ok(activityService.completeActivity(id));
    }
}
