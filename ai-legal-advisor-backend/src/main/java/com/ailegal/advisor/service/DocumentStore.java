package com.ailegal.advisor.service;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

/**
 * In-memory store for extracted document text.
 *
 * <p>Documents are keyed by a UUID {@code documentId} that the client receives
 * after upload. This store is intentionally session-agnostic — the UUID itself
 * acts as a capability token; whoever holds a valid UUID can query against that
 * document.
 *
 * <p>A scheduled task evicts documents older than {@code document.store.ttl-minutes}
 * (default 120 min) to prevent unbounded memory growth.
 *
 * <p><b>Single-instance note:</b> This implementation uses process memory and is
 * suitable for single-node deployments. For clustered or persistent storage,
 * replace with a Redis-backed solution.
 */
@Slf4j
@Component
public class DocumentStore {

    /** Maximum time a document stays in the store before automatic eviction. */
    @Value("${document.store.ttl-minutes:120}")
    private int ttlMinutes;

    private final Map<String, StoredDocument> store = new ConcurrentHashMap<>();

    // ---------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------

    /**
     * Saves a newly extracted document and returns its generated UUID.
     *
     * @param fileName      Original file name (for display purposes)
     * @param extractedText Cleaned plain text extracted from the document
     * @return UUID string — the documentId the client must reference later
     */
    public String save(String fileName, String extractedText) {
        String documentId = UUID.randomUUID().toString();
        store.put(documentId, new StoredDocument(documentId, fileName, extractedText, LocalDateTime.now()));
        log.info("DocumentStore: saved '{}' as documentId={} ({} chars)", fileName, documentId, extractedText.length());
        return documentId;
    }

    /**
     * Looks up a document by its UUID.
     *
     * @param documentId UUID issued at upload time
     * @return Optional containing the stored document, or empty if not found / evicted
     */
    public Optional<StoredDocument> find(String documentId) {
        return Optional.ofNullable(store.get(documentId));
    }

    /**
     * Explicitly removes a document (e.g., when the user clicks "Remove").
     *
     * @param documentId UUID of the document to remove
     * @return true if found and removed, false if it was already gone
     */
    public boolean remove(String documentId) {
        boolean removed = store.remove(documentId) != null;
        if (removed) {
            log.info("DocumentStore: document {} removed by explicit request", documentId);
        }
        return removed;
    }

    /** Returns the current number of documents held in the store. */
    public int size() {
        return store.size();
    }

    // ---------------------------------------------------------------
    // Scheduled cleanup
    // ---------------------------------------------------------------

    /**
     * Evicts documents that have exceeded their TTL.
     * Runs every 15 minutes to keep memory footprint controlled.
     */
    @Scheduled(fixedDelay = 15 * 60 * 1000L)
    public void evictExpired() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(ttlMinutes);
        int before = store.size();
        store.entrySet().removeIf(entry -> entry.getValue().getUploadedAt().isBefore(cutoff));
        int evicted = before - store.size();
        if (evicted > 0) {
            log.info("DocumentStore: evicted {} expired document(s), {} remaining", evicted, store.size());
        }
    }

    // ---------------------------------------------------------------
    // Inner record
    // ---------------------------------------------------------------

    /**
     * Immutable value object representing a stored document.
     */
    @Getter
    @RequiredArgsConstructor
    public static class StoredDocument {
        private final String documentId;
        private final String fileName;
        private final String extractedText;
        private final LocalDateTime uploadedAt;
    }
}
