package com.primecrm.config;

import com.primecrm.modules.user.User;
import com.primecrm.modules.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Check if admin user exists
        if (userRepository.findByEmail("admin@example.com").isEmpty()) {
            log.info("Creating default admin user...");
            User admin = User.builder()
                    .email("admin@example.com")
                    .passwordHash(passwordEncoder.encode("admin123"))
                    .firstName("Admin")
                    .lastName("User")
                    .roles(Set.of(User.UserRole.ADMIN, User.UserRole.MANAGER))
                    .build();
            java.util.Objects.requireNonNull(userRepository.save(admin));
            log.info("Default admin user created successfully");
        } else {
            log.info("Admin user already exists");
        }
    }
}
