package com.xdpmtmhpl.post_service.client;

import com.xdpmtmhpl.post_service.dto.UserDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "${user.service.url}")
public interface UserServiceClient {
    @GetMapping("/users/{userId}")
    UserDTO getUserById(@PathVariable("userId") Long userId);
}