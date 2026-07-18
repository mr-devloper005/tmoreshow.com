'use client'

import { useEffect, useRef, useState, type CSSProperties, type ElementType, type ReactNode } from 'react'

type EditableRevealProps = {
  children: ReactNode
  index?: number
  as?: ElementType
  className?: string
  delay?: number
  once?: boolean
  style?: CSSProperties
}

/*
  Intersection-observer driven fade + slide-up. Hidden state is applied ONLY
  after mount so JS-off visitors still see content immediately, and to avoid
  hydration mismatch on server render.
*/
export function EditableReveal({
  children,
  index = 0,
  as = 'div',
  className = '',
  delay,
  once = true,
  style,
}: EditableRevealProps) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setMounted(true)
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            if (once) io.disconnect()
          } else if (!once) {
            setVisible(false)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [once])

  const state = !mounted ? '' : visible ? 'is-visible' : 'is-hidden'
  const Tag = as
  const computedDelay = delay ?? Math.min(index * 80, 640)
  const mergedStyle: CSSProperties = { transitionDelay: `${computedDelay}ms`, ...(style || {}) }

  return (
    <Tag ref={ref as never} className={`editable-reveal ${state} ${className}`} style={mergedStyle}>
      {children}
    </Tag>
  )
}
