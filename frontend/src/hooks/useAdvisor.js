import { useState, useCallback } from "react";
import { fetchLegalAdvice } from "../services/legalApi";

function collectStringCandidates(value, candidates) {
  if (typeof value === "string") {
    const v = value.trim();
    if (v) candidates.push(v);
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectStringCandidates(item, candidates));
    return;
  }

  if (!value || typeof value !== "object") return;

  // Prefer known response-like keys first.
  [
    "answer",
    "response",
    "advice",
    "content",
    "message",
    "text",
    "output",
    "result",
    "data",
    "completion",
  ].forEach((key) => {
    if (key in value) collectStringCandidates(value[key], candidates);
  });
}

function extractAdvisorText(data) {
  const candidates = [];
  collectStringCandidates(data, candidates);

  if (!candidates.length) return "";

  // Choose the longest non-empty candidate to avoid accidentally using a short summary field.
  return candidates.reduce((longest, current) =>
    current.length > longest.length ? current : longest, ""
  );
}

export function useAdvisor() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendQuery = useCallback(async (query) => {
    if (!query.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: query.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      const data = await fetchLegalAdvice(query.trim());
      const advisorText = extractAdvisorText(data);

      if (!advisorText) {
        throw new Error("The server returned an empty response.");
      }

      const advisorMessage = {
        id: Date.now() + 1,
        role: "advisor",
        text: advisorText,
        disclaimer: data.disclaimer,
        demoMode: data.demoMode,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, advisorMessage]);
    } catch (err) {
      setError(err.message || "Failed to get a response. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, loading, error, sendQuery, clearHistory };
}