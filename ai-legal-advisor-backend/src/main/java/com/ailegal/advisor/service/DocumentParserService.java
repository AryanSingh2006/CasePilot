package com.ailegal.advisor.service;

import com.ailegal.advisor.exception.InvalidRequestException;
import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.hwpf.HWPFDocument;
import org.apache.poi.hwpf.extractor.WordExtractor;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Set;
import java.util.regex.Pattern;

/**
 * Parses uploaded legal documents (PDF / DOCX / DOC) into clean plain text.
 *
 * <h3>Responsibilities:</h3>
 * <ul>
 *   <li>Validate MIME type and file extension — reject anything that isn't a known document</li>
 *   <li>Validate file size (configurable, default 10 MB)</li>
 *   <li>Route to the correct parsing library: PDFBox for PDF, Apache POI for Word</li>
 *   <li>Clean and normalise the raw extracted text</li>
 *   <li>Truncate to {@code document.upload.max-chars} if needed</li>
 * </ul>
 *
 * <h3>Security:</h3>
 * <ul>
 *   <li>Allowlist of MIME types and file extensions — rejects unknown types early</li>
 *   <li>Enforces byte-level size cap before any library parsing begins</li>
 *   <li>Files are read from the stream only — never written to disk</li>
 * </ul>
 */
@Slf4j
@Service
public class DocumentParserService {

    // ---------------------------------------------------------------
    // Constants / config
    // ---------------------------------------------------------------

    private static final long MAX_FILE_SIZE_BYTES = 10L * 1024 * 1024; // 10 MB hard cap

    /** Allowed MIME types — checked against what Spring/browsers report */
    private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
        "application/pdf",
        "application/msword",                                            // .doc
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" // .docx
    );

    /** Allowed file extensions as a secondary check (browsers can lie about MIME) */
    private static final Set<String> ALLOWED_EXTENSIONS = Set.of("pdf", "doc", "docx");

    /** Pattern for collapsing multiple consecutive whitespace / blank lines */
    private static final Pattern MULTI_SPACE  = Pattern.compile("[ \\t]{2,}");
    private static final Pattern MULTI_NEWLINE = Pattern.compile("\\n{3,}");
    private static final Pattern CONTROL_CHARS = Pattern.compile("[\\x00-\\x08\\x0B\\x0C\\x0E-\\x1F\\x7F]");

    @Value("${document.upload.max-chars:500000}")
    private int maxChars;

    // ---------------------------------------------------------------
    // Public API
    // ---------------------------------------------------------------

    /**
     * Entry-point: validates and parses an uploaded file.
     *
     * @param file The multipart upload from the HTTP request
     * @return Cleaned plain-text content of the document
     * @throws InvalidRequestException for validation failures (bad type, too large, parse error)
     */
    public String parse(MultipartFile file) {
        validateFile(file);

        String extension = getExtension(file.getOriginalFilename());
        log.info("DocumentParserService: parsing '{}' ({} bytes, type: {})",
                file.getOriginalFilename(), file.getSize(), extension);

        String rawText;
        try (InputStream inputStream = file.getInputStream()) {
            rawText = switch (extension) {
                case "pdf"  -> parsePdf(inputStream);
                case "docx" -> parseDocx(inputStream);
                case "doc"  -> parseDoc(inputStream);
                default     -> throw new InvalidRequestException("Unsupported file extension: " + extension);
            };
        } catch (IOException ex) {
            log.error("Failed to read uploaded file '{}': {}", file.getOriginalFilename(), ex.getMessage());
            throw new InvalidRequestException("Could not read document: " + ex.getMessage());
        }

        return cleanAndTruncate(rawText);
    }

    // ---------------------------------------------------------------
    // Parsers
    // ---------------------------------------------------------------

    /**
     * Extracts text from a PDF using Apache PDFBox.
     * PDFBox 3.x closes the document on try-with-resources.
     */
    private String parsePdf(InputStream is) throws IOException {
        try (PDDocument document = org.apache.pdfbox.Loader.loadPDF(is.readAllBytes())) {
            if (document.isEncrypted()) {
                throw new InvalidRequestException(
                    "The uploaded PDF is password-protected. Please remove the password before uploading.");
            }
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true); // Preserves reading order for multi-column layouts
            return stripper.getText(document);
        }
    }

    /**
     * Extracts text from a DOCX file using Apache POI XWPFWordExtractor.
     */
    private String parseDocx(InputStream is) throws IOException {
        try (XWPFDocument doc = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(doc)) {
            return extractor.getText();
        }
    }

    /**
     * Extracts text from a legacy .doc (Word 97-2003) file using Apache POI HWPF.
     */
    private String parseDoc(InputStream is) throws IOException {
        try (HWPFDocument doc = new HWPFDocument(is);
             WordExtractor extractor = new WordExtractor(doc)) {
            return extractor.getText();
        }
    }

    // ---------------------------------------------------------------
    // Validation
    // ---------------------------------------------------------------

    private void validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new InvalidRequestException("No file was uploaded or the file is empty.");
        }

        // Size check (byte level, before any parsing)
        if (file.getSize() > MAX_FILE_SIZE_BYTES) {
            throw new InvalidRequestException(
                String.format("File size %.1f MB exceeds the maximum allowed 10 MB.",
                    file.getSize() / (1024.0 * 1024.0)));
        }

        // Extension check
        String ext = getExtension(file.getOriginalFilename());
        if (!ALLOWED_EXTENSIONS.contains(ext)) {
            throw new InvalidRequestException(
                "Unsupported file type '" + ext + "'. Allowed formats: PDF, DOC, DOCX.");
        }

        // MIME type check (cross-reference with extension to resist spoofing)
        String contentType = file.getContentType();
        if (contentType != null && !ALLOWED_MIME_TYPES.contains(contentType.toLowerCase())) {
            log.warn("MIME mismatch: extension='{}' but contentType='{}'", ext, contentType);
            // Warn but don't hard-reject — browsers inconsistently report MIME types for .doc
            // The parser itself will fail safely if the bytes don't match the extension
        }
    }

    // ---------------------------------------------------------------
    // Text cleaning
    // ---------------------------------------------------------------

    /**
     * Removes control characters, collapses excessive whitespace,
     * and truncates to maxChars to keep context manageable.
     */
    private String cleanAndTruncate(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new InvalidRequestException("No readable text could be extracted from the document.");
        }

        String cleaned = CONTROL_CHARS.matcher(raw).replaceAll("");     // strip control chars
        cleaned = MULTI_SPACE.matcher(cleaned).replaceAll(" ");          // collapse spaces
        cleaned = MULTI_NEWLINE.matcher(cleaned).replaceAll("\n\n");     // collapse blank lines
        cleaned = cleaned.strip();

        if (cleaned.isEmpty()) {
            throw new InvalidRequestException("No readable text could be extracted from the document.");
        }

        if (cleaned.length() > maxChars) {
            log.warn("DocumentParserService: text truncated from {} to {} chars", cleaned.length(), maxChars);
            cleaned = cleaned.substring(0, maxChars);
        }

        log.info("DocumentParserService: extraction complete — {} chars", cleaned.length());
        return cleaned;
    }

    // ---------------------------------------------------------------
    // Helpers
    // ---------------------------------------------------------------

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "";
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase().trim();
    }
}
