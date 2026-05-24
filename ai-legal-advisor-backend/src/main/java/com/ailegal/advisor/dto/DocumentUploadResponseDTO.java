package com.ailegal.advisor.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Response body returned by POST /api/documents/upload.
 *
 * The client should persist {@code documentId} locally and include it
 * in subsequent {@link ChatRequestDTO} payloads to ground the AI answer
 * in the uploaded document's content.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DocumentUploadResponseDTO {

    /** UUID that uniquely identifies the stored document in this session */
    private String documentId;

    /** Original file name supplied by the client */
    private String fileName;

    /** First 500 characters of extracted text — for client-side preview */
    private String textPreview;

    /** Total character count of the extracted and cleaned text */
    private int charCount;

    /** Server-side timestamp of when the document was processed */
    private LocalDateTime uploadedAt;
}
