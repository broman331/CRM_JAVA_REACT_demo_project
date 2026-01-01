package com.primecrm.modules.user;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.primecrm.core.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody @Valid RegisterRequest request) {
        User user = userService.register(
                request.firstName(),
                request.lastName(),
                request.email(),
                request.password());
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody @Valid LoginRequest request) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        var userDetails = (org.springframework.security.core.userdetails.UserDetails) authentication.getPrincipal();
        var token = jwtService.generateToken(userDetails);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {
    }

    public record AuthResponse(String token) {
    }

    public record RegisterRequest(
            @NotBlank String firstName,
            @NotBlank String lastName,
            @Email @NotBlank String email,
            @NotBlank String password) {
    }
}
