package com.ailegal.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Internal DTO that maps the Gemini API response payload.
 *
 * Gemini responds with:
 * {
 *   "candidates": [
 *     {
 *       "content": {
 *         "parts": [ { "text": "response text" } ],
 *         "role": "model"
 *       },
 *       "finishReason": "STOP"
 *     }
 *   ]
 * }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class GeminiResponseDTO {

    private List<Candidate> candidates;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Candidate {
        private Content content;
        private String finishReason;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;
        private String role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
    }
}
