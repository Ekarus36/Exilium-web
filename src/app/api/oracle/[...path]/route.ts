/**
 * API Proxy Route for Exilium Oracle Backend
 *
 * Proxies requests from /api/oracle/* to the Oracle FastAPI backend.
 * Handles SSE streaming for /query endpoint.
 * Forwards auth tokens from Supabase session.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const ORACLE_API_URL = process.env.ORACLE_API_URL || "http://localhost:8100";

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] }
): Promise<NextResponse | Response> {
  const pathSegments = params.path.join("/");
  const backendUrl = new URL(`/api/${pathSegments}`, ORACLE_API_URL);

  // Forward query parameters
  request.nextUrl.searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  // Prepare headers
  const headers: HeadersInit = {};

  // Get auth token if user is logged in
  try {
    const supabase = await createClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
  } catch {
    // No auth session available
  }

  // Get request body for non-GET requests
  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      const text = await request.text();
      if (text) {
        headers["Content-Type"] = "application/json";
        body = text;
      }
    } catch {
      // No body
    }
  }

  try {
    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers,
      body,
    });

    // For SSE streaming endpoints (query), pipe the stream through directly
    const respContentType = response.headers.get("Content-Type") || "";
    if (respContentType.includes("text/event-stream")) {
      return new Response(response.body, {
        status: response.status,
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      });
    }

    // Handle empty responses
    if (
      response.status === 204 ||
      response.headers.get("Content-Length") === "0"
    ) {
      return new NextResponse(null, { status: response.status });
    }

    // Standard JSON/text response
    const responseText = await response.text();
    if (!responseText) {
      return new NextResponse(null, { status: response.status });
    }

    if (respContentType.includes("application/json")) {
      try {
        const responseData = JSON.parse(responseText);
        return NextResponse.json(responseData, { status: response.status });
      } catch {
        return new NextResponse(responseText, {
          status: response.status,
          headers: { "Content-Type": "text/plain" },
        });
      }
    }

    return new NextResponse(responseText, {
      status: response.status,
      headers: { "Content-Type": respContentType || "text/plain" },
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[oracle-proxy] FAILED ${request.method} ${backendUrl}:`, errMsg);
    return NextResponse.json(
      { error: "Failed to connect to Oracle backend", detail: errMsg },
      { status: 502 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}
