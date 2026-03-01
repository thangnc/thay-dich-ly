import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SessionRow {
  id: string
  title: string
  question: string
  hex_lines: string | null      // JSON: number[] (6 line values 6/7/8/9)
  hex_number: number | null     // King Wen number of primary hexagram
  hex_changed: number | null    // King Wen number of changed hexagram (or null)
  tags: string | null           // JSON: string[]
  created_at: number
}

export interface MessageRow {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  msg_type: string   // 'text' | 'method_select' | 'hexagram_result' | 'casting_step' | 'ai_analysis'
  metadata: string | null  // JSON blob for extra data
  created_at: number
}

export interface SettingRow {
  key: string
  value: string
}

// ─── Database setup ───────────────────────────────────────────────────────────

let db: Database.Database

export function openDatabase(): void {
  const userDataPath = app.getPath('userData')
  const dbDir = path.join(userDataPath, 'data')
  if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

  db = new Database(path.join(dbDir, 'luchao.db'))
  db.pragma('journal_mode = WAL')
  db.pragma('foreign_keys = ON')
  migrate()
}

function migrate(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id         TEXT PRIMARY KEY,
      title      TEXT NOT NULL DEFAULT 'Chưa đặt tên',
      question   TEXT NOT NULL DEFAULT '',
      hex_lines  TEXT,
      hex_number INTEGER,
      hex_changed INTEGER,
      tags       TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id         TEXT PRIMARY KEY,
      session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
      role       TEXT NOT NULL CHECK(role IN ('user','assistant')),
      content    TEXT NOT NULL DEFAULT '',
      msg_type   TEXT NOT NULL DEFAULT 'text',
      metadata   TEXT,
      created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000)
    );

    CREATE TABLE IF NOT EXISTS settings (
      key   TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_sessions_created ON sessions(created_at DESC);
  `)
}

// ─── Session queries ──────────────────────────────────────────────────────────

export const sessionQueries = {
  create(id: string, title: string, question: string): SessionRow {
    const stmt = db.prepare(`
      INSERT INTO sessions (id, title, question, created_at)
      VALUES (?, ?, ?, ?)
      RETURNING *
    `)
    return stmt.get(id, title, question, Date.now()) as SessionRow
  },

  update(id: string, patch: Partial<Pick<SessionRow, 'title' | 'question' | 'hex_lines' | 'hex_number' | 'hex_changed' | 'tags'>>): void {
    const sets: string[] = []
    const values: unknown[] = []
    for (const [key, val] of Object.entries(patch)) {
      sets.push(`${key} = ?`)
      values.push(typeof val === 'object' && val !== null ? JSON.stringify(val) : val)
    }
    if (sets.length === 0) return
    values.push(id)
    db.prepare(`UPDATE sessions SET ${sets.join(', ')} WHERE id = ?`).run(...values)
  },

  findAll(): SessionRow[] {
    return db.prepare('SELECT * FROM sessions ORDER BY created_at DESC LIMIT 50').all() as SessionRow[]
  },

  findById(id: string): SessionRow | undefined {
    return db.prepare('SELECT * FROM sessions WHERE id = ?').get(id) as SessionRow | undefined
  },

  delete(id: string): void {
    db.prepare('DELETE FROM sessions WHERE id = ?').run(id)
  }
}

// ─── Message queries ──────────────────────────────────────────────────────────

export const messageQueries = {
  add(row: Omit<MessageRow, 'created_at'>): MessageRow {
    const stmt = db.prepare(`
      INSERT INTO messages (id, session_id, role, content, msg_type, metadata, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      RETURNING *
    `)
    return stmt.get(row.id, row.session_id, row.role, row.content, row.msg_type, row.metadata ?? null, Date.now()) as MessageRow
  },

  findBySession(sessionId: string): MessageRow[] {
    return db.prepare('SELECT * FROM messages WHERE session_id = ? ORDER BY created_at ASC').all(sessionId) as MessageRow[]
  },

  updateContent(id: string, content: string): void {
    db.prepare('UPDATE messages SET content = ? WHERE id = ?').run(content, id)
  }
}

// ─── Settings queries ─────────────────────────────────────────────────────────

export const settingQueries = {
  get(key: string): string | null {
    const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as SettingRow | undefined
    return row?.value ?? null
  },

  set(key: string, value: string): void {
    db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(key, value)
  }
}
