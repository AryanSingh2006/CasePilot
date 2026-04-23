package com.ailegal.advisor.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

/**
 * CORS configuration — exposes a {@link CorsConfigurationSource} bean named
 * {@code corsConfigurationSource} so that Spring Security 6's
 * {@code .cors(Customizer.withDefaults())} can pick it up automatically.
 *
 * Reads allowed origins from {@code cors.allowed-origins} in application.properties.
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOriginsRaw;

    /**
     * Provides a CORS configuration source used by Spring Security.
     * The bean name MUST be {@code corsConfigurationSource} for auto-discovery.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();

        // Parse comma-separated origins from properties
        List<String> origins = Arrays.stream(allowedOriginsRaw.split(","))
                .map(String::trim)
                .toList();
        config.setAllowedOrigins(origins);

        // Allow standard HTTP methods used by the frontend
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Allow all request headers (including Authorization for JWT)
        config.setAllowedHeaders(List.of("*"));

        // Expose Authorization header in responses (needed for token refresh flows)
        config.setExposedHeaders(List.of("Authorization"));

        // Allow credentials (cookies, auth headers)
        config.setAllowCredentials(true);

        // Cache preflight response for 1 hour (reduces OPTIONS pre-flight round-trips)
        config.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }
}
