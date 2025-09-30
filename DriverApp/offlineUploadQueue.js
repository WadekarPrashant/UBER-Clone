// src/services/offlineUploadQueue.js
import { openDB } from 'idb'
import { reelsService } from './reelsService' // the upload function should support File upload

const DB_NAME = 'reels_offline_db'
const STORE = 'upload_queue'

async function getDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true })
    }
  })
}

export const offlineUploadQueue = {
  enqueue: async (item) => {
    const db = await getDB()
    await db.add(STORE, { ...item, createdAt: Date.now(), status: 'queued' })
  },

  getAll: async () => {
    const db = await getDB()
    return db.getAll(STORE)
  },

  clear: async () => {
    const db = await getDB()
    const tx = db.transaction(STORE, 'readwrite')
    await tx.objectStore(STORE).clear()
    await tx.done
  },

  processQueue: async () => {
    const db = await getDB()
    const all = await db.getAll(STORE)
    for (const item of all) {
      try {
        // item: { fileBlob, user, caption }
        // Re-create a File if necessary
        let file = item.file
        if (item.fileBlob && !item.file) {
          file = new File([item.fileBlob], item.name || 'upload.webm', { type: item.type || 'video/webm' })
        }
        await reelsService.uploadReel({ file, user: item.user, caption: item.caption })
        // delete record
        const tx = db.transaction(STORE, 'readwrite')
        await tx.store.delete(item.id)
        await tx.done
      } catch (err) {
        console.warn('Failed to upload queued item', item, err)
        // keep it in queue for next attempt
      }
    }
  }
}


export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'ReelsApp',
        short_name: 'Reels',
        start_url: '/',
        display: 'standalone',
        background_color: '#000000',
        theme_color: '#000000',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ]
})
