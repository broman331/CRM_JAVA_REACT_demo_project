package com.primecrm;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.modulith.core.ApplicationModules;
import org.springframework.modulith.docs.Documenter;

@SpringBootTest
class PrimeCrmApplicationTests {

    @Test
    void contextLoads() {
    }

    @Test
    void verifyModularity() {
        ApplicationModules.of(PrimeCrmApplication.class).verify();
    }
}
