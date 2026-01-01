package com.primecrm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.modulith.Modulith;

@SpringBootApplication
@Modulith
@org.springframework.data.jpa.repository.config.EnableJpaAuditing
public class PrimeCrmApplication {

	public static void main(String[] args) {
		SpringApplication.run(PrimeCrmApplication.class, args);
	}

}
