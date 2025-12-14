package com.example.gatewayy_service.config;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class GatewayConfig {

    @Bean
    public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
        return builder.routes()
                .route("waste-service", r -> r
                        .path("/waste/**")
                        .filters(f -> f
                                .stripPrefix(1)
                                .rewritePath("/waste/(?<segment>.*)", "/api/wastes/${segment}"))
                        .uri("lb://waste-service"))
                .build();
    }
}