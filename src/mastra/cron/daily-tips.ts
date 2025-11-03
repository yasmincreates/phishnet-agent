// Lightweight scheduler without external cron dependency.
// Use the global fetch available in Node 18+; if you need to support older Node versions,
// install node-fetch (for example: npm install node-fetch@2 @types/node-fetch) and restore the import.
const fetch = (globalThis as any).fetch as any;
if (!fetch) {
  throw new Error(
    "Global fetch is not available. Please upgrade to Node 18+ or install 'node-fetch' and restore the import."
  );
}

const TIPS = [
  "Never click links from unknown senders — verify first.",
  "Use multi-factor authentication on important accounts.",
  "Hover over links to inspect the real destination before clicking.",
  "Keep software and extensions updated to patch known issues.",
  "Use a password manager to avoid reusing passwords.",
];

// Parse simple cron expressions like "0 9 * * *" (minute hour ...).
function parseMinuteHour(cronExpr: string) {
  const parts = cronExpr.trim().split(/\s+/);
  const minutePart = parts[0];
  const hourPart = parts[1];
  const minute = Number.isFinite(Number(minutePart)) ? parseInt(minutePart, 10) : NaN;
  const hour = Number.isFinite(Number(hourPart)) ? parseInt(hourPart, 10) : NaN;
  return {
    minute: Number.isNaN(minute) ? 0 : minute,
    hour: Number.isNaN(hour) ? 9 : hour,
  };
}

async function sendTip(webhook: string) {
  const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
  try {
    await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: `PhishNet tip: ${tip}` }),
    });
    console.log("Daily tip sent.");
  } catch (err: any) {
    console.error("Failed to send daily tip:", err?.message || err);
  }
}

export function startDailyTips() {
  const cronExpr = process.env.DAILY_CRON || "0 9 * * *";
  const webhook = process.env.TELEX_WEBHOOK;

  if (!webhook) {
    // If no webhook set, we still keep the scheduler so tips can be logged or extended later.
    console.info(
      "TELEX_WEBHOOK not set: daily tips will not be posted automatically."
    );
    return;
  }

  const { minute, hour } = parseMinuteHour(cronExpr);

  // Schedule next occurrence based on hour/minute and then reschedule after each run.
  function scheduleNext() {
    const now = new Date();
    const next = new Date(now);
    next.setHours(hour, minute, 0, 0);
    if (next <= now) {
      next.setDate(next.getDate() + 1);
    }
    const delay = next.getTime() - now.getTime();
    setTimeout(async () => {
     // await sendTip(webhook);
      // Recompute next schedule to handle DST changes
      scheduleNext();
    }, delay);
  }

  scheduleNext();

  console.log(
    `Daily tips scheduled at ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")} (cron '${cronExpr}')`
  );
}
