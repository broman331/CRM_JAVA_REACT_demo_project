package com.primecrm.modules.test;

import com.primecrm.modules.activity.ActivityRepository;
import com.primecrm.modules.sales.DealRepository;
import com.primecrm.modules.crm.ContactRepository;
import com.primecrm.modules.crm.CompanyRepository;
import com.primecrm.modules.user.UserRepository;
import com.primecrm.modules.user.User;
import com.primecrm.modules.user.User.UserRole;
import org.springframework.security.crypto.password.PasswordEncoder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class TestService {

    private final ActivityRepository activityRepository;
    private final DealRepository dealRepository;
    private final ContactRepository contactRepository;
    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void resetDatabase() {
        activityRepository.deleteAll();
        dealRepository.deleteAll();
        contactRepository.deleteAll();
        companyRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Transactional
    public void seedAdmin() {
        if (userRepository.existsByEmail("admin@example.com"))
            return;

        var admin = User.builder()
                .firstName("Admin")
                .lastName("User")
                .email("admin@example.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .roles(Collections.singleton(UserRole.ADMIN))
                .build();
        if (admin != null) {
            userRepository.save(admin);
        }
    }
}
