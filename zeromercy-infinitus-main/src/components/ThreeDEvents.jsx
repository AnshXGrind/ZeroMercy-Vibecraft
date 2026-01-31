import React from 'react'

function Card({title, idx}){
  return (
    <div className="card-3d-wrap" tabIndex={0}>
      <div className="card-3d">
        <div className="card-media" style={{backgroundImage:`url(https://source.unsplash.com/collection/190727/800x600?sig=${idx})`}} />
        <div className="card-body">
          <div className="card-title">{title}</div>
          <div className="card-desc">An electrifying experience — {title} at Infinitus.</div>
          <div className="card-actions"><a className="card-link" href="#">Learn more</a></div>
        </div>
      </div>
    </div>
  )
}

export default function ThreeDEvents({events = []}){
  return (
    <section className="react-events">
      <div className="events-grid">
        {events.map((e,i)=>(<Card key={i} title={e} idx={i}/>))}
      </div>
    </section>
  )
}
