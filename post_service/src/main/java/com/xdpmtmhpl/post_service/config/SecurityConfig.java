package com.xdpmtmhpl.post_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // Tắt CSRF để dễ test API qua Postman
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/posts/**").permitAll() // Cho phép truy cập không cần xác thực
                        .anyRequest().authenticated() // Các endpoint khác yêu cầu xác thực
                )
                .httpBasic(httpBasic -> httpBasic.disable()) // Tắt HTTP Basic nếu không cần, hoặc cấu hình rõ ràng hơn
                .formLogin(form -> form.disable()); // Tắt form login nếu không sử dụng

        return http.build();
    }
}