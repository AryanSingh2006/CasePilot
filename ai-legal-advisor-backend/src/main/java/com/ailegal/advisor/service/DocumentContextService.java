package com.ailegal.advisor.service;

import com.ailegal.advisor.model.Category;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DocumentContextService {

    @Value("${document.context.chunk-size:3200}")
    private int chunkSize;

    @Value("${document.context.top-chunks:3}")
    private int topChunks;

    /** Fraction of chunkSize to overlap between consecutive chunks */
    private static final double OVERLAP_RATIO = 0.10;

    // ---------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------

    /**
     * Builds a Gemini prompt grounded in the relevant sections of an uploaded document.
     *
     * @param userQuery     The user's natural-language legal question
     * @param documentText  The full extracted text of the document (from DocumentStore)
     * @param fileName      Original file name — used in the prompt for attribution
     * @param category      Optional legal category (may be null)
     * @return A complete prompt string ready to pass directly to GeminiService
     */
    public String buildDocumentGroundedPrompt(String userQuery,
                                               String documentText,
                                               String fileName,
                                               Category category) {

        List<String> chunks = splitIntoChunks(documentText);
        log.debug("DocumentContextService: {} total chunks from '{}' (query len={})",
                chunks.size(), fileName, userQuery.length());

        List<String> relevantChunks = selectRelevantChunks(chunks, userQuery);
        String context = String.join("\n\n---\n\n", relevantChunks);

        return buildPrompt(userQuery, context, fileName, category);
    }

    /**
     * Returns a short preview of the extracted document text (first 500 chars).
     * Used by the controller's /preview endpoint.
     *
     * @param documentText Full extracted text
     * @return Preview string (max 500 chars)
     */
    public String buildPreview(String documentText) {
        if (documentText == null || documentText.isBlank()) return "";
        return documentText.length() > 500
               ? documentText.substring(0, 500).strip() + "…"
               : documentText.strip();
    }

    // ---------------------------------------------------------------
    // Chunking
    // ---------------------------------------------------------------

    /**
     * Splits text into overlapping character-level windows.
     *
     * <p>Overlap ensures that a sentence split across two windows
     * isn't lost — the tail of one chunk appears at the head of the next.
     *
     * @param text Full document text
     * @return Ordered list of chunks
     */
    private List<String> splitIntoChunks(String text) {
        List<String> chunks = new ArrayList<>();
        int overlap = (int) (chunkSize * OVERLAP_RATIO);
        int step = chunkSize - overlap;
        int start = 0;

        while (start < text.length()) {
            int end = Math.min(start + chunkSize, text.length());
            chunks.add(text.substring(start, end));
            if (end == text.length()) break;
            start += step;
        }

        return chunks;
    }

    // ---------------------------------------------------------------
    // Relevance scoring
    // ---------------------------------------------------------------

    /**
     * Scores each chunk by how many unique query keywords it contains,
     * then returns the top-N chunks in their original document order.
     *
     * @param chunks    All chunks in document order
     * @param userQuery The user's question
     * @return Top-N most relevant chunks, re-sorted to preserve reading flow
     */
    private List<String> selectRelevantChunks(List<String> chunks, String userQuery) {
        Set<String> keywords = tokenize(userQuery);

        // Score each chunk: count of keyword hits
        record ScoredChunk(int index, String text, long score) {}

        List<ScoredChunk> scored = new ArrayList<>();
        for (int i = 0; i < chunks.size(); i++) {
            String lowerChunk = chunks.get(i).toLowerCase();
            long score = keywords.stream()
                .filter(lowerChunk::contains)
                .count();
            scored.add(new ScoredChunk(i, chunks.get(i), score));
        }

        // Pick top-N (or all if fewer exist), then restore document order
        return scored.stream()
            .sorted(Comparator.comparingLong(ScoredChunk::score).reversed())
            .limit(topChunks)
            .sorted(Comparator.comparingInt(ScoredChunk::index))  // restore reading order
            .map(ScoredChunk::text)
            .collect(Collectors.toList());
    }

    /**
     * Tokenises a query string into lowercase words, filtering out stop-words
     * (words with ≤2 characters) and deduplicating.
     */
    private Set<String> tokenize(String text) {
        return Arrays.stream(text.toLowerCase().split("[\\W_]+"))
            .filter(w -> w.length() > 2)
            .collect(Collectors.toSet());
    }

    // ---------------------------------------------------------------
    // Prompt construction
    // ---------------------------------------------------------------

    /**
     * Builds the Gemini prompt using a strict two-step classification gate.
     *
     * STEP 1 — AI must classify the document as [LEGAL] or [NOT_LEGAL] first.
     * STEP 2 — Two completely separate, mutually exclusive response paths.
     *           NOT_LEGAL path outputs a fixed refusal template verbatim.
     *           LEGAL path analyses the document and answers the question.
     */
    private String buildPrompt(String userQuery,
                                String context,
                                String fileName,
                                Category category) {

        // Optional category system-prompt prefix
        String categoryPrefix = (category != null && category.getSystemPromptPrefix() != null)
            ? category.getSystemPromptPrefix() + "\n\n"
            : "";

        return categoryPrefix +
            "You are CasePilot, a specialized AI Legal Advisor. " +
            "You are ONLY permitted to analyze documents that are legal in nature. " +
            "You must REFUSE to engage with any other type of content.\n\n" +

            "=== STEP 1: MANDATORY DOCUMENT CLASSIFICATION ===\n" +
            "Read the document excerpts below and classify it as one of:\n" +
            "  [LEGAL]     - The document is primarily a legal document.\n" +
            "  [NOT_LEGAL] - The document is NOT a legal document.\n\n" +

            "LEGAL documents include:\n" +
            "- Contracts, agreements, MoUs, NDAs, lease deeds, sale deeds\n" +
            "- Court orders, judgments, writs, legal notices, FIRs, charge-sheets\n" +
            "- Acts, statutes, regulations, by-laws, government orders\n" +
            "- Wills, trusts, deeds, power of attorney, affidavits\n" +
            "- Legal correspondence, demand letters, cease-and-desist letters\n" +
            "- Terms of service, privacy policies, SLAs, compliance documents\n" +
            "- Employment contracts, HR policies with legal provisions, settlement agreements\n" +
            "- Any document whose primary purpose is to define or enforce legal rights and obligations\n\n" +

            "NOT_LEGAL documents include:\n" +
            "- Recipes, cooking guides, food menus\n" +
            "- Programming tutorials, technical manuals, software documentation\n" +
            "- Academic or scientific papers on non-law subjects\n" +
            "- News articles, blog posts, social media content\n" +
            "- Marketing brochures, product catalogues, pitch decks\n" +
            "- Fiction, poetry, personal diaries, creative writing\n" +
            "- Medical reports and prescriptions (unless legal evidence)\n" +
            "- Financial statements with no legal context\n\n" +

            "=== STEP 2: ACT BASED ON YOUR CLASSIFICATION — NO EXCEPTIONS ===\n\n" +

            "IF YOU CLASSIFIED AS [NOT_LEGAL]:\n" +
            "Output ONLY the following. DO NOT answer the user's question. " +
            "DO NOT analyze any content in the document. DO NOT offer workarounds. " +
            "DO NOT deviate from this exact response:\n\n" +
            "---\n" +
            "The uploaded document does not appear to be a legal document.\n" +
            "[In one sentence, describe what the document actually seems to be about.]\n\n" +
            "CasePilot is designed exclusively for analyzing legal documents such as contracts, " +
            "court orders, legislation, agreements, and similar legal materials.\n\n" +
            "To proceed, please upload a legal document such as:\n" +
            "- A contract or agreement\n" +
            "- A court order or legal notice\n" +
            "- Legislation or government regulation\n" +
            "- An employment agreement or NDA\n" +
            "- A will, deed, or power of attorney\n" +
            "---\n\n" +

            "IF YOU CLASSIFIED AS [LEGAL]:\n" +
            "Document name: \"" + fileName + "\"\n\n" +
            "=== RELEVANT DOCUMENT EXCERPTS ===\n" +
            context + "\n" +
            "=== END OF DOCUMENT EXCERPTS ===\n\n" +
            "Answer the user question using ONLY the document content above.\n" +
            "Rules:\n" +
            "1. Base your entire answer on the document excerpts. " +
            "If the document is silent on the specific point, say so explicitly — do not fabricate.\n" +
            "2. Quote or cite specific clauses, sections, or articles by name/number where relevant.\n" +
            "3. Explain legal terms in plain language.\n" +
            "4. Remind the user: this is informational only, not formal legal advice.\n" +
            "5. Recommend consulting a licensed attorney for any decisions.\n\n" +
            "User's question: " + userQuery + "\n\n" +
            "Respond with:\n" +
            "- Direct answer grounded in the document\n" +
            "- Specific clauses/sections referenced\n" +
            "- Practical next steps\n" +
            "- Brief disclaimer\n";
    }
}

