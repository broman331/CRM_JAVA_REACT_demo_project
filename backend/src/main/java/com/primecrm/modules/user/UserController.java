package com.primecrm.modules.user;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<Iterable<User>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody @Valid CreateUserRequest request) {
        // Reusing register logic but might need role assignment
        User user = userService.register(
                request.firstName(),
                request.lastName(),
                request.email(),
                request.password());
        // If we want to assign roles on creation, we might need a specific service
        // method or update it immediately
        if (request.roles() != null && !request.roles().isEmpty()) {
            userService.updateUser(Objects.requireNonNull(user.getId()), request.firstName(), request.lastName(),
                    request.email(),
                    request.roles());
            // Fetch updated
            user.setRoles(request.roles());
        }
        return ResponseEntity.ok(user);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable String id, @RequestBody @Valid UpdateUserRequest request) {
        User user = userService.updateUser(
                Objects.requireNonNull(UUID.fromString(id)),
                request.firstName(),
                request.lastName(),
                request.email(),
                request.roles());
        return ResponseEntity.ok(user);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable String id) {
        userService.deleteUser(Objects.requireNonNull(UUID.fromString(id)));
        return ResponseEntity.noContent().build();
    }

    public record CreateUserRequest(
            @NotBlank String firstName,
            @NotBlank String lastName,
            @Email @NotBlank String email,
            @NotBlank String password,
            Set<User.UserRole> roles) {
    }

    public record UpdateUserRequest(
            @NotBlank String firstName,
            @NotBlank String lastName,
            @Email @NotBlank String email,
            Set<User.UserRole> roles) {
    }
}
