# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install (must use --legacy-peer-deps due to Vite 6 / electron-vite 2 peer dep conflict)
npm install --legacy-peer-deps

# Development (starts Vite dev server + Electron window with DevTools)
npm run dev

# Production build (outputs to out/)
npm run build

# Type-check renderer only
npx tsc -p tsconfig.web.json --noEmit

# Type-check main process only
npx tsc -p tsconfig.node.json --noEmit
```

`postinstall` automatically runs `electron-rebuild -f -w better-sqlite3` to compile the native SQLite addon for the current Electron version. Re-run manually if you change Electron versions.

## Architecture

This is an Electron 33 + React 19 + TypeScript desktop app (macOS). It follows the standard Electron three-process model:

**Main process** (`src/main/`)

- `index.ts` — creates the BrowserWindow, registers all IPC handlers, calls `openDatabase()`
- `db.ts` — opens `userData/data/luchao.db` (better-sqlite3), runs migrations, and exports `sessionQueries`, `messageQueries`, `settingQueries`

**Preload** (`src/preload/index.ts`)

- Exposes `window.api` via `contextBridge` with typed wrappers around `ipcRenderer.invoke()`
- IPC channel naming convention: `entity:action` (e.g. `session:create`, `message:list`)

**Renderer** (`src/renderer/src/`)

- Pure React SPA. All Electron access goes through `window.api` — no direct Node imports in renderer
- Single layout: `TopNav` (56px) | `Sidebar` (260px) | `ChatArea` (flex) | `RightPanel` (380px)
- State is entirely managed by `hooks/useApp.ts` which owns sessions, messages, and coin-casting state
- `App.tsx` wires `useApp()` output to the four layout components

### Data flow

```
User input → ChatArea → useApp actions → window.api (IPC) → main process db.ts
                                       → local React state → UI re-render
```

### Hexagram system (`src/renderer/src/data/` + `utils/casting.ts`)

- `hexagrams.ts` exports `BINARY_TO_KW[64]`: index is 6-bit binary (bit0=line1-bottom, bit5=line6-top), value is King Wen number
- `getHexagramByLines(bits)` looks up by this 6-bit index
- `getEarthBranch(hex, lineIndex)` uses global line index 0–5 (NOT trigram-local 0–2) — this distinction matters for Nạp Giáp correctness
- `casting.ts` exports: `tossThreeCoins()`, `autoCast()`, `deriveHexagrams()`, `buildLineDetails()`
- Line values: `6`=old yin (changing), `7`=young yang, `8`=young yin, `9`=old yang (changing)

### Chat flow / session state machine

`SessionState`: `idle` → `asked` → `casting` | `cast_done`

1. `sendQuestion()` → adds user message + `method_select` assistant message
2. `chooseMethod('auto')` → calls `autoCast()` + `deriveHexagrams()` → `hexagram_result` message, state=`cast_done`
3. `chooseMethod('coin')` → state=`casting`, step-by-step via `tossCoinStep()` (6 steps)
4. After cast: `activeSession.castResult` populates the RightPanel tabs

### Message types

`MessageType`: `welcome` | `text` | `method_select` | `casting_step` | `hexagram_result` | `ai_analysis`

`MessageBubble.tsx` renders each type differently. `metadata` JSON field carries structured data (e.g. `castResult` for `hexagram_result`).

### tsconfig setup

Two separate tsconfigs (no `@electron-toolkit/tsconfig` package):

- `tsconfig.node.json` — compiles main + preload
- `tsconfig.web.json` — compiles renderer, requires `"jsx": "react-jsx"` explicitly

### Path aliases (renderer only)

```
@renderer → src/renderer/src
@components → src/renderer/src/components
@data → src/renderer/src/data
@utils → src/renderer/src/utils
@hooks → src/renderer/src/hooks
```

### SQLite schema

- `sessions`: id, title, question, hex_lines (JSON number[]), hex_number, hex_changed, tags (JSON string[]), created_at
- `messages`: id, session_id (CASCADE DELETE), role, content, msg_type, metadata (JSON), created_at
- `settings`: key, value (INSERT OR REPLACE)

### AI integration

`@anthropic-ai/sdk` is installed. A placeholder hook exists in `useApp.ts` for `window.api.claudeComplete` (streaming). The `ai_analysis` message type is defined but not yet wired to an IPC handler.
