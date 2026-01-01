package com.primecrm.modules.test;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
@RequiredArgsConstructor
public class TestController {

    private final TestService testService;

    @DeleteMapping("/reset")
    public ResponseEntity<Void> resetDatabase() {
        testService.resetDatabase();
        return ResponseEntity.noContent().build();
    }

    @org.springframework.web.bind.annotation.PostMapping("/seed-admin")
    public ResponseEntity<Void> seedAdmin() {
        testService.seedAdmin();
        return ResponseEntity.noContent().build();
    }
}
