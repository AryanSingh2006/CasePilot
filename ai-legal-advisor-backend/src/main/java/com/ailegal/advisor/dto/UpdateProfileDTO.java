package com.ailegal.advisor.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class UpdateProfileDTO {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be 2–100 characters")
    private String name;
}
