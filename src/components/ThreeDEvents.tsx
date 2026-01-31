import React, { useState } from 'react'
import RegistrationModal from './RegistrationModal'

type EventData = {
  title: string;
  imageSeed?: string;
  details?: string;
}

type ThreeDEventsProps = {
  events: (string | EventData)[]
}

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');
}

function Card({ title, idx, details }: { title: string; idx: number; details?: string }) {
  const slug = slugify(title)
  const href = `/events/${slug}.html`
  return (
    <div className="card-3d-wrap" tabIndex={0}>
      <div className="card-3d">
        <div className="card-media" style={{ backgroundImage: `url(https://picsum.photos/seed/${idx}/800/600)` }} />
        <div className="card-body">
          <div className="card-title">{title}</div>
          <div className="card-desc">{details ? 'Click to see details' : `An electrifying experience — ${title} at Infinitus.`}</div>
          <div className="card-actions"><span className="card-link">Learn more</span></div>
        </div>
      </div>
    </div>
  )
}

export default function ThreeDEvents({ events = [] }: ThreeDEventsProps) {
  const [gallery, setGallery] = useState(false)
  const [lightbox, setLightbox] = useState<{ src: string; title: string; details?: string } | null>(null)
  const [registering, setRegistering] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const normalizedEvents: EventData[] = events.map((e, i) =>
    typeof e === 'string' ? { title: e, imageSeed: String(i) } : e
  )

  return (
    <section className="react-events">
      <div className="events-controls">
        <button className="control-btn" onClick={() => setGallery(g => !g)}>{gallery ? 'Card view' : 'Gallery view'}</button>
      </div>

      {gallery ? (
        <div className="gallery-grid">
          {normalizedEvents.map((e, i) => {
            const seed = e.imageSeed || i
            const srcSmall = `https://picsum.photos/seed/${seed}/400/300`
            const srcLarge = `https://picsum.photos/seed/${seed}/1200/800`
            return (
              <div key={i} className="gallery-item" onClick={() => setLightbox({ src: srcLarge, title: e.title, details: e.details })}>
                <img loading="lazy" src={srcSmall} srcSet={`${srcSmall} 400w, ${srcLarge} 1200w`} sizes="(max-width:600px) 100vw, 33vw" alt={e.title} />
                <div className="gallery-caption">{e.title}</div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="events-grid">
          {normalizedEvents.map((e, i) => (
            <div key={i} onClick={() => {
              const seed = e.imageSeed || i
              setLightbox({ src: `https://picsum.photos/seed/${seed}/1200/800`, title: e.title, details: e.details })
            }}>
              <Card title={e.title} idx={i} details={e.details} />
            </div>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="lightbox-overlay" style={{
          position: 'fixed', inset: 0, zIndex: 10002, background: 'rgba(11,10,26,0.95)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px',
          overflowY: 'auto', backdropFilter: 'blur(10px)'
        }} onClick={() => setLightbox(null)}>
          <div className="lb-content" style={{ maxWidth: '900px', width: '100%', display: 'flex', gap: '32px', flexWrap: 'wrap', alignItems: 'flex-start' }} onClick={e => e.stopPropagation()}>
            <button style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: 'white', fontSize: '40px', cursor: 'pointer' }} onClick={() => setLightbox(null)}>&times;</button>
            <div style={{ flex: '1', minWidth: '300px' }}>
              <img src={lightbox.src} alt={lightbox.title} style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)' }} />
            </div>
            <div style={{ flex: '1.2', minWidth: '300px', textAlign: 'left' }}>
              <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: '#eae8ff' }}>{lightbox.title}</h2>
              <div style={{ lineHeight: '1.6', color: 'rgba(234,232,255,0.9)', fontSize: '1rem', marginBottom: '24px' }} dangerouslySetInnerHTML={{ __html: lightbox.details || `<p>An electrifying experience — ${lightbox.title} at Infinitus. Explore the futuristic world of ${lightbox.title} with high-tech displays and immersive activities.</p>` }} />
              <button
                onClick={() => { setRegistering(lightbox.title); setLightbox(null); }}
                style={{
                  padding: '14px 28px', background: 'linear-gradient(90deg, #38bdf8, #a855f7)',
                  border: 'none', color: '#fff', fontWeight: '800', borderRadius: '8px', cursor: 'pointer',
                  fontSize: '1.1rem', boxShadow: '0 10px 20px rgba(56, 189, 248, 0.2)'
                }}
              >
                Register Now
              </button>
            </div>
          </div>
        </div>
      )}

      {registering && (
        <RegistrationModal
          eventName={registering}
          onClose={() => setRegistering(null)}
          onSuccess={() => {
            setRegistering(null);
            setSuccess(`Successfully registered for ${registering}!`);
            setTimeout(() => setSuccess(null), 5000);
          }}
        />
      )}

      {success && (
        <div style={{
          position: 'fixed', bottom: '24px', right: '24px', zIndex: 11001,
          background: 'rgba(34, 197, 94, 0.1)', color: '#4ade80',
          padding: '16px 24px', borderRadius: '12px', border: '1px solid rgba(34, 197, 94, 0.2)',
          backdropFilter: 'blur(10px)', boxShadow: '0 10px 30px rgba(34, 197, 94, 0.1)',
          animation: 'slideIn 0.3s ease-out'
        }}>
          {success}
        </div>
      )}

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </section>
  )
}
