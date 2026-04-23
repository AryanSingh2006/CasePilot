package com.ailegal.advisor.controller;

import com.ailegal.advisor.service.DisclaimerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/disclaimer")
@RequiredArgsConstructor
public class DisclaimerController {

    private final DisclaimerService disclaimerService;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(disclaimerService.getStatus(userDetails.getUsername()));
    }

    @PostMapping("/accept")
    public ResponseEntity<Map<String, Object>> accept(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(disclaimerService.acceptDisclaimer(userDetails.getUsername()));
    }
}
