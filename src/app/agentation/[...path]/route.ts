import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

async function proxy(request: NextRequest, { params }: { params: { path: string[] } }) {
  const endpoint = process.env.AGENTATION_BROWSER_ENDPOINT;
  if (process.env.NEXT_PUBLIC_AGENTATION_PREVIEW !== "1" || !endpoint) {
    return new Response(null, { status: 404 });
  }

  const url = new URL(`${endpoint.replace(/\/$/, "")}/${params.path.join("/")}`);
  url.search = request.nextUrl.search;
  const headers = new Headers();
  for (const name of ["content-type", "accept"]) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  const response = await fetch(url, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });
  return new Response(response.body, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") || "application/json" },
  });
}

export { proxy as GET, proxy as POST, proxy as PATCH, proxy as DELETE, proxy as OPTIONS };
