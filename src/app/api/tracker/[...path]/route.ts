/**
 * API Proxy Route for InitTracker Backend
 *
 * Proxies requests from /api/tracker/* to the FastAPI backend.
 * Forwards auth tokens and handles CORS.
 */

import { createToolProxy } from "@/lib/proxy";

export const runtime = "nodejs";

const TRACKER_API_URL = process.env.TRACKER_API_URL || "http://localhost:8000";

export const { GET, POST, PUT, PATCH, DELETE } = createToolProxy({
  backendUrl: TRACKER_API_URL,
  name: "tracker",
  retryWithoutAuth: true,
  supportMultipart: true,
});
