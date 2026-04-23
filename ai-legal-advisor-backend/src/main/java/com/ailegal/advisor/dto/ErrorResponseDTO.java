package com.ailegal.advisor.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * Standardized error response DTO returned by the global exception handler.
 *
 * Ensures all error responses follow a consistent structure
 * regardless of which exception was thrown.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponseDTO {

    /** HTTP status code (e.g. 400, 500). */
    private int status;

    /** Short error title (e.g. "Bad Request"). */
    private String error;

    /** Human-readable description of what went wrong. */
    private String message;

    /** The request path that triggered the error. */
    private String path;

    /** Timestamp of when the error occurred. */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * Field-level validation errors.
     * Only populated for 400 validation failures.
     * Key = field name, Value = validation message.
     */
    private Map<String, String> fieldErrors;
}
