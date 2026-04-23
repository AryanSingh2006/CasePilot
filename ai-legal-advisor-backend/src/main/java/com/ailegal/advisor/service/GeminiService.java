package com.ailegal.advisor.service;

import com.ailegal.advisor.config.GeminiConfig;
import com.ailegal.advisor.dto.GeminiRequestDTO;
import com.ailegal.advisor.dto.GeminiResponseDTO;
import com.ailegal.advisor.exception.GeminiApiException;
import com.ailegal.advisor.util.ResponseParser;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiService {

    private final WebClient geminiWebClient;
    private final GeminiConfig geminiConfig;
    private final ResponseParser responseParser;

    private static final Duration API_TIMEOUT = Duration.ofSeconds(30);

    /**
     * Sends a prompt to the Gemini API and returns the generated text.
     *
     * @param prompt The fully constructed prompt string
     * @return The AI-generated text response
     * @throws GeminiApiException if the API call fails or returns an error
     */
    public String generateResponse(String prompt) {
        log.info("Sending prompt to Gemini API (model: {})", geminiConfig.getModel());

        GeminiRequestDTO requestBody = buildGeminiRequest(prompt);

        String url = geminiConfig.getEndpoint() + "?key=" + geminiConfig.getApiKey();

        try {
            GeminiResponseDTO response = geminiWebClient
                    .post()
                    .uri(url)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(GeminiResponseDTO.class)
                    .timeout(API_TIMEOUT)
                    .block(); // Blocking call — acceptable in MVC (non-reactive) context

            return responseParser.extractTextFromGeminiResponse(response);

        } catch (WebClientResponseException ex) {
            log.error("Gemini API HTTP error: {} - {}", ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new GeminiApiException(
                "Gemini API returned error: " + ex.getStatusCode() + " - " + ex.getMessage(), ex
            );
        } catch (GeminiApiException ex) {
            throw ex; 
        } catch (Exception ex) {
            log.error("Unexpected error calling Gemini API: {}", ex.getMessage(), ex);
            throw new GeminiApiException("Failed to reach Gemini API: " + ex.getMessage(), ex);
        }
    }

    /**
     * Constructs the Gemini API request body with the prompt and generation settings.
     *
     * @param prompt The final prompt text to send
     * @return A structured GeminiRequestDTO
     */
    private GeminiRequestDTO buildGeminiRequest(String prompt) {
        return GeminiRequestDTO.builder()
                .contents(List.of(
                    GeminiRequestDTO.Content.builder()
                        .parts(List.of(
                            GeminiRequestDTO.Part.builder()
                                .text(prompt)
                                .build()
                        ))
                        .build()
                ))
                .generationConfig(
                    GeminiRequestDTO.GenerationConfig.builder()
                        .maxOutputTokens(4096)   
                        .temperature(0.4)   
                        .topP(0.9)              
                        .build()
                )
                .build();
    }
}
