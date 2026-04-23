package com.ailegal.advisor.util;

import com.ailegal.advisor.dto.GeminiResponseDTO;
import com.ailegal.advisor.exception.GeminiApiException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Unit tests for ResponseParser.
 * Verifies correct extraction and graceful failure handling.
 */
class ResponseParserTest {

    private ResponseParser responseParser;

    @BeforeEach
    void setUp() {
        responseParser = new ResponseParser();
    }

    @Test
    @DisplayName("Should extract text from a valid Gemini response")
    void extractText_validResponse_shouldReturnText() {
        // Arrange
        GeminiResponseDTO response = buildResponse("You have the right to request repairs.");

        // Act
        String result = responseParser.extractTextFromGeminiResponse(response);

        // Assert
        assertThat(result).isEqualTo("You have the right to request repairs.");
    }

    @Test
    @DisplayName("Should trim whitespace from extracted text")
    void extractText_textWithWhitespace_shouldTrim() {
        GeminiResponseDTO response = buildResponse("   Some legal answer.   ");

        String result = responseParser.extractTextFromGeminiResponse(response);

        assertThat(result).isEqualTo("Some legal answer.");
    }

    @Test
    @DisplayName("Should throw GeminiApiException when response is null")
    void extractText_nullResponse_shouldThrow() {
        assertThatThrownBy(() -> responseParser.extractTextFromGeminiResponse(null))
                .isInstanceOf(GeminiApiException.class)
                .hasMessageContaining("null response");
    }

    @Test
    @DisplayName("Should throw GeminiApiException when candidates list is empty")
    void extractText_emptyCandidates_shouldThrow() {
        GeminiResponseDTO response = new GeminiResponseDTO(Collections.emptyList());

        assertThatThrownBy(() -> responseParser.extractTextFromGeminiResponse(response))
                .isInstanceOf(GeminiApiException.class);
    }

    @Test
    @DisplayName("Should throw GeminiApiException when text is blank")
    void extractText_blankText_shouldThrow() {
        GeminiResponseDTO response = buildResponse("   ");

        assertThatThrownBy(() -> responseParser.extractTextFromGeminiResponse(response))
                .isInstanceOf(GeminiApiException.class);
    }

    // ─── Helper ───────────────────────────────────────────────────────────

    private GeminiResponseDTO buildResponse(String text) {
        GeminiResponseDTO.Part part         = new GeminiResponseDTO.Part(text);
        GeminiResponseDTO.Content content   = new GeminiResponseDTO.Content(List.of(part), "model");
        GeminiResponseDTO.Candidate candidate = new GeminiResponseDTO.Candidate(content, "STOP");
        return new GeminiResponseDTO(List.of(candidate));
    }
}
