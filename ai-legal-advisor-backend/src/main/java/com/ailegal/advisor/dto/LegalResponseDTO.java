package com.ailegal.advisor.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO for outgoing legal advice responses.
 *
 * Sent back to the client as a clean JSON payload.
 * Null fields are excluded from serialization via @JsonInclude.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LegalResponseDTO {

    /** The AI-generated legal answer. */
    private String answer;

    /** The original query echoed back for context. */
    private String query;

    /** Indicates whether this is a demo/mock response. */
    private boolean demoMode;

    /** Timestamp of when the response was generated. */
    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();

    /** Optional disclaimer appended to all legal responses. */
    @Builder.Default
    private String disclaimer =
        "This response is for informational purposes only and does not constitute legal advice. "
        + "Please consult a licensed attorney for legal guidance specific to your situation.";
}
