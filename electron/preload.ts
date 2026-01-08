import { contextBridge } from 'electron'

// Expõe APIs seguras para o renderer
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
})

