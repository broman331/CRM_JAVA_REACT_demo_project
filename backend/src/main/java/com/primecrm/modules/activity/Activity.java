package com.primecrm.modules.activity;

import com.primecrm.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Activity extends BaseEntity {

    @NotBlank
    private String subject;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityType type;

    private LocalDateTime dueDate;

    private boolean completed;

    private UUID contactId;
    private UUID dealId;
    private UUID ownerId;

    public enum ActivityType {
        CALL, MEETING, TASK, NOTE, EMAIL
    }
}
