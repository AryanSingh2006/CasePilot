package com.ailegal.advisor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Internal DTO that maps to the Gemini API request schema.
 *
 * Gemini expects:
 * {
 *   "contents": [
 *     {
 *       "parts": [
 *         { "text": "your prompt here" }
 *       ]
 *     }
 *   ],
 *   "generationConfig": { ... }
 * }
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GeminiRequestDTO {

    private List<Content> contents;
    private GenerationConfig generationConfig;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Content {
        private List<Part> parts;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Part {
        private String text;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class GenerationConfig {
        private int maxOutputTokens;
        private double temperature;
        private double topP;
    }
}
