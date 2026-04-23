package com.ailegal.advisor.repository;

import com.ailegal.advisor.model.DisclaimerConsent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisclaimerConsentRepository extends JpaRepository<DisclaimerConsent, Long> {
    Optional<DisclaimerConsent> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
