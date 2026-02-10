/**
 * API Proxy Route for Exilium Oracle Backend
 *
 * Proxies requests from /api/oracle/* to the Oracle FastAPI backend.
 * Handles SSE streaming for /query endpoint.
 */

import { createToolProxy } from "@/lib/proxy";

export const runtime = "nodejs";

const ORACLE_API_URL = process.env.ORACLE_API_URL || "http://localhost:8100";

export const { GET, POST } = createToolProxy({
  backendUrl: ORACLE_API_URL,
  name: "oracle",
  supportSSE: true,
});
