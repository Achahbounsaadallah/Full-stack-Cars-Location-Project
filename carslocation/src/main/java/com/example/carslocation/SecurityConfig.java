package com.example.carslocation;

import com.example.carslocation.User.UserRepository;
import com.example.carslocation.User.User;
import com.example.carslocation.User.Role;
import com.example.carslocation.User.UserStatus;
import com.example.carslocation.security.JwtAuthenticationFilter;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;

    // Injection du filtre JWT
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 1. Force l'API à être Stateless (sans session serveur)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                .authorizeHttpRequests(auth -> auth
                        // 2. Endpoints publics (Swagger & Auth)
                        .requestMatchers(
                                "/swagger-ui.html",
                                "/swagger-ui/**",
                                "/v3/api-docs/**",
                                "/v3/api-docs",
                                "/api/auth/**"
                        ).permitAll()

                        // 3. Endpoints sécurisés pour votre UserController (/api/v1/users)
                        .requestMatchers("/api/v1/users/**").hasAnyRole("ADMIN", "EMPLOYEE")

                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll()
                        .requestMatchers("/api/v1/categories/**").hasAnyRole("ADMIN", "EMPLOYEE")

                        .requestMatchers(HttpMethod.GET, "/api/v1/cars/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/cars/available").permitAll()
                        .requestMatchers("/api/v1/cars/**").hasAnyRole("ADMIN", "EMPLOYEE")

                        .requestMatchers(HttpMethod.GET, "/api/v1/availabilities/**").permitAll()
                        .requestMatchers("/api/v1/availabilities/**").hasAnyRole("ADMIN", "EMPLOYEE")

                        .requestMatchers("/api/v1/dashboard/**").hasAnyRole("ADMIN", "EMPLOYEE")

                        .requestMatchers(HttpMethod.GET, "/api/maintenances/**").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers("/api/maintenances/**").hasRole("ADMIN")

                        .requestMatchers(HttpMethod.POST, "/api/v1/bookings").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/bookings/my-bookings").authenticated()
                        .requestMatchers(HttpMethod.GET, "/api/v1/bookings/**").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/bookings/*/approve").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/bookings/*/reject").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/bookings/*/confirm").hasAnyRole("ADMIN", "EMPLOYEE")
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/bookings/*/cancel").authenticated()
                        .anyRequest().authenticated()
                )

                // 4. Ajout obligatoire du filtre JWT dans la chaîne de sécurité
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(java.util.List.of(
                "http://84.8.217.111:3000",
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:5173"

        ));
        configuration.setAllowedMethods(java.util.List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(java.util.List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    @Bean
    public CommandLineRunner createAdminUser(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (!userRepository.existsByEmail("hamid@gmail.com")) {
                User admin = User.builder()
                        .firstName("Hamid")
                        .lastName("Admin")
                        .email("hamid@gmail.com")
                        .passwordHash(passwordEncoder.encode("hamid123"))
                        .role(Role.ADMIN)
                        .status(UserStatus.ACTIVE)
                        .build();

                userRepository.save(admin);
            }
        };
    }
     
    
}
