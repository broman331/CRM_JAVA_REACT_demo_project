package com.primecrm.modules.sales;

import com.primecrm.core.BaseEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Entity
@Table(name = "deals", indexes = {
        @Index(name = "idx_deal_stage", columnList = "stage"),
        @Index(name = "idx_deal_contact", columnList = "contact_id"),
        @Index(name = "idx_deal_owner", columnList = "owner_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Deal extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String title;

    private String description;

    @NotNull
    private BigDecimal value;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DealStage stage;

    @NotNull
    @Column(name = "contact_id", nullable = false)
    private UUID contactId; // Loose coupling with CRM Module

    @Column(name = "owner_id")
    private UUID ownerId; // User who owns the deal

    public enum DealStage {
        LEAD, QUALIFIED, PROPOSAL, NEGOTIATION, CLOSED_WON, CLOSED_LOST
    }
}
