/**
 * Shared API proxy factory for tool backends.
 *
 * Each tool's [...path]/route.ts calls createToolProxy() with its config,
 * then re-exports the returned HTTP method handlers.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export interface ProxyConfig {
  /** Backend base URL (read from env at call time) */
  backendUrl: string;
  /** Tool name used in error logs, e.g. "tracker" */
  name: string;
  /** Retry the request without auth if backend returns 401 */
  retryWithoutAuth?: boolean;
  /** Pass through SSE (text/event-stream) responses */
  supportSSE?: boolean;
  /** Preserve multipart/form-data content type */
  supportMultipart?: boolean;
}

type RouteHandler = (
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) => Promise<NextResponse | Response>;

/**
 * Creates a set of Next.js App Router handlers that proxy requests to a backend.
 *
 * Usage in a route file:
 * ```ts
 * export const runtime = "nodejs";
 * export const { GET, POST } = createToolProxy({ ... });
 * ```
 */
export function createToolProxy(config: ProxyConfig): Record<string, RouteHandler> {
  async function proxyRequest(
    request: NextRequest,
    params: { path: string[] }
  ): Promise<NextResponse | Response> {
    // Build the backend URL
    const pathSegments = params.path.join("/");
    const backendUrl = new URL(`/api/${pathSegments}`, config.backendUrl);

    // Forward query parameters
    request.nextUrl.searchParams.forEach((value, key) => {
      backendUrl.searchParams.append(key, value);
    });

    // Prepare headers with auth token
    const headers: Record<string, string> = {};

    try {
      const supabase = await createClient();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }
    } catch {
      // No auth session available
    }

    // Extract request body for non-GET/HEAD requests
    let body: BodyInit | undefined;
    if (request.method !== "GET" && request.method !== "HEAD") {
      try {
        const contentType = request.headers.get("Content-Type") || "";
        if (config.supportMultipart && contentType.includes("multipart/form-data")) {
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

      // Retry without auth if backend rejects the token
      if (config.retryWithoutAuth && response.status === 401 && headers["Authorization"]) {
        const { Authorization: _, ...headersWithoutAuth } = headers;
        response = await fetch(backendUrl.toString(), {
          method: request.method,
          headers: headersWithoutAuth,
          body,
        });
      }

      // SSE streaming passthrough
      const respContentType = response.headers.get("Content-Type") || "";
      if (config.supportSSE && respContentType.includes("text/event-stream")) {
        return new Response(response.body, {
          status: response.status,
          headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
          },
        });
      }

      // Empty responses
      if (response.status === 204 || response.headers.get("Content-Length") === "0") {
        return new NextResponse(null, { status: response.status });
      }

      // Read response body
      const responseText = await response.text();
      if (!responseText) {
        return new NextResponse(null, { status: response.status });
      }

      // JSON response
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

      // Other content types
      return new NextResponse(responseText, {
        status: response.status,
        headers: { "Content-Type": respContentType || "text/plain" },
      });
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error(`[${config.name}-proxy] FAILED ${request.method} ${backendUrl}:`, errMsg);
      return NextResponse.json(
        { error: `Failed to connect to ${config.name} backend`, detail: errMsg },
        { status: 502 }
      );
    }
  }

  // Wrap the proxy function into Next.js route handlers
  const handler: RouteHandler = async (request, { params }) =>
    proxyRequest(request, await params);

  return { GET: handler, POST: handler, PUT: handler, PATCH: handler, DELETE: handler };
}
