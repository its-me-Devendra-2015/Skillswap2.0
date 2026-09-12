# SkillSwap v6 — Global Online Chat

This build adds a real-time worldwide chat system using Firebase Realtime Database.

## Setup (required once)

1. Create a Firebase project in the Firebase Console.
2. Add a Web App.
3. Enable **Authentication → Anonymous**.
4. Create **Realtime Database**.
5. Copy the Firebase web config into `src/firebase.js`.
6. Configure Realtime Database rules. For a simple prototype, authenticated users can read/write:

```json
{
  "rules": {
    "users": {
      ".read": "auth != null",
      "$uid": {
        ".write": "auth != null"
      }
    },
    "messages": {
      "$room": {
        ".read": "auth != null",
        "$message": {
          ".write": "auth != null"
        }
      }
    }
  }
}
```

For a public production app, tighten the rules and add moderation/rate limiting.

## Run

```bash
npm install
npm run dev
```

## What was added

- 🌍 **Global Chat** — one live room for users around the world.
- 💬 **Private chat** — select any registered SkillSwap user and message them.
- ⚡ **Real-time updates** — messages appear without refreshing.
- 👤 **Global user directory** — SkillSwap accounts are registered in Firebase for chat discovery.
- 🔒 Firebase Anonymous Authentication is used to establish a secure Firebase session; your existing SkillSwap account UI remains intact.

The existing SkillSwap styling and pages are preserved.
