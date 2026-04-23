package com.ailegal.advisor.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ChatResponseDTO {

    private Long queryId;
    private Long sessionId;
    private String query;
    private String answer;
    private String categoryName;
    private boolean demoMode;
    private String disclaimer;
    private LocalDateTime timestamp;

    @Builder.Default
    private String disclaimerText =
        "This response is for informational purposes only and does not constitute legal advice. " +
        "Please consult a licensed attorney for guidance specific to your situation.";
}
