package com.example.carslocation.auth;

import com.example.carslocation.User.Role;
import com.example.carslocation.User.User;
import com.example.carslocation.User.UserRepository;
import com.example.carslocation.User.UserStatus;
import com.example.carslocation.User.dto.UserResponseDTO;
import com.example.carslocation.auth.dto.AuthRequestDTO;
import com.example.carslocation.auth.dto.AuthResponseDTO;
import com.example.carslocation.auth.dto.RegisterRequestDTO;
import com.example.carslocation.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public AuthResponseDTO login(AuthRequestDTO dto) {
        // 1. Check email
        User user = userRepository.findByEmail(dto.email())
                .orElseThrow(() -> new RuntimeException("Email ou mot de passe incorrect."));

        // 2. Check password
        if (!passwordEncoder.matches(dto.password(), user.getPasswordHash())) {
            throw new RuntimeException("Email ou mot de passe incorrect.");
        }

        // 3. Generate JWT
        String token = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return new AuthResponseDTO(token);
    }
    public UserResponseDTO register(RegisterRequestDTO dto) {
        // 1. Vérifier si l'email existe déjà
        if (userRepository.existsByEmail(dto.email())) {
            throw new IllegalArgumentException("Cet email est déjà utilisé.");
        }

        // 2. Créer l'utilisateur en forçant CLIENT et ACTIVE
        User user = User.builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .email(dto.email())
                .passwordHash(passwordEncoder.encode(dto.password())) // Hachage du mot de passe
                .phone(dto.phone())
                .role(Role.CLIENT)          // Valeur forcée côté serveur
                .status(UserStatus.ACTIVE)  // Valeur forcée côté serveur
                .build();

        User savedUser = userRepository.save(user);

        // 3. Retourner le DTO de réponse sans exposer le mot de passe
        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getFirstName(),
                savedUser.getLastName(),
                savedUser.getEmail(),
                savedUser.getPhone(),
                savedUser.getRole(),
                savedUser.getStatus(),
                savedUser.getCreatedAt(),
                savedUser.getUpdatedAt()
        );
    }
}
