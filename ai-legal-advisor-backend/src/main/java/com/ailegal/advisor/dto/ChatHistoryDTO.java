package com.ailegal.advisor.dto;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChatHistoryDTO {
    private Long id;
    private String query;
    private String answer;
    private String categoryName;
    private boolean demoMode;
    private LocalDateTime createdAt;
    private Long sessionId;
}
