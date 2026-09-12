import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import { initApp } from './legacy.js'
import { mountOnlineChat, cleanupOnlineChat } from './onlineChat.js'

import indexHtml from './pages/index.html?raw'
import dashboardHtml from './pages/dashboard.html?raw'
import skillsHtml from './pages/skills.html?raw'
import masterclassesHtml from './pages/masterclasses.html?raw'
import masterclassDetailHtml from './pages/masterclass-detail.html?raw'
import lessonHtml from './pages/lesson.html?raw'
import toolsHtml from './pages/tools.html?raw'
import matchesHtml from './pages/matches.html?raw'
import projectsHtml from './pages/projects.html?raw'
import messagesHtml from './pages/messages.html?raw'
import communityHtml from './pages/community.html?raw'
import protestZoneHtml from './pages/protest-zone.html?raw'
import protestHtml from './pages/protest.html?raw'
import profileHtml from './pages/profile.html?raw'
import settingsHtml from './pages/settings.html?raw'
import signupHtml from './pages/signup.html?raw'
import loginHtml from './pages/login.html?raw'
import addSkillHtml from './pages/add-skill.html?raw'
import uploadProjectHtml from './pages/upload-project.html?raw'
import certificateHtml from './pages/certificate.html?raw'

const pages = {
  '/': indexHtml,
  '/index.html': indexHtml,
  '/dashboard': dashboardHtml,
  '/skills': skillsHtml,
  '/masterclasses': masterclassesHtml,
  '/masterclass-detail': masterclassDetailHtml,
  '/lesson': lessonHtml,
  '/tools': toolsHtml,
  '/matches': matchesHtml,
  '/projects': projectsHtml,
  '/messages': messagesHtml,
  '/community': communityHtml,
  '/protest-zone': protestZoneHtml,
  '/protest': protestHtml,
  '/profile': profileHtml,
  '/settings': settingsHtml,
  '/signup': signupHtml,
  '/login': loginHtml,
  '/add-skill': addSkillHtml,
  '/upload-project': uploadProjectHtml,
  '/certificate': certificateHtml,
}

const pageNames = {
  '/': 'home', '/index.html': 'home', '/dashboard': 'dashboard', '/skills': 'skills',
  '/masterclasses': 'masterclasses', '/masterclass-detail': 'masterdetail', '/lesson': 'lesson',
  '/tools': 'tools', '/matches': 'matches', '/projects': 'projects', '/messages': 'messages',
  '/community': 'community', '/protest-zone': 'protests', '/protest': 'room', '/profile': 'profile',
  '/settings': 'settings', '/signup': 'signup', '/login': 'login', '/add-skill': 'addskill',
  '/upload-project': 'upload', '/certificate': 'certificate'
}

function extractBody(html) {
  const match = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i)
  return match ? match[1].replace(/<script[\s\S]*?<\/script>/gi, '') : html
}

function normalizeHref(href) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http:') || href.startsWith('https:')) return href
  const [path, query] = href.split('?')
  const map = {
    'index.html': '/', 'dashboard.html': '/dashboard', 'skills.html': '/skills',
    'masterclasses.html': '/masterclasses', 'masterclass-detail.html': '/masterclass-detail',
    'lesson.html': '/lesson', 'tools.html': '/tools', 'matches.html': '/matches',
    'projects.html': '/projects', 'messages.html': '/messages', 'community.html': '/community',
    'protest-zone.html': '/protest-zone', 'protest.html': '/protest', 'profile.html': '/profile',
    'settings.html': '/settings', 'signup.html': '/signup', 'login.html': '/login',
    'add-skill.html': '/add-skill', 'upload-project.html': '/upload-project', 'certificate.html': '/certificate'
  }
  const normalized = map[path] || path
  return query ? `${normalized}?${query}` : normalized
}

function App() {
  const [url, setUrl] = useState(() => window.location.pathname + window.location.search)
  const pathname = window.location.pathname
  const pageHtml = useMemo(() => extractBody(pages[pathname] || indexHtml), [pathname])

  useEffect(() => {
    const onPop = () => setUrl(window.location.pathname + window.location.search)
    const onClick = (event) => {
      const anchor = event.target.closest?.('a[href]')
      if (!anchor) return
      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('http:') || href.startsWith('https:') || href.startsWith('mailto:')) return
      const normalized = normalizeHref(href)
      if (!normalized.startsWith('/')) return
      event.preventDefault()
      window.history.pushState({}, '', normalized)
      setUrl(normalized)
      window.scrollTo(0, 0)
    }
    window.addEventListener('popstate', onPop)
    document.addEventListener('click', onClick)
    return () => {
      window.removeEventListener('popstate', onPop)
      document.removeEventListener('click', onClick)
    }
  }, [])

  useEffect(() => {
    document.body.dataset.page = pageNames[pathname] || 'home'
    document.body.classList.remove('react-route-ready')
    document.title = 'SkillSwap'
    requestAnimationFrame(() => {
      initApp()
      if (pathname === '/messages') {
        cleanupOnlineChat()
        mountOnlineChat()
      } else {
        cleanupOnlineChat()
      }
      document.body.classList.add('react-route-ready')
    })
  }, [url, pathname])

  return <div dangerouslySetInnerHTML={{ __html: pageHtml }} />
}

createRoot(document.getElementById('root')).render(<App />)
