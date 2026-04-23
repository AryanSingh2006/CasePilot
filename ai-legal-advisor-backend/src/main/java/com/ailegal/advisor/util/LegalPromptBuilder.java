package com.ailegal.advisor.util;

import org.springframework.stereotype.Component;

/**
 * Utility class responsible for building structured prompts
 * sent to the Gemini AI model.
 *
 * Centralizing prompt construction here means prompt changes
 * don't require touching the service or API layer.
 */
@Component
public class LegalPromptBuilder {

    /**
     * Builds a structured legal advisory prompt from the user's raw query.
     *
     * The prompt includes:
     * - A system-level role instruction (act as legal advisor)
     * - A disclaimer instruction (always advise consulting a lawyer)
     * - The user's actual question
     * - A format instruction for a structured response
     *
     * @param userQuery The raw legal question from the user
     * @return A fully constructed prompt string ready for the AI
     */
    public String buildLegalPrompt(String userQuery) {
        return """
                You are an AI Legal Advisor with expertise in general legal concepts, \
                regulations, rights, and common legal procedures.
                
                Your role is to:
                1. Provide clear, accurate, and well-structured legal information
                2. Explain legal concepts in plain, accessible language
                3. Identify the key legal issues in the user's question
                4. Always remind users that your response is informational only
                5. Recommend consulting a licensed attorney for specific legal advice
                
                User's Legal Question:
                %s
                
                Please respond with:
                - A direct answer to the question
                - Relevant legal context or applicable laws (if known)
                - Practical next steps the user can take
                - A brief note that this does not replace professional legal counsel
                
                Keep your response clear, concise, and helpful.
                """.formatted(userQuery);
    }
}
