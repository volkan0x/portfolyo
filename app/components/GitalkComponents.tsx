'use client'

import { useEffect, useRef } from 'react'
import Gitalk from '@gitalk/gitalk'
import '@gitalk/gitalk/dist/gitalk.css'

type Props = {
  id: string // unique id for the page/post (used to map to GitHub issue)
  title?: string
}

export default function GitalkComments({ id, title }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Ensure this runs only in browser
    if (!containerRef.current || typeof window === 'undefined') return

    // IMPORTANT: these values must be exposed to the client with NEXT_PUBLIC_*
    const clientID = process.env.NEXT_PUBLIC_GITALK_CLIENT_ID
    const clientSecret = process.env.NEXT_PUBLIC_GITALK_CLIENT_SECRET
    const repo = process.env.NEXT_PUBLIC_GITALK_REPO || 'comments'
    const owner = process.env.NEXT_PUBLIC_GITALK_OWNER || ''
    const adminEnv = process.env.NEXT_PUBLIC_GITALK_ADMIN || ''
    const admin = adminEnv ? adminEnv.split(',').map(s => s.trim()) : []

    if (!clientID || !clientSecret || !owner) {
      // optional: show a warning in dev mode
      if (process.env.NODE_ENV === 'development') {
        // eslint-disable-next-line no-console
        console.warn('Gitalk config missing: set NEXT_PUBLIC_GITALK_CLIENT_ID, NEXT_PUBLIC_GITALK_CLIENT_SECRET and NEXT_PUBLIC_GITALK_OWNER in .env.local')
      }
      return
    }

    const gitalk = new Gitalk({
      clientID,
      clientSecret,
      repo,
      owner,
      admin,
      id,
      title,
      distractionFreeMode: false,
    })

    gitalk.render(containerRef.current)

    return () => {
      // Gitalk doesn't provide a destroy method. Clear container if unmounting.
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  }, [id, title])

  return <div ref={containerRef} />
}