package com.ailegal.advisor.exception;

/**
 * Thrown when the Gemini API call fails or returns an unexpected response.
 * Maps to HTTP 502 Bad Gateway in the global exception handler.
 */
public class GeminiApiException extends RuntimeException {

    public GeminiApiException(String message) {
        super(message);
    }

    public GeminiApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
