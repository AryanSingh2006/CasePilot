import api from "./api";

/**
 * Document Upload API service.
 *
 * All requests carry the JWT automatically via the axios interceptor in api.js.
 */

/**
 * Uploads a file to the backend for parsing.
 *
 * The request is sent as multipart/form-data so the browser streams the file
 * bytes directly — we do NOT base64-encode the file.
 *
 * @param {File} file     - The File object from an <input type="file"> or drop event
 * @param {Function} [onProgress] - Optional upload progress callback (0–100)
 * @returns {Promise<{ documentId, fileName, textPreview, charCount, uploadedAt }>}
 */
export const uploadDocument = (file, onProgress) => {
  const formData = new FormData();
  formData.append("file", file);

  return api
    .post("/api/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: onProgress
        ? (evt) => {
            if (evt.total) {
              onProgress(Math.round((evt.loaded * 100) / evt.total));
            }
          }
        : undefined,
    })
    .then((r) => r.data);
};

/**
 * Asks the backend to remove a document from the in-memory store.
 *
 * @param {string} documentId - UUID returned by uploadDocument
 * @returns {Promise<void>}
 */
export const removeDocument = (documentId) =>
  api.delete(`/api/documents/${documentId}`).then((r) => r.data);

/**
 * Fetches a short text preview (first ~500 chars) for a stored document.
 *
 * @param {string} documentId - UUID returned by uploadDocument
 * @returns {Promise<{ documentId, fileName, preview }>}
 */
export const getDocumentPreview = (documentId) =>
  api.get(`/api/documents/${documentId}/preview`).then((r) => r.data);
