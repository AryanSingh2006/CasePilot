package com.ailegal.advisor.controller;

import com.ailegal.advisor.dto.*;
import com.ailegal.advisor.service.LegalAdvisorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final LegalAdvisorService legalAdvisorService;

    @PostMapping("/ask")
    public ResponseEntity<ChatResponseDTO> ask(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ChatRequestDTO request) {
        log.info("POST /api/chat/ask — user: {}", userDetails.getUsername());
        return ResponseEntity.ok(legalAdvisorService.processQuery(request, userDetails.getUsername()));
    }

    @GetMapping("/history")
    public ResponseEntity<Page<ChatHistoryDTO>> getHistory(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(legalAdvisorService.getHistory(userDetails.getUsername(), page, size));
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<List<ChatHistoryDTO>> getSession(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long sessionId) {
        return ResponseEntity.ok(legalAdvisorService.getSessionMessages(sessionId, userDetails.getUsername()));
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<Void> deleteQuery(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        legalAdvisorService.deleteQuery(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}
