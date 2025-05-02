package com.xdpmtmhpl.api_gateway.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

        @Bean
        public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
                return builder.routes()
                                .route("search-service-route", r -> r
                                                .path("/search-service/**")
                                                .filters(f -> f
                                                                .rewritePath("/search-service/(?<remaining>.*)",
                                                                                "/${remaining}")
                                                                .addRequestHeader("X-Forwarded-Prefix",
                                                                                "/search-service"))
                                                .uri("http://search-service:8080"))
                                .route("user-service-route", r -> r
                                                .path("/user-service/**")
                                                .filters(f -> f
                                                                .rewritePath("/user-service/(?<remaining>.*)",
                                                                                "/${remaining}")
                                                                .addRequestHeader("X-Forwarded-Prefix",
                                                                                "/user-service"))
                                                .uri("http://user-service:8081"))
                                .route("friend-service-route", r -> r
                                                .path("/friend-service/**")
                                                .filters(f -> f
                                                                .rewritePath("/friend-service/(?<remaining>.*)",
                                                                                "/${remaining}")
                                                                .addRequestHeader("X-Forwarded-Prefix",
                                                                                "/friend-service"))
                                                .uri("http://friend-service:8082"))
                                .route("post-service-route", r -> r
                                                .path("/post-service/**")
                                                .filters(f -> f
                                                                .rewritePath("/post-service/(?<remaining>.*)",
                                                                                "/${remaining}")
                                                                .addRequestHeader("X-Forwarded-Prefix",
                                                                                "/post-service"))
                                                .uri("http://post-service:8083"))
                                .route("message-service-route", r -> r
                                                .path("/message-service/**")
                                                .filters(f -> f
                                                                .rewritePath("/message-service/(?<remaining>.*)",
                                                                                "/${remaining}")
                                                                .addRequestHeader("X-Forwarded-Prefix",
                                                                                "/message-service"))
                                                .uri("http://message-service:8084"))
                                .route("notification-service-route", r -> r
                                                .path("/notification-service/**")
                                                .filters(f -> f
                                                                .rewritePath("/notification-service/(?<remaining>.*)",
                                                                                "/${remaining}")
                                                                .addRequestHeader("X-Forwarded-Prefix",
                                                                                "/notification-service"))
                                                .uri("http://notification-service:8085"))
                                .build();
        }
}
