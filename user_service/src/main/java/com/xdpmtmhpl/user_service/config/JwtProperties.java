package com.xdpmtmhpl.user_service.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app.jwt")
@Getter
@Setter
public class JwtProperties {
    /**
     * Secret key for signing JWT tokens
     */
    private String secret = "bW1u16VpVl4pOuVmsJsHjYJup3I4seDfMnE6wBd8aDZu3HrYTytGl9DNrx5f3vMV";

    /**
     * JWT token expiration time in milliseconds (24 hours by default)
     */
    private int expirationMs = 86400000;
    
    /**
     * JWT refresh token expiration time in milliseconds (7 days by default)
     */
    private int refreshExpirationMs = 604800000;
    
    /**
     * Whether cookies should be secured (HTTPS only)
     * Default is false for development, should be true in production
     */
    private boolean secureCookie = false;
}
