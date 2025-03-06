package com.xdpmtmhpl.user_service.security.jwt;

import com.xdpmtmhpl.user_service.config.JwtProperties;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.util.WebUtils;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {
    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    // Cookie names
    public static final String JWT_ACCESS_COOKIE = "access_token";
    public static final String JWT_REFRESH_COOKIE = "refresh_token";

    @Autowired
    private JwtProperties jwtProperties;

    private Key getSigningKey() {
        byte[] keyBytes = jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateJwtToken(Authentication authentication) {
        UserDetails userPrincipal = (UserDetails) authentication.getPrincipal();
        return generateTokenFromUsername(userPrincipal.getUsername(), jwtProperties.getExpirationMs());
    }

    public String generateRefreshToken(String username) {
        return generateTokenFromUsername(username, jwtProperties.getRefreshExpirationMs());
    }

    public String generateTokenFromUsername(String username, long expirationMs) {
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + expirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public ResponseCookie generateJwtCookie(String token) {
        return ResponseCookie.from(JWT_ACCESS_COOKIE, token)
                .path("/")
                .maxAge(jwtProperties.getExpirationMs() / 1000)
                .httpOnly(true)
                .secure(jwtProperties.isSecureCookie())
                .sameSite("Strict")
                .build();
    }

    public ResponseCookie generateRefreshJwtCookie(String token) {
        return ResponseCookie.from(JWT_REFRESH_COOKIE, token)
                .path("/api/auth/refresh")
                .maxAge(jwtProperties.getRefreshExpirationMs() / 1000)
                .httpOnly(true)
                .secure(jwtProperties.isSecureCookie())
                .sameSite("Strict")
                .build();
    }

    public String getJwtFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, JWT_ACCESS_COOKIE);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }

    public String getJwtRefreshFromCookies(HttpServletRequest request) {
        Cookie cookie = WebUtils.getCookie(request, JWT_REFRESH_COOKIE);
        if (cookie != null) {
            return cookie.getValue();
        } else {
            return null;
        }
    }

    public ResponseCookie getCleanJwtCookie() {
        return ResponseCookie.from(JWT_ACCESS_COOKIE, "")
                .path("/")
                .maxAge(0)
                .httpOnly(true)
                .build();
    }

    public ResponseCookie getCleanJwtRefreshCookie() {
        return ResponseCookie.from(JWT_REFRESH_COOKIE, "")
                .path("/api/auth/refresh")
                .maxAge(0)
                .httpOnly(true)
                .build();
    }

    public String getUserNameFromJwtToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(authToken);
            return true;
        } catch (SecurityException e) {
            logger.error("Invalid JWT signature: {}", e.getMessage());
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("JWT claims string is empty: {}", e.getMessage());
        }

        return false;
    }

    public JwtProperties getJwtProperties() {
        return jwtProperties;
    }
}