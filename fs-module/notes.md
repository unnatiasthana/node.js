# Node.js File System (`fs`) — Notes Page

**Companion script:** `10-node-fs-video-script.md`  
**Companion code:** `12-node-fs-code.js`  
**Alignment:** Section numbers match the script and numbered code examples.

---

## 1. Topic aur learning goals

**Topic:** Node.js File System module (`fs`)

Is lesson ke baad aap samajh paoge:

- `fs` module ka basic purpose.
- File paths ke liye `path.join()` ka use.
- `mkdir`, `writeFile`, `readFile`, `appendFile`, `readdir`, `rename`, aur `unlink`.
- Sync aur async file operations ka basic difference.
- Promise methods ke saath `async`/`await` aur `try`/`catch`.

## 2. `fs` kya hai?

`fs` (File System) Node.js ka built-in module hai. Yeh JavaScript program ko files aur directories ke saath interact karne deta hai.

Common tasks: file read/write/append, folder create/list, file rename/copy/delete.

## 3. Import aur paths

Promise API import:

```js
const fs = require("node:fs/promises");
const path = require("node:path");
```

File/folder path ko OS ke mutabiq join karne ke liye `path.join()` use karo:

```js
const dataDir = path.join(__dirname, "fs-demo-data");
```

`mkdir(path, { recursive: true })` directory create karta hai; zaroorat ho toh parent directories bhi.

Code Example 1.

## 4. `writeFile()` — file create ya replace

```js
await fs.writeFile(filePath, "Mera pehla note", "utf8");
```

Path par file nahi hai toh create hoti hai. Existing file par default write existing content replace kar sakta hai. Text ke liye encoding explicitly `utf8` dena beginner-friendly hai.

Code Example 2.

## 5. `readFile()` — content padhna

```js
const text = await fs.readFile(filePath, "utf8");
```

Encoding dene par text string milti hai. Encoding na dene par data Buffer ke roop mein mil sakta hai. `readFile()` poori file read karta hai; large data ke liye streams consider karein.

Code Example 3.

## 6. `appendFile()` — existing content ke end mein add

```js
await fs.appendFile(filePath, "\nMera agla note", "utf8");
```

Existing content ko preserve karke naya data add karta hai. File absent ho toh create kar sakta hai.

Code Example 4.

## 7. Sync vs async

| Style | Example | Behavior |
|---|---|---|
| Synchronous | `readFileSync()` | Complete hone tak current JavaScript thread ko block karta hai |
| Asynchronous Promise | `await readFile()` | Promise settle hone tak current async function wait karti hai; code readable rehta hai aur event loop doosra kaam kar sakta hai |

Async Promise example:

```js
const text = await fs.readFile(filePath, "utf8");
```

Sync example:

```js
const fsSync = require("node:fs");
const text = fsSync.readFileSync(filePath, "utf8");
```

Server/responsive app mein aam taur par async methods use karein. Sync methods small scripts mein convenient ho sakte hain.

Code Example 5.

## 8. `readdir()` — directory entries list karna

```js
const names = await fs.readdir(dataDir);
```

Folder ke andar entry names deta hai; file contents padhne ke liye `readFile()` chahiye.

Code Example 6.

## 9. `rename()` aur `unlink()`

```js
await fs.rename(oldPath, newPath); // file rename/move
await fs.unlink(filePath);         // file delete
```

`unlink()` file remove karta hai, directory nahi. Destructive methods use karte waqt path verify karein.

Code Example 7.

## 10. Errors handle karna

Promise-based file operation reject ho sakti hai, jaise missing file ya permission issue. `try/catch` use karein:

```js
try {
  const text = await fs.readFile(filePath, "utf8");
} catch (error) {
  console.error("File read nahi hui:", error.message);
}
```

Code Example 8.

## 11. Quick recap

- `mkdir()` folder create karta hai.
- `writeFile()` file create/replace karta hai.
- `readFile()` content read karta hai.
- `appendFile()` content ke end mein add karta hai.
- `readdir()` folder entries list karta hai.
- `rename()` file rename/move karta hai.
- `unlink()` file delete karta hai.
- Async methods ko `await` aur `try/catch` ke saath use kar sakte hain.
- Sync methods JavaScript execution ko block karte hain.

## Terminal command

```bash
node 12-node-fs-code.js
```

Code automatically `fs-demo-data` folder ke andar demo files create aur manage karega.
