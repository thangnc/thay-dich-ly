import { contextBridge, ipcRenderer } from 'electron'

// ─── IPC bridge (renderer → main) ────────────────────────────────────────────

const api = {
  // Sessions
  createSession: (id: string, title: string, question: string) =>
    ipcRenderer.invoke('session:create', id, title, question),
  updateSession: (id: string, patch: object) => ipcRenderer.invoke('session:update', id, patch),
  listSessions: () => ipcRenderer.invoke('session:list'),
  getSession: (id: string) => ipcRenderer.invoke('session:get', id),
  deleteSession: (id: string) => ipcRenderer.invoke('session:delete', id),

  // Messages
  addMessage: (row: object) => ipcRenderer.invoke('message:add', row),
  listMessages: (sessionId: string) => ipcRenderer.invoke('message:list', sessionId),
  updateMessage: (id: string, content: string) => ipcRenderer.invoke('message:update', id, content),

  // Settings
  getSetting: (key: string) => ipcRenderer.invoke('setting:get', key),
  setSetting: (key: string, value: string) => ipcRenderer.invoke('setting:set', key, value)
}

// Expose under window.api
contextBridge.exposeInMainWorld('api', api)

// Type declaration augmentation — used by renderer TypeScript
export type AppApi = typeof api
