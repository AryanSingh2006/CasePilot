package com.ailegal.advisor.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Integration tests for LegalAdvisorController.
 *
 * Uses MockMvc to simulate HTTP requests without a running server.
 * Runs with the full Spring context — tests the full request pipeline
 * including validation, service layer, and demo mode fallback.
 */
@SpringBootTest
@AutoConfigureMockMvc
class LegalAdvisorControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // ─── Health Check ──────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /api/legal/health → 200 OK")
    void healthEndpoint_shouldReturn200() throws Exception {
        mockMvc.perform(get("/api/legal/health"))
                .andExpect(status().isOk())
                .andExpect(content().string("AI Legal Advisor is running"));
    }

    // ─── Happy Path ────────────────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/legal/advice with valid query → 200 with answer")
    void getLegalAdvice_validQuery_shouldReturnAnswer() throws Exception {
        String requestBody = """
                {
                    "query": "What are my rights as a tenant when my landlord refuses to fix heating?"
                }
                """;

        mockMvc.perform(post("/api/legal/advice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.answer").exists())
                .andExpect(jsonPath("$.answer").isNotEmpty())
                .andExpect(jsonPath("$.query").value("What are my rights as a tenant when my landlord refuses to fix heating?"))
                .andExpect(jsonPath("$.disclaimer").exists())
                .andExpect(jsonPath("$.timestamp").exists())
                .andExpect(jsonPath("$.demoMode").value(true)); // Will be true in CI (no API key)
    }

    // ─── Validation Failures ───────────────────────────────────────────────

    @Test
    @DisplayName("POST /api/legal/advice with blank query → 400 Bad Request")
    void getLegalAdvice_blankQuery_shouldReturn400() throws Exception {
        String requestBody = """
                {
                    "query": ""
                }
                """;

        mockMvc.perform(post("/api/legal/advice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.error").value("Validation Failed"))
                .andExpect(jsonPath("$.fieldErrors.query").exists());
    }

    @Test
    @DisplayName("POST /api/legal/advice with missing query field → 400 Bad Request")
    void getLegalAdvice_missingQuery_shouldReturn400() throws Exception {
        String requestBody = "{}";

        mockMvc.perform(post("/api/legal/advice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.query").exists());
    }

    @Test
    @DisplayName("POST /api/legal/advice with too-short query → 400 Bad Request")
    void getLegalAdvice_tooShortQuery_shouldReturn400() throws Exception {
        String requestBody = """
                {
                    "query": "hi"
                }
                """;

        mockMvc.perform(post("/api/legal/advice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.query").exists());
    }

    @Test
    @DisplayName("POST /api/legal/advice with malformed JSON → 400 Bad Request")
    void getLegalAdvice_malformedJson_shouldReturn400() throws Exception {
        mockMvc.perform(post("/api/legal/advice")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{ invalid json }"))
                .andExpect(status().isBadRequest());
    }
}
