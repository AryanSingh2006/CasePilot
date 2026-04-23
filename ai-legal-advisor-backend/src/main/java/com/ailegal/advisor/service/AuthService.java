package com.ailegal.advisor.service;

import com.ailegal.advisor.dto.*;
import com.ailegal.advisor.exception.InvalidRequestException;
import com.ailegal.advisor.model.User;
import com.ailegal.advisor.repository.UserRepository;
import com.ailegal.advisor.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail().toLowerCase())) {
            throw new InvalidRequestException("Email is already registered");
        }

        User user = User.builder()
                .name(dto.getName().trim())
                .email(dto.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role("USER")
                .build();

        User saved = userRepository.save(user);
        log.info("Registered new user: {}", saved.getEmail());

        String token = jwtUtil.generateToken(saved);
        return buildAuthResponse(token, saved);
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            dto.getEmail().toLowerCase(), dto.getPassword()));
        } catch (AuthenticationException e) {
            throw new InvalidRequestException("Invalid email or password");
        }

        User user = userRepository.findByEmail(dto.getEmail().toLowerCase())
                .orElseThrow(() -> new InvalidRequestException("User not found"));

        String token = jwtUtil.generateToken(user);
        log.info("User logged in: {}", user.getEmail());
        return buildAuthResponse(token, user);
    }

    public AuthResponseDTO.UserDTO getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidRequestException("User not found"));
        return AuthResponseDTO.UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    private AuthResponseDTO buildAuthResponse(String token, User user) {
        return AuthResponseDTO.builder()
                .token(token)
                .user(AuthResponseDTO.UserDTO.builder()
                        .id(user.getId())
                        .name(user.getName())
                        .email(user.getEmail())
                        .build())
                .build();
    }
}
