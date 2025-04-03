package com.xdpmtmhpl.message_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;

import com.xdpmtmhpl.message_service.dto.UserDTO;

import java.util.List;
import java.util.Map;

@FeignClient(name = "user-service")
public interface UserServiceClient {

    @GetMapping("/api/users/{userId}")
    UserDTO getUserById(@PathVariable("userId") Long userId);

    @GetMapping("/api/users/batch")
    Map<Long, UserDTO> getUsersByIds(@RequestParam("ids") List<Long> userIds);

    @GetMapping("/api/users/current")
    UserDTO getCurrentUser();
}
