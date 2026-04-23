package com.ailegal.advisor.service;

import com.ailegal.advisor.config.GeminiConfig;
import com.ailegal.advisor.dto.LegalRequestDTO;
import com.ailegal.advisor.dto.LegalResponseDTO;
import com.ailegal.advisor.repository.LegalQueryRepository;
import com.ailegal.advisor.util.LegalPromptBuilder;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * Unit tests for LegalAdvisorService.
 *
 * Uses Mockito to isolate the service layer from its dependencies.
 * No real HTTP calls or database connections are made.
 */
@ExtendWith(MockitoExtension.class)
class LegalAdvisorServiceTest {

    @Mock private GeminiService geminiService;
    @Mock private GeminiConfig geminiConfig;
    @Mock private LegalPromptBuilder promptBuilder;
    @Mock private LegalQueryRepository legalQueryRepository;

    @InjectMocks
    private LegalAdvisorService legalAdvisorService;

    private LegalRequestDTO validRequest;

    @BeforeEach
    void setUp() {
        validRequest = LegalRequestDTO.builder()
                .query("Can my employer deduct salary without notice?")
                .build();
    }

    @Test
    @DisplayName("Should return demo response when API key is not configured")
    void processLegalQuery_demoMode_shouldReturnDemoResponse() {
        // Arrange: simulate missing API key
        when(geminiConfig.isDemoMode()).thenReturn(true);
        when(legalQueryRepository.save(any())).thenReturn(null);

        // Act
        LegalResponseDTO response = legalAdvisorService.processLegalQuery(validRequest);

        // Assert
        assertThat(response).isNotNull();
        assertThat(response.isDemoMode()).isTrue();
        assertThat(response.getAnswer()).isNotBlank();
        assertThat(response.getQuery()).isEqualTo(validRequest.getQuery());
        assertThat(response.getDisclaimer()).isNotBlank();

        // Gemini should NOT be called in demo mode
        verifyNoInteractions(geminiService);
    }

    @Test
    @DisplayName("Should call Gemini and return real answer when API key is present")
    void processLegalQuery_liveMode_shouldCallGeminiAndReturnAnswer() {
        // Arrange: simulate valid API key
        String mockPrompt  = "You are an AI Legal Advisor... Can my employer deduct...";
        String mockAnswer  = "No, your employer cannot deduct salary without proper notice under labour law.";

        when(geminiConfig.isDemoMode()).thenReturn(false);
        when(promptBuilder.buildLegalPrompt(validRequest.getQuery())).thenReturn(mockPrompt);
        when(geminiService.generateResponse(mockPrompt)).thenReturn(mockAnswer);
        when(legalQueryRepository.save(any())).thenReturn(null);

        // Act
        LegalResponseDTO response = legalAdvisorService.processLegalQuery(validRequest);

        // Assert
        assertThat(response.getAnswer()).isEqualTo(mockAnswer);
        assertThat(response.isDemoMode()).isFalse();
        assertThat(response.getQuery()).isEqualTo(validRequest.getQuery());

        verify(geminiService, times(1)).generateResponse(mockPrompt);
    }

    @Test
    @DisplayName("Should still return response even if database persistence fails")
    void processLegalQuery_dbFailure_shouldNotAffectResponse() {
        // Arrange: demo mode but DB throws an exception
        when(geminiConfig.isDemoMode()).thenReturn(true);
        when(legalQueryRepository.save(any())).thenThrow(new RuntimeException("DB unavailable"));

        // Act — should NOT throw
        LegalResponseDTO response = legalAdvisorService.processLegalQuery(validRequest);

        // Assert: response is still returned despite DB failure
        assertThat(response).isNotNull();
        assertThat(response.getAnswer()).isNotBlank();
    }
}
