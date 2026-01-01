package com.primecrm.modules.crm;

import com.primecrm.core.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "contacts")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contact extends BaseEntity {

    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;

    @Email
    private String email;
    private String phone;
    private String jobTitle;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;
}
