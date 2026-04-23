package com.ailegal.advisor.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "disclaimer_consents", indexes = {
    @Index(name = "idx_consent_user", columnList = "user_id", unique = true)
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DisclaimerConsent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(nullable = false)
    private LocalDateTime acceptedAt;

    @PrePersist
    protected void onCreate() {
        this.acceptedAt = LocalDateTime.now();
    }
}
