# Lục Hào Bát Quái 六爻八卦

Vietnamese I Ching (六爻占) divination desktop app built with Electron + React.

## Features

- **Chat-based interface** — ask a question, choose a casting method, receive a hexagram reading
- **Auto casting** — system instantly generates all 6 lines via coin toss simulation
- **Manual coin toss** — interactive screen to toss 3 coins for each of the 6 lines, one at a time
- **Right panel analysis** — four tabs covering the hexagram diagram (Quẻ Đồ), five elements (Ngũ Hành), trigrams (Bát Quái), and reference texts (Tham Khảo)
- **Session history** — sessions are persisted in SQLite and listed in the sidebar

## Tech Stack

- **Electron 33** + **electron-vite 2**
- **React 19** + **TypeScript 5.7**
- **better-sqlite3** for local persistence
- **Be Vietnam Pro** font (self-hosted via `@fontsource`)
- **lucide-react** for icons

## Development

```bash
# Install dependencies (--legacy-peer-deps required due to Vite 6 peer dep)
npm install --legacy-peer-deps

# Start dev server + Electron
npm run dev

# Production build (output to out/)
npm run build

# Type check renderer
npx tsc -p tsconfig.web.json --noEmit

# Lint
npm run lint

# Format
npm run format
```

## Project Structure

```
src/
  main/         Electron main process, SQLite layer (db.ts)
  preload/      contextBridge IPC definitions
  renderer/
    src/
      data/     64 hexagrams, 8 trigrams, Nạp Giáp tables
      utils/    Coin toss simulation, hexagram derivation, date utils
      hooks/    useApp — main state machine and session management
      components/
        TopNav, Sidebar
        ChatArea/       Chat messages and input
        CoinTossScreen/ Interactive 6-step coin toss UI
        RightPanel/     QueDo, NguHanh, BatQuat, ThamKhao tabs
```

## Data Storage

Sessions and messages are stored in `userData/data/luchao.db` (SQLite). The database is created automatically on first launch.

## License

MIT
