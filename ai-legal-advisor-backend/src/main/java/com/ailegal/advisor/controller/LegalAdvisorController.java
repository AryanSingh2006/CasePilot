package com.ailegal.advisor.controller;

import com.ailegal.advisor.dto.LegalRequestDTO;
import com.ailegal.advisor.dto.LegalResponseDTO;
import com.ailegal.advisor.service.LegalAdvisorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST Controller for the AI Legal Advisor API.
 *
 * Handles all incoming HTTP requests under /api/legal.
 * Delegates all business logic to LegalAdvisorService — the controller
 * stays thin and only deals with HTTP concerns (request/response mapping).
 */
@Slf4j
@RestController
@RequestMapping("/api/legal")
@RequiredArgsConstructor
public class LegalAdvisorController {

    private final LegalAdvisorService legalAdvisorService;

    /**
     * POST /api/legal/advice
     *
     * Accepts a legal query from the user and returns an AI-generated response.
     *
     * Request Body:  { "query": "What are my tenant rights?" }
     * Response Body: { "answer": "...", "query": "...", "demoMode": false, "disclaimer": "...", "timestamp": "..." }
     *
     * @param requestDTO Validated request body containing the user's legal question
     * @return 200 OK with the AI-generated legal response
     */
    @PostMapping("/advice")
    public ResponseEntity<LegalResponseDTO> getLegalAdvice(
            @Valid @RequestBody LegalRequestDTO requestDTO) {

        log.info("Received POST /api/legal/advice — query length: {} chars",
                requestDTO.getQuery().length());

        LegalResponseDTO response = legalAdvisorService.processLegalQuery(requestDTO);

        log.info("Returning legal advice response — demoMode: {}", response.isDemoMode());
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/legal/health
     *
     * Simple liveness check endpoint.
     * Can be used by Docker, Kubernetes, or load balancers to verify the service is up.
     *
     * @return 200 OK with a plain status message
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Legal Advisor is running");
    }
}
