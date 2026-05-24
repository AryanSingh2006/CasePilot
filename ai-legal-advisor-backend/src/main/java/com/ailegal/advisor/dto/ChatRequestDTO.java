package com.ailegal.advisor.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ChatRequestDTO {

    @NotBlank(message = "Query is required")
    @Size(min = 3, max = 4000, message = "Query must be 3–4000 characters")
    private String query;

    /** Optional: ID of selected legal category */
    private Long categoryId;

    /** Optional: existing sessionId to continue a conversation */
    private Long sessionId;

    /**
     * Optional: UUID of a previously uploaded document (from POST /api/documents/upload).
     * When present, the AI answer will be grounded in the document's extracted text
     * rather than using only its general legal knowledge.
     */
    private String documentId;
}

