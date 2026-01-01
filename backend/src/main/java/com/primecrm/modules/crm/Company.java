package com.primecrm.modules.crm;

import com.primecrm.core.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "companies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Company extends BaseEntity {

    @NotBlank
    @Column(nullable = false)
    private String name;

    private String industry;
    private String website;
    private String phone;
}
