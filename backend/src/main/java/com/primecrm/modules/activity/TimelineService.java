package com.primecrm.modules.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TimelineService {

    private final ActivityRepository activityRepository;

    public List<Activity> getTimeline(String entityType, UUID entityId) {
        List<Activity> activities = new ArrayList<>();

        if (entityType.equalsIgnoreCase("contact")) {
            activities = activityRepository.findByContactId(entityId);
        } else if (entityType.equalsIgnoreCase("deal")) {
            activities = activityRepository.findByDealId(entityId);
        }
        // If entityType is neither "contact" nor "deal", activities remains an empty
        // ArrayList.
        // This effectively replaces the previous 'default: return
        // Collections.emptyList();'
        // by allowing an empty list to be sorted (which does nothing) and then
        // returned.

        // Sort by created at desc (newest first)
        activities.sort((a1, a2) -> {
            if (a1.getCreatedAt() == null || a2.getCreatedAt() == null)
                return 0;
            return a2.getCreatedAt().compareTo(a1.getCreatedAt());
        });

        return activities;
    }
}
