package com.xdpmtmhpl.user_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component // Bean cấu hình, tự động quét bởi Spring
@ConfigurationProperties(prefix = "app.jwt") // Map các thuộc tính bắt đầu với "app.jwt" trong file cấu hình
@Getter
@Setter
public class JwtProperties {

    private String secret = "bW1u16VpVl4pOuVmsJsHjYJup3I4seDfMnE6wBd8aDZu3HrYTytGl9DNrx5f3vMV"; // Khóa bí mật dùng ký JWT

    private int expirationMs = 86400000; // Thời gian hết hạn token (24h)

    private int refreshExpirationMs = 604800000; // Thời gian hết hạn refresh token (7 ngày)

    private boolean secureCookie = false; // Bật HTTPS-only cookie (true cho production)
}
