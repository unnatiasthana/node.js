# Node.js HTTP Module — Notes Page

**Companion script:** `07-node-http-video-script.md`  
**Companion code:** `09-node-http-code.js`  
**Alignment:** Section numbers match the script and numbered code examples.

---

## 1. Topic aur learning goals

**Topic:** Node.js built-in HTTP module — Request aur Response

Is lesson ke baad aap samajh paoge:

- Client-server request-response cycle.
- `http.createServer()` ka basic use.
- Request method, URL, aur headers read karna.
- Status code, response headers, aur body bhejna.
- Basic routes aur 404 response banana.
- POST body stream se read karna.
- Invalid JSON, unsupported method, aur oversized body handle karna.

## 2. Request-response cycle

**Client** (jaise browser) HTTP request bhejta hai. Server request process karke HTTP response return karta hai.

Request mein aam taur par method, URL/path, headers, aur optional body hoti hai. Response mein status code, headers, aur body hoti hai.

Example: Browser `GET /about` bhejta hai; server `200` status aur page/body return karta hai.

## 3. Import aur basic server

Built-in module import:

```js
const http = require("node:http");
```

Server create/listen:

```js
const server = http.createServer((req, res) => {
  res.end("Hello from Node.js!");
});

server.listen(3000);
```

`createServer()` callback ko `req` (incoming `http.IncomingMessage`) aur `res` (outgoing `http.ServerResponse`) deta hai. `listen()` server ko port par connections accept karne deta hai.

Code example: 1.

## 4. Request properties

- `req.method`: HTTP method, jaise `GET` ya `POST`.
- `req.url`: request URL path aur query string.
- `req.headers`: incoming headers; Node.js mein header keys lowercase names ke saath milte hain.

Node.js built-in HTTP API low-level hai; routing aur parsing ke liye application code likhna hota hai.

Code example: 2.

## 5. Response properties/methods

- `res.statusCode` ya `res.writeHead(status, headers)`: status code set karna.
- `res.setHeader(name, value)`: response header set karna.
- `res.write(chunk)`: response body ka part bhejna.
- `res.end([data])`: optional final data bhej kar response finish karna.

`Content-Type` client ko body format samajhne mein madad karta hai. Plain text ke liye `text/plain; charset=utf-8`; JSON ke liye `application/json` use karein.

Code example: 3.

## 6. Basic routing aur 404

Incoming method aur parsed pathname dekh kar response choose kar sakte hain. Example routes:

| Method | Path | Response |
|---|---|---|
| GET | `/` | Home text |
| GET | `/about` | About text |
| Any other path | — | 404 Not Found |

URL parse karne ka pattern:

```js
const url = new URL(req.url, "http://localhost");
const pathname = url.pathname;
```

Code example: 4.

## 7. POST body ko read karna

`req` readable stream hai. Body `data` chunks mein milti hai, aur `end` event body ke complete hone par chalta hai. Body size par limit rakhna achchhi practice hai.

Example 5 mein `/api/echo` sirf POST accept karta hai, JSON body read aur parse karta hai, aur JSON response deta hai.

## 8. Error status codes

- `400 Bad Request`: invalid/malformed JSON.
- `404 Not Found`: path route maujood nahi.
- `405 Method Not Allowed`: path pehchana gaya, lekin method supported nahi.
- `413 Payload Too Large`: configured body size se zyada.

Actual APIs mein response body aur error format consistent rakhein.

## 9. Headers inspect karna

Request header example: `req.headers["user-agent"]`. Response header example: `Content-Type`.

Browser DevTools Network panel ya `curl -i` se response status aur headers inspect kar sakte hain.

## 10. Built-in HTTP vs framework

`node:http` low-level building block hai. Routing, middleware, parsing aur validation jaise helpers frameworks (jaise Express) de sakte hain. Framework use karne par bhi HTTP request-response concepts wahi rehte hain.

## 11. Quick recap

- `http.createServer()` request callback ke saath server banata hai.
- `req` incoming request; `res` outgoing response.
- `req.method`, `req.url`, `req.headers` se request details milti hain.
- Status + headers set karke `res.end()` se response complete karte hain.
- POST body stream ke `data` aur `end` events se read hoti hai.
- Route ke hisaab se 404, 405, 400, aur 413 jaise statuses return kar sakte hain.

## Terminal commands for the video

Start server:

```bash
node 09-node-http-code.js
```

Try in browser: `http://localhost:3000/`, `http://localhost:3000/about`, `http://localhost:3000/missing`.

Try POST from another terminal:

```bash
curl -i -X POST http://localhost:3000/api/echo \
  -H 'Content-Type: application/json' \
  -d '{"name":"Asha","topic":"Node.js HTTP"}'
```

Try error cases:

```bash
curl -i -X POST http://localhost:3000/api/echo -H 'Content-Type: application/json' -d '{bad json}'
curl -i http://localhost:3000/api/echo
```

To stop the server, focus the server terminal and press `Ctrl+C`.

