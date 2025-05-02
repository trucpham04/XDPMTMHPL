package com.xdpmtmhpl.user_service.config;

import com.xdpmtmhpl.user_service.models.Role;
import com.xdpmtmhpl.user_service.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component // Đánh dấu lớp này là một bean để chạy khi ứng dụng khởi động
public class DataInitializer implements CommandLineRunner {

    @Autowired // Inject RoleRepository để thao tác với DB
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Thêm ROLE_USER nếu chưa tồn tại
        if (roleRepository.findByName(Role.ROLE_USER).isEmpty()) {
            Role userRole = new Role();
            userRole.setName(Role.ROLE_USER);
            roleRepository.save(userRole);
        }

        // Thêm ROLE_ADMIN nếu chưa tồn tại
        if (roleRepository.findByName(Role.ROLE_ADMIN).isEmpty()) {
            Role adminRole = new Role();
            adminRole.setName(Role.ROLE_ADMIN);
            roleRepository.save(adminRole);
        }
    }
}
