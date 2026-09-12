// SkillSwap online chat configuration
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Add a Web App and copy its config here.
// 3. Enable Authentication > Anonymous.
// 4. Create Realtime Database.
// 5. Paste your config below.

import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  apiKey: 'PASTE_YOUR_API_KEY',
  authDomain: 'PASTE_YOUR_PROJECT.firebaseapp.com',
  databaseURL: 'https://PASTE_YOUR_PROJECT-default-rtdb.firebaseio.com',
  projectId: 'PASTE_YOUR_PROJECT',
  storageBucket: 'PASTE_YOUR_PROJECT.firebasestorage.app',
  messagingSenderId: 'PASTE_YOUR_SENDER_ID',
  appId: 'PASTE_YOUR_APP_ID'
}

export const firebaseConfigured = !firebaseConfig.apiKey.startsWith('PASTE_')

let app, auth, db
if (firebaseConfigured) {
  app = initializeApp(firebaseConfig)
  auth = getAuth(app)
  db = getDatabase(app)
  signInAnonymously(auth).catch(() => {})
}

export { auth, db }
