package com.foodie.tinder;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootTest
class TinderApplicationTests {

    @Test
    void contextLoads() {

        BCryptPasswordEncoder pe = new BCryptPasswordEncoder();
        System.out.println(pe.encode("a"));

    }

}
