import React from 'react'
import { createRoot } from 'react-dom/client'
import ThreeDEvents from './components/ThreeDEvents'
import './styles.css'

const events = [
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
