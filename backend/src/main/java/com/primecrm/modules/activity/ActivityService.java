package com.primecrm.modules.activity;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    public List<Activity> getActivitiesByDeal(UUID dealId) {
        return activityRepository.findByDealId(dealId);
    }

    public List<Activity> getActivitiesByContact(UUID contactId) {
        return activityRepository.findByContactId(contactId);
    }

    public List<Activity> getAllActivities() {
        return activityRepository.findAll();
    }

    @Transactional
    public Activity createActivity(Activity activity) {
        return activityRepository.save(activity);
    }

    @Transactional
    public Activity completeActivity(UUID id) {
        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Activity not found"));
        activity.setCompleted(true);
        return activityRepository.save(activity);
    }
}
