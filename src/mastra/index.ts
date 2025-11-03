import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";
import { LibSQLStore } from "@mastra/libsql";
import { phishNetAgent } from "./agents/phishnet-agent";
import { a2aAgentRoute } from "./routes/a2a-route";
import { startDailyTips } from "./cron/daily-tips";

export const mastra = new Mastra({
  agents: { phishnet: phishNetAgent },
  server: { apiRoutes: [a2aAgentRoute] },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({ name: "PhishNet", level: "info" }),
  telemetry: { enabled: false },
  observability: { default: { enabled: true } },
});

// Start daily tips scheduler when running under mastra dev/start
startDailyTips();
