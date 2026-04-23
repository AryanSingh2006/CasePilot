package com.ailegal.advisor.service;

import com.ailegal.advisor.model.DisclaimerConsent;
import com.ailegal.advisor.repository.DisclaimerConsentRepository;
import com.ailegal.advisor.repository.UserRepository;
import com.ailegal.advisor.exception.InvalidRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class DisclaimerService {

    private final DisclaimerConsentRepository consentRepository;
    private final UserRepository userRepository;

    public Map<String, Object> getStatus(String email) {
        Long userId = getUserId(email);
        boolean accepted = consentRepository.existsByUserId(userId);
        return Map.of("accepted", accepted);
    }

    public Map<String, Object> acceptDisclaimer(String email) {
        Long userId = getUserId(email);
        if (!consentRepository.existsByUserId(userId)) {
            DisclaimerConsent consent = DisclaimerConsent.builder()
                    .userId(userId)
                    .build();
            consentRepository.save(consent);
            log.info("Disclaimer accepted by userId: {}", userId);
        }
        return Map.of("accepted", true, "message", "Disclaimer accepted successfully");
    }

    private Long getUserId(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidRequestException("User not found"))
                .getId();
    }
}
