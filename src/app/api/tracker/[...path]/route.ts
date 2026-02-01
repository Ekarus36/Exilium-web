/**
 * API Proxy Route for InitTracker Backend
 *
 * Proxies requests from /api/tracker/* to the FastAPI backend.
 * Forwards auth tokens and handles CORS.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
  const contentType = request.headers.get("Content-Type") || "application/json";
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
      // For multipart/form-data (file uploads), forward the body as-is
      // Don't set Content-Type header - let fetch set it with the boundary
      if (contentType.includes("multipart/form-data")) {
        body = await request.arrayBuffer();
        headers["Content-Type"] = contentType; // Include boundary
      } else {
        const text = await request.text();
        if (text) {
          headers["Content-Type"] = contentType;
          body = text;
        }
      }
    } catch {
      // No body
    }
  } else {
    headers["Content-Type"] = contentType;
  }

  try {
    // Forward the request to the backend
    const response = await fetch(backendUrl.toString(), {
      method: request.method,
      headers,
      body,
    });

    // Get response data
    const contentType = response.headers.get("Content-Type") || "";
    let responseData: unknown;

    if (contentType.includes("application/json")) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    // Return the response
    return NextResponse.json(responseData, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: "Failed to connect to backend" },
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
