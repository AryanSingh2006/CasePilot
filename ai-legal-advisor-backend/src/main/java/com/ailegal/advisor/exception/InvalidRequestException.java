package com.ailegal.advisor.exception;

/**
 * Thrown when the incoming request fails business-level validation
 * beyond what @Valid covers (e.g., unsupported query language).
 * Maps to HTTP 400 Bad Request in the global exception handler.
 */
public class InvalidRequestException extends RuntimeException {

    public InvalidRequestException(String message) {
        super(message);
    }
}
