package com.ailegal.advisor.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class ChangePasswordDTO {

    @NotBlank(message = "Current password is required")
    private String currentPassword;

    @NotBlank(message = "New password is required")
    @Size(min = 6, max = 100, message = "New password must be at least 6 characters")
    private String newPassword;
}
