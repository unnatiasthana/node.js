"use strict";

/*
  Node.js File System (fs) — examples matching the video script and notes.

  Run:
    node 12-node-fs-code.js

  All demo files are created inside ./fs-demo-data beside this script.
*/

const fs = require("node:fs/promises");
const fsSync = require("node:fs");
const path = require("node:path");

const dataDir = path.join(__dirname, "fs-demo-data");
const notePath = path.join(dataDir, "notes.txt");
const renamedNotePath = path.join(dataDir, "my-notes.txt");
const temporaryPath = path.join(dataDir, "temporary.txt");

async function main() {
  // ----------------------------------------------------------
  // Section 3, Example 1: Create a demo folder
  // ----------------------------------------------------------
  await fs.mkdir(dataDir, { recursive: true });
  console.log("Example 1: Demo folder ready:", dataDir);

  // ----------------------------------------------------------
  // Section 4, Example 2: Write a new note file
  // ----------------------------------------------------------
  await fs.writeFile(notePath, "My first note: I am learning Node.js.\n", "utf8");
  console.log("\nExample 2: Created notes.txt with the first note.");

  // ----------------------------------------------------------
  // Section 5, Example 3: Read and display the note file
  // ----------------------------------------------------------
  const firstRead = await fs.readFile(notePath, "utf8");
  console.log("\nExample 3: Content read from notes.txt:");
  console.log(firstRead.trimEnd());

  // ----------------------------------------------------------
  // Section 6, Example 4: Append another note
  // ----------------------------------------------------------
  await fs.appendFile(notePath, "My second note: fs can append text too.\n", "utf8");
  console.log("\nExample 4: Appended a second note.");
  console.log((await fs.readFile(notePath, "utf8")).trimEnd());

  // ----------------------------------------------------------
  // Section 7, Example 5: Sync and async reads
  // ----------------------------------------------------------
  const syncText = fsSync.readFileSync(notePath, "utf8");
  console.log("\nExample 5A: Synchronous read returned", syncText.split("\n").filter(Boolean).length, "lines.");

  const asyncText = await fs.readFile(notePath, "utf8");
  console.log("Example 5B: Asynchronous Promise read returned", asyncText.split("\n").filter(Boolean).length, "lines.");

  // ----------------------------------------------------------
  // Section 8, Example 6: List directory contents
  // ----------------------------------------------------------
  const files = await fs.readdir(dataDir);
  console.log("\nExample 6: Files currently in the demo folder:", files);

  // ----------------------------------------------------------
  // Section 9, Example 7: Rename a file and delete a demo file
  // ----------------------------------------------------------
  await fs.rename(notePath, renamedNotePath);
  console.log("\nExample 7A: Renamed notes.txt to my-notes.txt.");

  await fs.writeFile(temporaryPath, "This is only a temporary demo file.", "utf8");
  await fs.unlink(temporaryPath);
  console.log("Example 7B: Created and deleted the demo temporary.txt file.");

  // ----------------------------------------------------------
  // Section 10, Example 8: Catch a file operation error
  // ----------------------------------------------------------
  try {
    await fs.readFile(path.join(dataDir, "missing-file.txt"), "utf8");
  } catch (error) {
    console.log("\nExample 8: Error handled:", error.code);
    console.log("Message:", error.message);
  }

  console.log("\nDemo complete. Your final note is in fs-demo-data/my-notes.txt.");
}

main().catch((error) => {
  console.error("Unexpected demo error:", error);
  process.exitCode = 1;
});
