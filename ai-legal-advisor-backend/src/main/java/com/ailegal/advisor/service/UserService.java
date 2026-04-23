package com.ailegal.advisor.service;

import com.ailegal.advisor.dto.*;
import com.ailegal.advisor.exception.InvalidRequestException;
import com.ailegal.advisor.model.User;
import com.ailegal.advisor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthResponseDTO.UserDTO updateProfile(String email, UpdateProfileDTO dto) {
        User user = findByEmail(email);
        user.setName(dto.getName().trim());
        User saved = userRepository.save(user);
        log.info("Updated profile for: {}", email);
        return toUserDTO(saved);
    }

    public void changePassword(String email, ChangePasswordDTO dto) {
        User user = findByEmail(email);
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            throw new InvalidRequestException("Current password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed for: {}", email);
    }

    private User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidRequestException("User not found"));
    }

    private AuthResponseDTO.UserDTO toUserDTO(User user) {
        return AuthResponseDTO.UserDTO.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }
}
