import { ref, push, set, onValue, query, orderByChild, limitToLast } from 'firebase/database'
import { db, auth, firebaseConfigured } from './firebase.js'

let stopMessages = null
let stopUsers = null
let onlineUid = null

const esc = v => String(v ?? '').replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))
const initials = n => String(n||'User').split(/\s+/).map(x=>x[0]).slice(0,2).join('').toUpperCase()

function getLocalState(){
  try { return JSON.parse(localStorage.getItem('skillswap_multipage_v6') || '{}') } catch { return {} }
}
function currentUser(){
  const s=getLocalState()
  return s.current ? (s.users||[]).find(u=>u.id===s.current.id) : null
}
function roomId(a,b){ return [a,b].sort().join('__') }

export function mountOnlineChat(){
  const list=document.getElementById('userList'), box=document.getElementById('chatMessages')
  if(!list || !box) return
  let selected='community'
  let users=[]
  const me=currentUser()
  if(!firebaseConfigured){
    list.innerHTML='<div class="empty"><h3>Online chat is not configured</h3><p>Open <b>src/firebase.js</b> and add your Firebase web configuration.</p></div>'
    box.innerHTML='<div class="empty"><h3>Connect Firebase</h3><p>Once Firebase is configured, people can chat live from anywhere in the world.</p></div>'
    return
  }
  if(!me){
    list.innerHTML='<div class="empty"><h3>Log in first</h3><p>Create or log in to a SkillSwap account to start a direct chat.</p><a class="btn primary" href="/login">Log in</a></div>'
    box.innerHTML='<div class="empty"><h3>Global chat</h3><p>Log in to join.</p></div>'
    return
  }

  function renderUsers(){
    list.innerHTML='<div class="user-item selected" data-user="community"><span class="avatar">🌐</span>Global Chat</div>'+
      users.filter(u=>u.id!==me.id).map(u=>`<div class="user-item" data-user="${esc(u.id)}"><span class="avatar">${initials(u.name)}</span>${esc(u.name)}</div>`).join('')
    list.querySelectorAll('[data-user]').forEach(el=>el.onclick=()=>select(el.dataset.user))
  }
  function select(uid){
    selected=uid
    list.querySelectorAll('[data-user]').forEach(x=>x.classList.toggle('selected',x.dataset.user===uid))
    const u=users.find(x=>x.id===uid)
    document.getElementById('chatHeading').textContent=uid==='community'?'Global Chat':(u?.name||'User')
    document.getElementById('chatSubheading').textContent=uid==='community'?'Everyone around the world':'Private conversation'
    subscribeMessages()
  }
  function subscribeMessages(){
    if(stopMessages) stopMessages()
    const room=selected==='community'?'community':roomId(me.id,selected)
    const q=query(ref(db,`messages/${room}`),orderByChild('time'),limitToLast(100))
    stopMessages=onValue(q,snap=>{
      const rows=[]
      snap.forEach(c=>rows.push({id:c.key,...c.val()}))
      box.innerHTML=rows.length?rows.map(m=>`<div class="bubble ${m.senderId===me.id?'mine':''}">${esc(m.text)}<small>${esc(m.senderName||'User')} · ${new Date(m.time).toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</small></div>`).join(''):'<div class="empty"><h3>No messages yet</h3><p>Start the conversation.</p></div>'
      box.scrollTop=box.scrollHeight
    })
  }

  const myRef=ref(db,`users/${me.id}`)
  set(myRef,{id:me.id,name:me.name,username:me.username||'',updatedAt:Date.now()})
  const usersQ=query(ref(db,'users'),orderByChild('name'))
  stopUsers=onValue(usersQ,snap=>{
    users=[]; snap.forEach(c=>users.push(c.val()))
    renderUsers()
  })
  select('community')

  const form=document.getElementById('composer')
  form.onsubmit=async e=>{
    e.preventDefault()
    const input=document.getElementById('messageInput')
    const text=input.value.trim()
    if(!text || !auth?.currentUser) return
    const room=selected==='community'?'community':roomId(me.id,selected)
    const msg=push(ref(db,`messages/${room}`))
    await set(msg,{senderId:me.id,senderName:me.name,text,time:Date.now()})
    input.value=''
  }
}

export function cleanupOnlineChat(){
  if(stopMessages) stopMessages()
  if(stopUsers) stopUsers()
  stopMessages=stopUsers=null
}
