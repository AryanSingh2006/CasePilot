package com.ailegal.advisor.service;

import com.ailegal.advisor.config.GeminiConfig;
import com.ailegal.advisor.dto.*;
import com.ailegal.advisor.exception.GeminiApiException;
import com.ailegal.advisor.exception.InvalidRequestException;
import com.ailegal.advisor.model.*;
import com.ailegal.advisor.repository.*;
import com.ailegal.advisor.util.LegalPromptBuilder;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class LegalAdvisorService {

    private final GeminiService geminiService;
    private final GeminiConfig geminiConfig;
    private final LegalPromptBuilder promptBuilder;
    private final LegalQueryRepository legalQueryRepository;
    private final ChatSessionRepository chatSessionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    private static final String DEMO_RESPONSE =
        "This is a sample AI-generated legal insight based on your query.\n\n" +
        "In a real scenario, our AI would analyze your question and provide:\n" +
        "• A clear explanation of the relevant legal concepts\n" +
        "• Applicable laws or regulations in your jurisdiction\n" +
        "• Practical steps you can take to address the issue\n" +
        "• A recommendation to consult a licensed attorney\n\n" +
        "To enable real AI responses, please configure your GEMINI_API_KEY environment variable.";

    public ChatResponseDTO processQuery(ChatRequestDTO request, String userEmail) {
        Long userId = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InvalidRequestException("User not found"))
                .getId();

        // Resolve category
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId()).orElse(null);
        }

        // Get or create chat session
        ChatSession session = getOrCreateSession(userId, request.getSessionId(), category);

        // Generate AI response
        String answer;
        boolean isDemoMode = geminiConfig.isDemoMode();

        if (isDemoMode) {
            log.warn("DEMO MODE — GEMINI_API_KEY not set");
            answer = DEMO_RESPONSE;
        } else {
            answer = callGeminiWithCategory(request.getQuery(), category);
        }

        // Persist query
        LegalQuery query = LegalQuery.builder()
                .userId(userId)
                .sessionId(session.getId())
                .query(request.getQuery())
                .answer(answer)
                .demoMode(isDemoMode)
                .categoryName(category != null ? category.getName() : null)
                .build();
        LegalQuery saved = legalQueryRepository.save(query);

        // Update session title if first query
        if (session.getTitle() == null || session.getTitle().isEmpty()) {
            String title = request.getQuery().length() > 80
                    ? request.getQuery().substring(0, 77) + "..."
                    : request.getQuery();
            session.setTitle(title);
            chatSessionRepository.save(session);
        }

        return ChatResponseDTO.builder()
                .queryId(saved.getId())
                .sessionId(session.getId())
                .query(request.getQuery())
                .answer(answer)
                .categoryName(category != null ? category.getName() : null)
                .demoMode(isDemoMode)
                .timestamp(saved.getCreatedAt())
                .build();
    }

    public Page<ChatHistoryDTO> getHistory(String userEmail, int page, int size) {
        Long userId = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InvalidRequestException("User not found"))
                .getId();

        Pageable pageable = PageRequest.of(page, size);
        return legalQueryRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(this::toHistoryDTO);
    }

    public List<ChatHistoryDTO> getSessionMessages(Long sessionId, String userEmail) {
        Long userId = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InvalidRequestException("User not found"))
                .getId();

        // Verify session belongs to user
        chatSessionRepository.findById(sessionId)
                .filter(s -> s.getUserId().equals(userId))
                .orElseThrow(() -> new InvalidRequestException("Session not found"));

        return legalQueryRepository.findBySessionIdOrderByCreatedAtAsc(sessionId)
                .stream().map(this::toHistoryDTO).collect(Collectors.toList());
    }

    public void deleteQuery(Long queryId, String userEmail) {
        Long userId = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new InvalidRequestException("User not found"))
                .getId();

        LegalQuery query = legalQueryRepository.findById(queryId)
                .filter(q -> q.getUserId().equals(userId))
                .orElseThrow(() -> new InvalidRequestException("Query not found"));

        legalQueryRepository.delete(query);
    }

    // ---------------------------------------------------------------
    // Legacy endpoint support (keeps /api/legal/advice working)
    // ---------------------------------------------------------------
    public LegalResponseDTO processLegalQuery(LegalRequestDTO requestDTO) {
        String answer;
        boolean isDemoMode = geminiConfig.isDemoMode();

        if (isDemoMode) {
            answer = DEMO_RESPONSE;
        } else {
            answer = callGeminiWithFallback(requestDTO.getQuery());
        }

        LegalQuery entity = LegalQuery.builder()
                .query(requestDTO.getQuery())
                .answer(answer)
                .demoMode(isDemoMode)
                .build();
        legalQueryRepository.save(entity);

        return LegalResponseDTO.builder()
                .query(requestDTO.getQuery())
                .answer(answer)
                .demoMode(isDemoMode)
                .build();
    }

    // ---------------------------------------------------------------
    // Private helpers
    // ---------------------------------------------------------------
    private ChatSession getOrCreateSession(Long userId, Long sessionId, Category category) {
        if (sessionId != null) {
            return chatSessionRepository.findById(sessionId)
                    .filter(s -> s.getUserId().equals(userId))
                    .orElseGet(() -> createSession(userId, category));
        }
        return createSession(userId, category);
    }

    private ChatSession createSession(Long userId, Category category) {
        ChatSession session = ChatSession.builder()
                .userId(userId)
                .category(category)
                .build();
        return chatSessionRepository.save(session);
    }

    private String callGeminiWithCategory(String query, Category category) {
        try {
            String prompt;
            if (category != null && category.getSystemPromptPrefix() != null) {
                prompt = category.getSystemPromptPrefix() + "\n\nUser Query: " + query;
            } else {
                prompt = promptBuilder.buildLegalPrompt(query);
            }
            return geminiService.generateResponse(prompt);
        } catch (GeminiApiException ex) {
            log.error("Gemini API call failed: {}", ex.getMessage());
            throw ex;
        }
    }

    private String callGeminiWithFallback(String query) {
        try {
            String prompt = promptBuilder.buildLegalPrompt(query);
            return geminiService.generateResponse(prompt);
        } catch (GeminiApiException ex) {
            log.error("Gemini API call failed: {}", ex.getMessage());
            throw ex;
        }
    }

    private ChatHistoryDTO toHistoryDTO(LegalQuery q) {
        return ChatHistoryDTO.builder()
                .id(q.getId())
                .query(q.getQuery())
                .answer(q.getAnswer())
                .categoryName(q.getCategoryName())
                .demoMode(q.isDemoMode())
                .createdAt(q.getCreatedAt())
                .sessionId(q.getSessionId())
                .build();
    }

}
