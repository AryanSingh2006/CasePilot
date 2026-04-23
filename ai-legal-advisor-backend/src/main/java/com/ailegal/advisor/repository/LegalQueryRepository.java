package com.ailegal.advisor.repository;

import com.ailegal.advisor.model.LegalQuery;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LegalQueryRepository extends JpaRepository<LegalQuery, Long> {

    Page<LegalQuery> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    List<LegalQuery> findBySessionIdOrderByCreatedAtAsc(Long sessionId);

    long countByUserId(Long userId);
}
