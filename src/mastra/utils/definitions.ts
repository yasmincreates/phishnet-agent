export interface PhishResult {
  url: string;
  verdict: "safe" | "suspicious" | "unknown";
  reason: string;
}
