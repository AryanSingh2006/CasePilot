package com.ailegal.advisor.util;

import com.ailegal.advisor.dto.GeminiResponseDTO;
import com.ailegal.advisor.exception.GeminiApiException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Utility class for parsing and extracting text from the Gemini API response.
 *
 * Isolating parsing logic here makes it easy to update
 * if the Gemini response schema changes in future API versions.
 */
@Slf4j
@Component
public class ResponseParser {

    /**
     * Extracts the plain text answer from a GeminiResponseDTO.
     *
     * Navigates the nested response structure:
     * candidates[0] → content → parts[0] → text
     *
     * @param response The raw Gemini API response
     * @return The extracted text answer
     * @throws GeminiApiException if the response is malformed or empty
     */
    public String extractTextFromGeminiResponse(GeminiResponseDTO response) {
        try {
            if (response == null) {
                throw new GeminiApiException("Gemini API returned a null response");
            }

            if (response.getCandidates() == null || response.getCandidates().isEmpty()) {
                log.warn("Gemini response contained no candidates");
                throw new GeminiApiException("AI model returned no response candidates");
            }

            GeminiResponseDTO.Candidate candidate = response.getCandidates().get(0);

            if (candidate.getContent() == null
                    || candidate.getContent().getParts() == null
                    || candidate.getContent().getParts().isEmpty()) {
                throw new GeminiApiException("AI model response content was empty");
            }

            String text = candidate.getContent().getParts().get(0).getText();

            if (text == null || text.isBlank()) {
                throw new GeminiApiException("AI model returned blank text");
            }

            log.debug("Successfully parsed Gemini response ({} chars)", text.length());
            return text.trim();

        } catch (GeminiApiException ex) {
            throw ex; // Re-throw our own exception as-is
        } catch (Exception ex) {
            log.error("Unexpected error parsing Gemini response: {}", ex.getMessage());
            throw new GeminiApiException("Failed to parse AI response", ex);
        }
    }
}
