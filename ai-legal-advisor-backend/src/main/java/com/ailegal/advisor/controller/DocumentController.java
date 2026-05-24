package com.ailegal.advisor.controller;

import com.ailegal.advisor.dto.DocumentUploadResponseDTO;
import com.ailegal.advisor.service.DocumentContextService;
import com.ailegal.advisor.service.DocumentParserService;
import com.ailegal.advisor.service.DocumentStore;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * REST Controller for document upload and management.
 *
 * <p>All endpoints require a valid JWT (enforced by the Security filter chain).
 * The controller is intentionally thin — all business logic lives in the service layer.
 *
 * <h3>Endpoint map:</h3>
 * <pre>
 * POST   /api/documents/upload              → Parse file, store text, return documentId + preview
 * DELETE /api/documents/{documentId}         → Remove document from in-memory store
 * GET    /api/documents/{documentId}/preview → Return first 500 chars of extracted text
 * </pre>
 */
@Slf4j
@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {

    private final DocumentParserService documentParserService;
    private final DocumentContextService documentContextService;
    private final DocumentStore documentStore;

    // ---------------------------------------------------------------
    // POST /api/documents/upload
    // ---------------------------------------------------------------

    /**
     * Accepts a multipart file upload, extracts and cleans the text,
     * stores it in memory, and returns a {@code documentId} UUID that the
     * client should include in subsequent {@code /api/chat/ask} requests.
     *
     * @param userDetails Injected by Spring Security from the JWT
     * @param file        Multipart upload (PDF, DOC, or DOCX; max 10 MB)
     * @return 200 OK with {@link DocumentUploadResponseDTO}
     */
    @PostMapping("/upload")
    public ResponseEntity<DocumentUploadResponseDTO> upload(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("file") MultipartFile file) {

        log.info("POST /api/documents/upload — user: {}, file: '{}' ({} bytes)",
                userDetails.getUsername(),
                file.getOriginalFilename(),
                file.getSize());

        // 1. Parse + extract text
        String extractedText = documentParserService.parse(file);

        // 2. Store (returns UUID)
        String documentId = documentStore.save(file.getOriginalFilename(), extractedText);

        // 3. Build short preview for the client
        String preview = documentContextService.buildPreview(extractedText);

        log.info("Document '{}' stored as {} ({} chars)", file.getOriginalFilename(), documentId, extractedText.length());

        return ResponseEntity.ok(DocumentUploadResponseDTO.builder()
                .documentId(documentId)
                .fileName(file.getOriginalFilename())
                .textPreview(preview)
                .charCount(extractedText.length())
                .uploadedAt(LocalDateTime.now())
                .build());
    }

    // ---------------------------------------------------------------
    // DELETE /api/documents/{documentId}
    // ---------------------------------------------------------------

    /**
     * Removes a previously uploaded document from the in-memory store.
     * Called when the user clicks "Remove" in the UI.
     *
     * @param documentId UUID of the document to remove
     * @return 204 No Content on success, 404 if not found
     */
    @DeleteMapping("/{documentId}")
    public ResponseEntity<Void> remove(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String documentId) {

        log.info("DELETE /api/documents/{} — user: {}", documentId, userDetails.getUsername());

        boolean removed = documentStore.remove(documentId);
        return removed
               ? ResponseEntity.noContent().build()
               : ResponseEntity.notFound().build();
    }

    // ---------------------------------------------------------------
    // GET /api/documents/{documentId}/preview
    // ---------------------------------------------------------------

    /**
     * Returns the first 500 characters of extracted text for a stored document.
     * Useful for the client to display a text preview without returning the full text.
     *
     * @param documentId UUID of the stored document
     * @return 200 OK with {@code { preview: "..." }}, or 404 if not found
     */
    @GetMapping("/{documentId}/preview")
    public ResponseEntity<Map<String, String>> preview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String documentId) {

        return documentStore.find(documentId)
                .map(doc -> {
                    String preview = documentContextService.buildPreview(doc.getExtractedText());
                    return ResponseEntity.ok(Map.of(
                        "documentId", documentId,
                        "fileName", doc.getFileName(),
                        "preview", preview
                    ));
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
