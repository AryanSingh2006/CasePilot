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
}
