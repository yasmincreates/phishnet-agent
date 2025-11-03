import { createTool } from "@mastra/core";
import { z } from "zod";
import { PhishResult } from "../utils/definitions";

const PHISHTANK_LOOKUP = "https://checkurl.phishtank.com/checkurl/";

export const phishCheckTool = createTool({
  id: "check-phishing",
  description:
    "Checks a URL for phishing using PhishTank lookup or a simple heuristic fallback.",
  inputSchema: z.object({
    url: z.string().url().describe("The fully-qualified URL to check"),
  }),
  outputSchema: z.object({
    url: z.string(),
    verdict: z.enum(["safe", "suspicious", "unknown"]),
    reason: z.string(),
  }),

  // context contains { url }
  execute: async ({ context }): Promise<PhishResult> => {
    const url: string = context.url;
    function heuristic(u: string): PhishResult {
      const suspiciousTokens = [
        "login",
        "secure",
        "update",
        "verify",
        "account",
        "bank",
        "signin",
      ];
      const lower = u.toLowerCase();
      if (suspiciousTokens.some((t) => lower.includes(t))) {
        return {
          url: u,
          verdict: "suspicious",
          reason: "URL contains suspicious token(s)",
        };
      }
      try {
        const host = new URL(u).hostname;
        if (host.split(".").length > 3) {
          return {
            url: u,
            verdict: "suspicious",
            reason: "Unusually long subdomain (possible trick domain)",
          };
        }
      } catch {
        // ignore
      }
      return {
        url: u,
        verdict: "safe",
        reason: "No obvious heuristic indicators found",
      };
    }

    try {
      // Attempt PhishTank lookup (free, no API key)
      try {
        const resp = await fetch(
          `${PHISHTANK_LOOKUP}?url=${encodeURIComponent(url)}`,
          {
            method: "GET",
          }
        );
        if (resp.ok) {
          const text = await resp.text();
          // PhishTank returns an XML/HTML-ish or text response — search for "phish_detail_url" indicator
          if (typeof text === "string" && text.includes("phish_detail_url")) {
            return {
              url,
              verdict: "suspicious",
              reason: "Listed in PhishTank database",
            };
          }
        }
      } catch {
        // If PhishTank request fails, fall through to heuristic
      }

      // Fallback to heuristic
      return heuristic(url);
    } catch (err: any) {
      return {
        url,
        verdict: "unknown",
        reason: `Error checking URL: ${err?.message || String(err)}`,
      };
    }
  },
});
