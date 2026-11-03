# Node.js EventEmitter — Notes Page

**Companion script:** `01-event-emitter-video-script.md`  
**Companion code:** `03-event-emitter-code.js`  
**Alignment:** Section numbers below match the script and numbered code examples.

---

## 1. Topic aur learning goals

**Topic:** Node.js EventEmitter

Is lesson ke baad aap samajh paoge:

- Event, emitter, aur listener kya hote hain.
- `.on()` aur `.emit()` ka use kaise karte hain.
- Event ke saath values aur objects kaise pass karte hain.
- Ek event par multiple listeners kaise lagate hain.
- `.once()` aur `.off()` kab use hote hain.
- Class ko EventEmitter se extend kaise karte hain.
- `error` events ko handle karne ka basic tareeka.

## 2. Basic definition aur analogy

**Definition:** `EventEmitter` Node.js ke `node:events` module ka built-in mechanism hai. Isse objects events emit kar sakte hain aur doosre functions un events ko listen kar sakte hain.

**Bell analogy:** Bell bajna event hai; bell bajane wala emitter hai; sun kar action lene wale listeners hain.

- **Emitter:** Event announce karne wala object.
- **Event:** Kisi cheez ke hone ki announcement; jaise `orderPlaced`.
- **Listener:** Event par chalne wala registered function.

Event names application ke developer choose karta hai. `orderPlaced` khud koi special JavaScript keyword nahi hai.

## 3. Import, `.on()` aur `.emit()`

Import aur object creation:

```js
const EventEmitter = require("node:events");
const emitter = new EventEmitter();
```

Listener register karna:

```js
emitter.on("greet", () => {
  console.log("Hello!");
});
```

Event emit karna:

```js
emitter.emit("greet");
```

**Important:** Listener pehle register karo, phir event emit karo. Normal EventEmitter event late listener ke liye history mein store nahi hota.

## 4. Event ke saath data bhejna

`.emit(eventName, ...arguments)` event name ke baad listener ko arguments de sakta hai.

```js
emitter.on("welcome", (name) => {
  console.log(`Welcome, ${name}!`);
});

emitter.emit("welcome", "Asha");
```

Kai related fields ke liye object bhejna readable hota hai:

```js
emitter.emit("userRegistered", {
  name: "Riya",
  email: "riya@example.com"
});
```

Listener mein object ko parameter ke roop mein receive karke properties access karte hain.

## 5. Multiple listeners

Ek event name par multiple `.on()` listeners register kiye ja sakte hain. Event emit hone par har listener call hota hai; aam taur par registration order mein.

Use case: `orderPlaced` par logging aur confirmation jaise alag reactions. Event emit karne wala code un reactions ko directly call karne ke bajay event announce karta hai.

EventEmitter khud email, database write ya network request nahi karta. Aise kaam listener ke code ya uske call ki hui service ko karne honge.

## 6. `.once()`

`.once(eventName, listener)` listener ko pehli matching event par chalata hai, phir listener automatically remove ho jaata hai.

Use case: first connection par ek baar setup.

## 7. `.off()`

`.off(eventName, listener)` registered listener ko remove karta hai. Wahi function reference pass karna hota hai.

```js
function onMessage(message) {
  console.log(message);
}

emitter.on("message", onMessage);
emitter.off("message", onMessage);
```

Cleanup ke liye named function rakhna convenient hota hai.

## 8. EventEmitter ko class mein extend karna

```js
class OrderSystem extends EventEmitter {
  placeOrder(orderId) {
    this.emit("orderPlaced", { orderId });
  }
}
```

`extends EventEmitter` se class instances ko EventEmitter methods milte hain. Class ka method event emit kar sakta hai; consumers us event par listeners register karte hain.

Demo mein console output placeholders hain. Real database/email integration ke liye actual service code chahiye.

## 9. `error` event

`error` event ka special behavior hai: agar emit karte waqt koi `error` listener registered nahi hai, toh Node.js error throw kar sakta hai.

```js
emitter.on("error", (error) => {
  console.error(error.message);
});

emitter.emit("error", new Error("Kuch galat ho gaya"));
```

Agar aapka code `error` emit kar sakta hai, toh use handle karne ki vyavastha rakho. Error ko chupane ke bajay log ya handle karo.

## 10. Combined notification example

`NotificationCenter` class `EventEmitter` ko extend karti hai. `sendNotification()` event ke saath ek object emit karta hai: message, recipient, aur timestamp. Listener data receive karke output dikhata hai.

Yeh `.on()`, `.emit()`, object payload, aur custom class ko ek example mein jodta hai.

## 11. Common mistakes

1. **Listener late register karna:** Event pehle emit ho gaya toh normal listener use baad mein receive nahi karega.
2. **Event name mismatch:** `userJoined` aur `userJoin` do alag names hain.
3. **Listener cleanup bhoolna:** Unused listeners remove karna useful hai, khaaskar long-running code mein.
4. **Unhandled `error`:** Error emit ho sakta hai toh error listener register karo.
5. **Demo ko real integration samajhna:** `console.log("confirmation bhej rahe hain")` actual email nahi bhejta.

## 12. Quick reference

| Method | Kaam |
|---|---|
| `.on(name, listener)` | Har matching event ke liye listener register karta hai |
| `.emit(name, ...args)` | Event announce karta hai aur arguments bhejta hai |
| `.once(name, listener)` | Pehli matching event par listener chala kar remove karta hai |
| `.off(name, listener)` | Given listener ko remove karta hai |

**One-line summary:** Ek part event emit karta hai; registered listeners us event par react karte hain.
