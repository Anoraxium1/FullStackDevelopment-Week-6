# Chat Feature — Implementation Notes (2026-08-27)

## What was built

A working two-way chat between browser tabs, using Angular on the client and
Express + Socket.IO on the server.

```
Browser A ⇄ socket.io ⇄ Node/Express server (port 3000) ⇄ socket.io ⇄ Browser B
```

## Client (`chat/`, Angular app on port 4200)

1. **`src/app/chat/chat.ts` / `chat.html` / `chat.css`** — the `Chat` component:
   - A `<form>` with a text input (`[(ngModel)]`) and a submit button.
   - Calling `sendMessage()` on submit passes the input's value to the service,
     then clears the input.
   - A `<ul>` below the form renders every message that has arrived, inside a
     bordered, scrollable box. The whole card is centered on the page.

2. **`src/app/services/chatService.ts`** — the `Chat` service (holds all the
   socket.io-client code, so the component doesn't need to know about sockets
   directly):
   - Opens one socket connection to `http://localhost:3000` when the service
     is created.
   - `sendMessage(message)` emits a `'chat message'` event to the server.
   - Listens for incoming `'chat message'` events from the server and pushes
     each one into an RxJS `Subject`, exposed publicly as the read-only
     Observable `messages$`.

3. **`src/app/app.routes.ts`** — registered the component at the root path
   (`path: ''`) so it loads straight into `<router-outlet>` on startup.

4. **`src/app/app.html`** — removed the default Angular CLI placeholder/splash
   content so the chat UI is what actually shows (previously the placeholder
   sat above the router outlet and pushed the chat off-screen).

### Observables vs. Signals (why both are used)

- The **service** exposes incoming messages as an **Observable**
  (`messages$`, backed by an RxJS `Subject`) — a natural fit because socket
  events arrive asynchronously over time and the service shouldn't care how
  (or whether) Angular renders them.
- The **component** subscribes to `messages$` (auto-unsubscribing via
  `takeUntilDestroyed()`) and appends each message into a **Signal**
  (`signal<string[]>`) — Angular's template (`messages()` in the `@for` loop)
  reacts to signal changes automatically with no manual subscription in the
  template.

So: Observable = how the message stream is modeled/transported out of the
service; Signal = how the component turns that stream into renderable UI
state.

## Server (`chat/server/`, Node on port 3000)

1. **`server.js`** — sets up Express + a plain `http` server + Socket.IO,
   with CORS explicitly enabled for the Angular dev origin
   (`http://localhost:4200`), per the Socket.IO v4 CORS requirement:
   ```js
   const io = require('socket.io')(http, {
     cors: { origin: 'http://localhost:4200', methods: ['GET', 'POST'] },
   });
   ```
   No Express routes are needed — the server only exists to host the
   Socket.IO connection.

2. **`sockets.js`** — the actual socket handling: on `'chat message'` from
   any client, it broadcasts (`io.emit`) that message back out to **every**
   connected client (including the sender), which is what makes messages
   show up in all open browser tabs.

3. **`listen.js`** — starts the server listening on port 3000.

## Dependencies installed

- `chat/` (client): `socket.io-client`
- `chat/server/` (server): `socket.io`

## Bugs fixed along the way

- `server.js` was missing `module.exports = server;`, so `listen.js` received
  an empty object and `server.listen` wasn't a function.
- `app.html` still had the full Angular CLI placeholder page above
  `<router-outlet>`, so the chat UI was technically rendering but pushed
  below the fold.

## Running it

```bash
# terminal 1 — server
cd chat/server
node listen.js

# terminal 2 — client
cd chat
npx ng serve
```

Open `http://localhost:4200` in two separate browser windows/tabs and send
messages from each — they should appear in both.
