package com.ailegal.advisor.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for LegalPromptBuilder.
 * Verifies that prompts are correctly constructed from user queries.
 */
class LegalPromptBuilderTest {

    private LegalPromptBuilder promptBuilder;

    @BeforeEach
    void setUp() {
        promptBuilder = new LegalPromptBuilder();
    }

    @Test
    @DisplayName("Built prompt should contain the original user query")
    void buildLegalPrompt_shouldContainUserQuery() {
        String query  = "What is the notice period for employment termination?";
        String prompt = promptBuilder.buildLegalPrompt(query);

        assertThat(prompt).contains(query);
    }

    @Test
    @DisplayName("Built prompt should include legal advisor role instruction")
    void buildLegalPrompt_shouldContainRoleInstruction() {
        String prompt = promptBuilder.buildLegalPrompt("Any question");

        assertThat(prompt).containsIgnoringCase("AI Legal Advisor");
    }

    @Test
    @DisplayName("Built prompt should not be blank for any valid input")
    void buildLegalPrompt_shouldNeverBeBlank() {
        String prompt = promptBuilder.buildLegalPrompt("Short query");

        assertThat(prompt).isNotBlank();
    }
}
