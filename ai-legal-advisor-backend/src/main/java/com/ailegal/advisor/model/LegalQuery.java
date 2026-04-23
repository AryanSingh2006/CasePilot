package com.ailegal.advisor.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "legal_queries", indexes = {
    @Index(name = "idx_query_user", columnList = "user_id"),
    @Index(name = "idx_query_session", columnList = "session_id")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LegalQuery {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** The user who submitted this query */
    @Column(name = "user_id")
    private Long userId;

    /** The chat session this query belongs to */
    @Column(name = "session_id")
    private Long sessionId;

    /** The original question submitted by the user */
    @Column(nullable = false, length = 4000)
    private String query;

    /** The AI-generated response */
    @Column(columnDefinition = "TEXT")
    private String answer;

    /** Whether the response came from demo/mock mode */
    @Column(nullable = false)
    private boolean demoMode;

    /** The category name at time of query (denormalized for history display) */
    @Column(length = 100)
    private String categoryName;

    /** IP address or session identifier */
    @Column(length = 100)
    private String clientIdentifier;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
