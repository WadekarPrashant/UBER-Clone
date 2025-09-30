// Mock service + promise-based API. Replace with Firebase calls as needed.
let mockReels = [
{
id: 'r1',
user: 'sahana',
caption: 'Sunset dev vibes',
src: 'https://interactive-examples.mdn.mozilla.net/media/examples/dragon.mp4',
likes: 12,
comments: [ { id: 'c1', user:'alex', text:'🔥'} ],
createdAt: Date.now() - 10000
},
{
id: 'r2',
user: 'prashant',
caption: 'My drone test',
src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
likes: 42,
comments: [],
createdAt: Date.now() - 20000
}
]


export const reelsService = {
fetchReels: async ({ offset = 0, limit = 10 } = {}) => {
// simulate network
await new Promise(r => setTimeout(r, 300))
return mockReels.slice(offset, offset + limit)
},


like: async (id) => {
await new Promise(r => setTimeout(r, 150))
const rIndex = mockReels.findIndex(r=>r.id===id)
if(rIndex>=0){mockReels[rIndex].likes++}
return { success: true }
},


postComment: async (id, comment) => {
await new Promise(r => setTimeout(r, 150))
const rIndex = mockReels.findIndex(r=>r.id===id)
if(rIndex>=0){
const c = { id: 'c' + Math.random().toString(36).slice(2,9), ...comment }
mockReels[rIndex].comments.push(c)
return c
}
throw new Error('not found')
},


uploadReel: async ({ file, user, caption }) => {
// In production: upload to storage, create DB doc with transcoded url
await new Promise(r => setTimeout(r, 700))
const r = {
id: 'r' + Math.random().toString(36).slice(2,9),
user,
caption,
src: URL.createObjectURL(file),
likes: 0,
comments: [],
createdAt: Date.now()
}
mockReels.unshift(r)
return r
}
}
