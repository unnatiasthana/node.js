"use strict";

/*
  Node.js EventEmitter — demo code matching the video script and notes.

  Run from the terminal:
    node 03-event-emitter-code.js

  Script sections map to examples:
    Section 3  -> Examples 1–2
    Section 4  -> Examples 3–4
    Section 5  -> Example 5
    Section 6  -> Example 6
    Section 7  -> Example 7
    Section 8  -> Example 8
    Section 9  -> Example 9
    Section 10 -> Example 10
*/

const EventEmitter = require("node:events");

// ------------------------------------------------------------
// Section 3, Example 1: Create an EventEmitter instance
// ------------------------------------------------------------

const emitter = new EventEmitter();
console.log("Example 1: Emitter create ho gaya.\n");

// ------------------------------------------------------------
// Section 3, Example 2: Register a listener, then emit an event
// ------------------------------------------------------------

emitter.on("greet", () => {
  console.log("Hello! Greet event receive ho gaya.");
});

emitter.emit("greet");
console.log("");

// ------------------------------------------------------------
// Section 4, Example 3: Pass a simple value with the event
// ------------------------------------------------------------

emitter.on("welcome", (name) => {
  console.log(`Welcome, ${name}!`);
});

emitter.emit("welcome", "Asha");
console.log("");

// ------------------------------------------------------------
// Section 4, Example 4: Pass an object with the event
// ------------------------------------------------------------

emitter.on("userRegistered", (user) => {
  console.log(`Naya user: ${user.name}`);
  console.log(`Email: ${user.email}`);
});

emitter.emit("userRegistered", {
  name: "Riya",
  email: "riya@example.com"
});
console.log("");

// ------------------------------------------------------------
// Section 5, Example 5: Multiple listeners for the same event
// ------------------------------------------------------------

emitter.on("orderPlaced", (orderId) => {
  console.log(`Order ${orderId} system mein log ho gaya.`);
});

emitter.on("orderPlaced", (orderId) => {
  console.log(`Order ${orderId} ke liye confirmation bhejne ka step chala.`);
});

emitter.emit("orderPlaced", 1042);
console.log("");

// ------------------------------------------------------------
// Section 6, Example 6: .once() runs the listener only once
// ------------------------------------------------------------

emitter.once("connected", () => {
  console.log("Connection event pehli baar receive hua.");
});

emitter.emit("connected");
emitter.emit("connected"); // No second message from this once-listener.
console.log("");

// ------------------------------------------------------------
// Section 7, Example 7: Remove a listener with .off()
// ------------------------------------------------------------

function onMessage(message) {
  console.log(`Message mila: ${message}`);
}

emitter.on("message", onMessage);
emitter.emit("message", "Namaste!");

emitter.off("message", onMessage);
emitter.emit("message", "Iske liye listener remove ho chuka hai.");
console.log("");

// ------------------------------------------------------------
// Section 8, Example 8: Extend EventEmitter in a custom class
// ------------------------------------------------------------

class OrderSystem extends EventEmitter {
  placeOrder(orderId, customerName) {
    console.log(`Order ${orderId} place ho raha hai...`);

    this.emit("orderPlacedByClass", {
      orderId,
      customerName
    });
  }
}

const orders = new OrderSystem();

orders.on("orderPlacedByClass", (order) => {
  console.log(`Order ${order.orderId} ko system mein log kiya.`);
});

orders.on("orderPlacedByClass", (order) => {
  console.log(`${order.customerName} ko confirmation bhejne ka step chala.`);
});

orders.placeOrder(2050, "Asha");
console.log("");

// ------------------------------------------------------------
// Section 9, Example 9: Handle the special 'error' event
// ------------------------------------------------------------

const safeEmitter = new EventEmitter();

// Register the error listener before emitting the error event.
safeEmitter.on("error", (error) => {
  console.error("Error handle hua:", error.message);
});

safeEmitter.emit("error", new Error("Kuch galat ho gaya"));
console.log("");

// ------------------------------------------------------------
// Section 10, Example 10: Combine the ideas in a notification class
// ------------------------------------------------------------

class NotificationCenter extends EventEmitter {
  sendNotification(message, recipient) {
    this.emit("notificationSent", {
      message,
      recipient,
      time: new Date().toISOString()
    });
  }
}

const notifications = new NotificationCenter();

notifications.on("notificationSent", (notification) => {
  console.log(
    `${notification.recipient} ko notification mila: "${notification.message}"`
  );
  console.log(`Time: ${notification.time}`);
});

notifications.sendNotification(
  "Aapka order dispatch ho gaya hai.",
  "Riya"
);
