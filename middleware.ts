import { NextResponse, type NextRequest } from "next/server";

const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]"]);

function isLocalHost(hostHeader: string | null) {
  if (!hostHeader) return false;
  const host = hostHeader.startsWith("[")
    ? hostHeader.slice(0, hostHeader.indexOf("]") + 1)
    : (hostHeader.split(":")[0] ?? "");
  return localHosts.has(host);
}

export function middleware(request: NextRequest) {
  const publicAccessEnabled = process.env.AGENTOPS_ALLOW_PUBLIC_ACCESS === "true";

  if (
    process.env.NODE_ENV === "production" &&
    !publicAccessEnabled &&
    !isLocalHost(request.headers.get("host"))
  ) {
    return new NextResponse("AgentOps Playground is local-first. Set AGENTOPS_ALLOW_PUBLIC_ACCESS=true to expose it.", {
      status: 403,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
