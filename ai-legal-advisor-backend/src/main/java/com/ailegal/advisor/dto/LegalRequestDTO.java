package com.ailegal.advisor.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for incoming legal advice requests.
 *
 * Validated at the controller layer before reaching the service.
 * Keeps raw HTTP input separate from domain/model objects.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalRequestDTO {

    /**
     * The legal question submitted by the user.
     * Must be non-blank and between 5–2000 characters.
     */
    @NotBlank(message = "Query must not be blank")
    @Size(min = 5, max = 2000, message = "Query must be between 5 and 2000 characters")
    private String query;
}
