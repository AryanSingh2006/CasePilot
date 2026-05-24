import { useState, useRef, useCallback } from "react";
import { uploadDocument, removeDocument } from "../services/documentApi";

/**
 * DocumentUploadPanel
 *
 * A self-contained drag-and-drop document upload component designed for the
 * CasePilot gold-on-navy design system.
 *
 * Props:
 *   onDocumentReady(doc)  – Called when upload succeeds with { documentId, fileName, textPreview, charCount }
 *   onDocumentRemoved()   – Called when the user explicitly removes the uploaded document
 */
export function DocumentUploadPanel({ onDocumentReady, onDocumentRemoved }) {
  const [dragging, setDragging] = useState(false);
  const [uploadState, setUploadState] = useState("idle"); // idle | uploading | success | error
  const [progress, setProgress] = useState(0);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [previewExpanded, setPreviewExpanded] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const inputRef = useRef(null);

  // ── File picking ────────────────────────────────────────────────────────────

  const handleFileSelected = useCallback(async (file) => {
    if (!file) return;

    // Client-side validation before hitting the network
    const ext = file.name.split(".").pop().toLowerCase();
    if (!["pdf", "doc", "docx"].includes(ext)) {
      setErrorMsg(`Unsupported file type (.${ext}). Please upload PDF, DOC, or DOCX.`);
      setUploadState("error");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(`File is ${(file.size / (1024 * 1024)).toFixed(1)} MB — maximum is 10 MB.`);
      setUploadState("error");
      return;
    }

    setUploadState("uploading");
    setProgress(0);
    setErrorMsg("");

    try {
      const doc = await uploadDocument(file, setProgress);
      setUploadedDoc(doc);
      setUploadState("success");
      onDocumentReady?.(doc);
    } catch (err) {
      setErrorMsg(err.message || "Upload failed. Please try again.");
      setUploadState("error");
    }
  }, [onDocumentReady]);

  // ── Drag and drop handlers ───────────────────────────────────────────────────

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);
  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelected(file);
  };

  // ── Remove uploaded document ────────────────────────────────────────────────

  const handleRemove = async () => {
    if (uploadedDoc?.documentId) {
      try { await removeDocument(uploadedDoc.documentId); } catch { /* already gone */ }
    }
    setUploadedDoc(null);
    setUploadState("idle");
    setProgress(0);
    setErrorMsg("");
    setPreviewExpanded(false);
    onDocumentRemoved?.();
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div style={{ marginBottom: 12 }}>

      {/* ── Success state ── */}
      {uploadState === "success" && uploadedDoc && (
        <div style={{
          background: "rgba(201,168,76,0.06)",
          border: "1px solid rgba(201,168,76,0.25)",
          borderRadius: 10,
          padding: "10px 14px",
          animation: "msgIn 0.3s ease",
        }}>
          {/* File name row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span style={{ fontSize: "1rem" }}>{fileIcon(uploadedDoc.fileName)}</span>
              <span style={{
                fontSize: "0.82rem", color: "#c9a84c", fontWeight: 500,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {uploadedDoc.fileName}
              </span>
              <span style={{ fontSize: "0.74rem", color: "#4a4d5c", flexShrink: 0 }}>
                {formatChars(uploadedDoc.charCount)}
              </span>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              {uploadedDoc.textPreview && (
                <button
                  onClick={() => setPreviewExpanded(p => !p)}
                  title={previewExpanded ? "Hide preview" : "Show text preview"}
                  style={iconBtn}
                >
                  {previewExpanded ? "▲" : "▼"}
                </button>
              )}
              <button onClick={handleRemove} title="Remove document" style={{ ...iconBtn, color: "#7a7d8c" }}>
                ✕
              </button>
            </div>
          </div>

          {/* Text preview (collapsible) */}
          {previewExpanded && uploadedDoc.textPreview && (
            <div style={{
              marginTop: 10,
              padding: "10px 12px",
              background: "rgba(0,0,0,0.2)",
              borderRadius: 7,
              border: "1px solid rgba(201,168,76,0.1)",
              fontSize: "0.75rem",
              color: "#7a7d8c",
              lineHeight: 1.6,
              maxHeight: 130,
              overflowY: "auto",
              whiteSpace: "pre-wrap",
              fontFamily: "monospace",
            }}>
              {uploadedDoc.textPreview}
            </div>
          )}
        </div>
      )}

      {/* ── Upload zone (idle or error) ── */}
      {(uploadState === "idle" || uploadState === "error") && (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `1.5px dashed ${dragging ? "rgba(201,168,76,0.6)" : "rgba(201,168,76,0.22)"}`,
            borderRadius: 10,
            padding: "14px 18px",
            display: "flex", alignItems: "center", gap: 12,
            cursor: "pointer",
            background: dragging ? "rgba(201,168,76,0.04)" : "transparent",
            transition: "all 0.2s ease",
          }}
        >
          {/* Upload icon */}
          <div style={{
            width: 34, height: 34, borderRadius: 8, flexShrink: 0,
            background: "rgba(201,168,76,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="rgba(201,168,76,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>

          <div style={{ flex: 1 }}>
            {uploadState === "error" ? (
              <p style={{ fontSize: "0.8rem", color: "#e07070", margin: 0 }}>⚠ {errorMsg}</p>
            ) : (
              <p style={{ fontSize: "0.8rem", color: "#7a7d8c", margin: 0 }}>
                <span style={{ color: "#c9a84c" }}>Click to upload</span> or drag & drop a legal document
                <span style={{ display: "block", fontSize: "0.72rem", marginTop: 2 }}>
                  PDF, DOC, DOCX — max 10 MB
                </span>
              </p>
            )}
          </div>

          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: "none" }}
            onChange={(e) => handleFileSelected(e.target.files?.[0])}
          />
        </div>
      )}

      {/* ── Uploading / progress ── */}
      {uploadState === "uploading" && (
        <div style={{
          border: "1px solid rgba(201,168,76,0.18)",
          borderRadius: 10, padding: "12px 16px",
          display: "flex", alignItems: "center", gap: 12,
        }}>
          {/* Spinner */}
          <div style={{
            width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
            border: "2px solid rgba(201,168,76,0.2)",
            borderTopColor: "#c9a84c",
            animation: "spin 0.8s linear infinite",
          }} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "0.8rem", color: "#9a9dac", margin: "0 0 6px" }}>
              Uploading and extracting text…
            </p>
            {/* Progress bar */}
            <div style={{ height: 3, background: "rgba(201,168,76,0.12)", borderRadius: 2 }}>
              <div style={{
                height: "100%", borderRadius: 2,
                background: "linear-gradient(90deg,#c9a84c,#e8c96f)",
                width: `${progress}%`, transition: "width 0.3s ease",
              }} />
            </div>
          </div>
          <span style={{ fontSize: "0.75rem", color: "#c9a84c", flexShrink: 0 }}>{progress}%</span>
        </div>
      )}
    </div>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fileIcon(fileName) {
  const ext = (fileName || "").split(".").pop().toLowerCase();
  if (ext === "pdf") return "📄";
  if (ext === "doc" || ext === "docx") return "📝";
  return "📎";
}

function formatChars(n) {
  if (!n) return "";
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k chars`;
  return `${n} chars`;
}

const iconBtn = {
  background: "none", border: "none",
  cursor: "pointer", color: "#c9a84c",
  fontSize: "0.78rem", padding: "2px 6px",
  borderRadius: 4, transition: "background 0.15s",
};
