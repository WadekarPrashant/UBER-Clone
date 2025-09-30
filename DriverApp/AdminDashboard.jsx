// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react'
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebaseConfig'

export default function AdminDashboard() {
  const [pending, setPending] = useState([])

  async function fetchPending() {
    const snap = await getDocs(collection(db, 'pending_reels'))
    setPending(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  useEffect(() => {
    fetchPending()
  }, [])

  async function approve(item) {
    // move to reels
    const newReel = {
      user: item.user,
      caption: item.caption,
      src: item.src,
      likes: 0,
      commentsCount: 0,
      createdAt: item.createdAt || new Date()
    }
    // create new doc in reels collection
    await addDoc(collection(db, 'reels'), newReel)
    // mark pending as approved
    await updateDoc(doc(db, 'pending_reels', item.id), { status: 'approved' })
    fetchPending()
  }

  async function reject(item) {
    await updateDoc(doc(db, 'pending_reels', item.id), { status: 'rejected' })
    fetchPending()
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin — Flagged Content</h2>
      {pending.length === 0 ? <div>No pending items</div> :
        pending.map(p => (
          <div key={p.id} className="border p-3 my-2">
            <div><strong>@{p.user}</strong> — {p.caption}</div>
            <video src={p.src} controls className="max-h-64 my-2" />
            <div>Reasons: {(p.reasons || []).join(', ')}</div>
            <div className="mt-2 flex gap-2">
              <button onClick={() => approve(p)} className="px-3 py-1 bg-green-600 rounded">Approve</button>
              <button onClick={() => reject(p)} className="px-3 py-1 bg-red-600 rounded">Reject</button>
            </div>
          </div>
        ))
      }
    </div>
  )
}
