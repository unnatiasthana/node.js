"use strict";

/*
  Node.js HTTP Module — Request / Response demo
  Companion video: 07-node-http-video-script.md
  Companion notes: 08-node-http-notes.md

  Start:
    node 09-node-http-code.js

  Try in a browser:
    http://localhost:3000/
    http://localhost:3000/about
    http://localhost:3000/inspect?topic=http
    http://localhost:3000/api/hello
    http://localhost:3000/not-a-route

  Try in a second terminal:
    curl -i -X POST http://localhost:3000/api/echo \
      -H 'Content-Type: application/json' \
      -d '{"name":"Asha","topic":"Node.js HTTP"}'

    curl -i -X POST http://localhost:3000/api/echo \
      -H 'Content-Type: application/json' \
      -d '{bad json}'

    curl -i http://localhost:3000/api/echo
*/

const http = require("node:http");

const HOST = "127.0.0.1";
const PORT = 3000;
const MAX_BODY_BYTES = 64 * 1024; // 64 KiB demo limit

// ------------------------------------------------------------
// Script Section 3, Example 1: createServer receives req and res.
// ------------------------------------------------------------

// ------------------------------------------------------------
// Script Section 5, Example 3: response helpers set status,
// headers, and body in one place.
// ------------------------------------------------------------

// Send a plain-text response with an explicit status and content type.
function sendText(res, statusCode, message) {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8"
  });
  res.end(message);
}

// Send a JSON response. Keep status codes explicit at each call site.
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(data));
}

// ------------------------------------------------------------
// Script Sections 7–8, Example 5: read and validate JSON body.
// ------------------------------------------------------------

// Read request body chunks and parse them as JSON.
// We keep collecting at most MAX_BODY_BYTES; if the limit is exceeded,
// we stop storing chunks but continue consuming the request until it ends.
function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let byteCount = 0;
    let tooLarge = false;

    req.on("data", (chunk) => {
      byteCount += chunk.length;

      if (byteCount > MAX_BODY_BYTES) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }

      if (!tooLarge) {
        chunks.push(chunk);
      }
    });

    req.on("end", () => {
      if (tooLarge) {
        resolve({
          ok: false,
          statusCode: 413,
          message: "Request body is too large."
        });
        return;
      }

      const rawBody = Buffer.concat(chunks).toString("utf8");

      try {
        const value = JSON.parse(rawBody);
        resolve({ ok: true, value });
      } catch {
        resolve({
          ok: false,
          statusCode: 400,
          message: "Request body must contain valid JSON."
        });
      }
    });

    req.on("error", reject);
  });
}

// Route handler: GET /
function handleHome(req, res) {
  sendText(res, 200, "Hello from the Node.js HTTP server!");
}

// Route handler: GET /about
function handleAbout(req, res) {
  sendText(res, 200, "This is the about route.");
}

// Route handler: GET /inspect
// Shows request method, URL, query parameters, and one request header.
function handleInspect(req, res, requestUrl) {
  sendJson(res, 200, {
    method: req.method,
    url: req.url,
    pathname: requestUrl.pathname,
    query: Object.fromEntries(requestUrl.searchParams),
    userAgent: req.headers["user-agent"] || null
  });
}

// Route handler: POST /api/echo
async function handleEcho(req, res) {
  const contentType = req.headers["content-type"] || "";

  if (!contentType.toLowerCase().startsWith("application/json")) {
    sendJson(res, 415, {
      error: "Unsupported Media Type",
      hint: "Send Content-Type: application/json."
    });
    return;
  }

  try {
    const result = await readJsonBody(req);

    if (!result.ok) {
      sendJson(res, result.statusCode, { error: result.message });
      return;
    }

    sendJson(res, 200, {
      message: "JSON body received.",
      received: result.value
    });
  } catch (error) {
    console.error("Could not read request body:", error.message);

    if (!res.writableEnded) {
      sendJson(res, 400, { error: "Could not read request body." });
    }
  }
}

const server = http.createServer((req, res) => {
  // Script Section 4, Example 2: inspect method, URL, and headers.
  // Log request details so we can see each request arrive.
  console.log(new Date().toISOString(), req.method, req.url);

  // req.url is a path and may include a query string.
  // Use URL to separate pathname from query parameters.
  let requestUrl;
  try {
    requestUrl = new URL(req.url || "/", "http://localhost");
  } catch {
    sendText(res, 400, "Bad Request");
    return;
  }

  const pathname = requestUrl.pathname;
  const method = req.method;

  // Script Section 6, Example 4: basic method + path routing.
  // ------------------------------------------------------------
  // Routes: match both the HTTP method and URL path.
  // ------------------------------------------------------------

  if (method === "GET" && pathname === "/") {
    handleHome(req, res);
    return;
  }

  if (method === "GET" && pathname === "/about") {
    handleAbout(req, res);
    return;
  }

  if (method === "GET" && pathname === "/inspect") {
    handleInspect(req, res, requestUrl);
    return;
  }

  if (pathname === "/api/hello") {
    if (method !== "GET") {
      res.setHeader("Allow", "GET");
      sendJson(res, 405, { error: "Method Not Allowed. Use GET." });
      return;
    }

    sendJson(res, 200, { message: "Hello from the API!" });
    return;
  }

  if (pathname === "/api/echo") {
    if (method !== "POST") {
      res.setHeader("Allow", "POST");
      sendJson(res, 405, { error: "Method Not Allowed. Use POST." });
      return;
    }

    // Handle the async route and make sure unexpected failures are caught.
    handleEcho(req, res).catch((error) => {
      console.error("Unexpected route error:", error);

      if (!res.writableEnded) {
        sendJson(res, 500, { error: "Internal Server Error" });
      }
    });
    return;
  }

  // No route matched.
  sendJson(res, 404, {
    error: "Not Found",
    path: pathname
  });
});

server.on("error", (error) => {
  console.error("Server error:", error.message);
  process.exitCode = 1;
});

server.listen(PORT, HOST, () => {
  console.log("Server is running at http://" + HOST + ":" + PORT);
  console.log("Try /, /about, /inspect?topic=http, /api/hello, or POST /api/echo.");
});

