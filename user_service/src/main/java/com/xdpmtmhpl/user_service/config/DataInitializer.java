package com.xdpmtmhpl.user_service.config;

import com.xdpmtmhpl.user_service.models.Role;
import com.xdpmtmhpl.user_service.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Khởi tạo vai trò nếu chưa tồn tại
        if (roleRepository.findByName(Role.ROLE_USER).isEmpty()) {
            Role userRole = new Role();
            userRole.setName(Role.ROLE_USER);
            roleRepository.save(userRole);
        }

        if (roleRepository.findByName(Role.ROLE_ADMIN).isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName(Role.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }
    }
}