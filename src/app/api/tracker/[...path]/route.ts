/**
 * API Proxy Route for InitTracker Backend
 *
 * Proxies requests from /api/tracker/* to the FastAPI backend.
 * Forwards auth tokens and handles CORS.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Force Node.js runtime — Edge runtime has issues with cookies() on POST/DELETE
export const runtime = "nodejs";

const TRACKER_API_URL = process.env.TRACKER_API_URL || "http://localhost:8000";

async function proxyRequest(
  request: NextRequest,
  params: { path: string[] }
): Promise<NextResponse> {
  // Build the backend URL
  const pathSegments = params.path.join("/");
  const backendUrl = new URL(`/api/${pathSegments}`, TRACKER_API_URL);

  // Forward query parameters
  const searchParams = request.nextUrl.searchParams;
  searchParams.forEach((value, key) => {
    backendUrl.searchParams.append(key, value);
  });

  // Prepare headers
  const headers: HeadersInit = {};

  // Get auth token if user is logged in
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers["Authorization"] = `Bearer ${session.access_token}`;
    }
  } catch {
    // No auth session available - continue without auth header
  }

  // Get request body for non-GET requests
  let body: BodyInit | undefined;
  if (request.method !== "GET" && request.method !== "HEAD") {
    try {
      const contentType = request.headers.get("Content-Type") || "";
      if (contentType.includes("multipart/form-data")) {
        body = await request.arrayBuffer();
        headers["Content-Type"] = contentType;
      } else {
        const text = await request.text();
        if (text) {
          headers["Content-Type"] = contentType || "application/json";
          body = text;
        }
      }
    } catch {
      // No body
    }
  }

  try {
    let response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers,
      body,
    });

    // If backend rejects the auth token, retry without it
    if (response.status === 401 && headers["Authorization"]) {
      const { Authorization: _, ...headersWithoutAuth } = headers as Record<string, string>;
      response = await fetch(backendUrl.toString(), {
        method: request.method,
        headers: headersWithoutAuth,
        body,
      });
    }

    // Handle empty responses (204 No Content, etc.)
    if (response.status === 204 || response.headers.get("Content-Length") === "0") {
      return new NextResponse(null, { status: response.status });
    }

    // Read response body as text first to avoid JSON parse errors on empty bodies
    const responseText = await response.text();

    if (!responseText) {
      return new NextResponse(null, { status: response.status });
    }

    // Try to parse as JSON, fall back to text
    const respContentType = response.headers.get("Content-Type") || "";
    if (respContentType.includes("application/json")) {
      try {
        const responseData = JSON.parse(responseText);
        return NextResponse.json(responseData, { status: response.status });
      } catch {
        // JSON parse failed — return as text
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
    console.error(`[proxy] FAILED ${request.method} ${backendUrl}:`, errMsg);
    return NextResponse.json(
      { error: "Failed to connect to backend", detail: errMsg },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  return proxyRequest(request, await params);
}
