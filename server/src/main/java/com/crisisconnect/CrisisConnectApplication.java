package com.crisisconnect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class CrisisConnectApplication {
    public static void main(String[] args) {
        SpringApplication.run(CrisisConnectApplication.class, args);
    }
}
