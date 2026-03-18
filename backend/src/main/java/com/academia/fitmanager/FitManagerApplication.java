package com.academia.fitmanager;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class FitManagerApplication {

    public static void main(String[] args) {
        SpringApplication.run(FitManagerApplication.class, args);
    }

    @GetMapping("/api/health")
    public String healthCheck() {
        return "FitManager API está rodando com sucesso! 🚀";
    }
}
