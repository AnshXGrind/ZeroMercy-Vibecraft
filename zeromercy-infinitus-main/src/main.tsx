import React from 'react'
import { createRoot } from 'react-dom/client'
import ThreeDEvents from './components/ThreeDEvents'
import './styles.css'

const events: string[] = [
  'Car Rally',
  'Music night',
  'Dj Campfire',
  'Game night',
  'Movie night',
  'Inauguration ceremony',
  'Super car expo',
  'Dj nights'
]

function mount() {
  const el = document.getElementById('react-root')
  if (!el) return
  const root = createRoot(el)
  root.render(<ThreeDEvents events={events} />)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount)
} else {
  mount()
}

// Global tilt interaction: mirror previously-embedded behavior
function addTilt() {
  const tilt = (e: MouseEvent) => {
    document.querySelectorAll<HTMLElement>('.card-3d').forEach(card => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transform = `rotateY(${x * 12}deg) rotateX(${-y * 12}deg)`
    })
  }

  document.addEventListener('mousemove', tilt)
  document.addEventListener('mouseleave', () => { document.querySelectorAll<HTMLElement>('.card-3d').forEach(c => c.style.transform = 'none') })
}

addTilt()
