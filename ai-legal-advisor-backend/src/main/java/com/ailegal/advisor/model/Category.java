package com.ailegal.advisor.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "categories")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 300)
    private String description;

    /** Emoji or icon identifier shown in frontend */
    @Column(length = 10)
    private String icon;

    /** System prompt prefix injected before user query when this category is selected */
    @Column(columnDefinition = "TEXT")
    private String systemPromptPrefix;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
