import { useEffect, useRef, useState } from 'react'
import './App.css'

const featureCards = [
  {
    title: 'Signal clarity',
    label: 'Realtime signals',
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Priority engine',
    label: 'Auto-prioritized',
    image:
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Retention loops',
    label: 'Customer led',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Launch velocity',
    label: 'Ship faster',
    image:
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80',
  },
]

const metrics = [
  { value: '3.2x', label: 'faster launches' },
  { value: '98%', label: 'deployment confidence' },
  { value: '24/7', label: 'team visibility' },
]

function App() {
  const [rotation, setRotation] = useState(18)
  const dragStart = useRef(null)
  const velocityRef = useRef(0)
  const rotationRef = useRef(rotation)

  useEffect(() => {
    rotationRef.current = rotation
  }, [rotation])

  useEffect(() => {
    let rafId = 0

    const tick = () => {
      if (Math.abs(velocityRef.current) > 0.04) {
        setRotation((current) => current + velocityRef.current)
        velocityRef.current *= 0.9
      } else {
        velocityRef.current = 0
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [])

  const total = featureCards.length
  const step = 360 / total

  const moveByStep = (direction) => {
    setRotation((current) => current + step * direction)
    velocityRef.current = 0
  }

  const handleWheel = (event) => {
    event.preventDefault()
    const nextVelocity = event.deltaY * 0.04
    velocityRef.current += nextVelocity
    velocityRef.current = Math.max(-2.4, Math.min(2.4, velocityRef.current))
    setRotation((current) => current + nextVelocity)
  }

  const handlePointerDown = (event) => {
    dragStart.current = {
      x: event.clientX,
      y: event.clientY,
      rotation: rotationRef.current,
    }
    velocityRef.current = 0
  }

  const handlePointerMove = (event) => {
    if (!dragStart.current) return

    const diff = event.clientY - dragStart.current.y
    const nextRotation = dragStart.current.rotation + diff * 0.18
    velocityRef.current = diff * 0.07
    setRotation(nextRotation)
  }

  const handlePointerUp = (event) => {
    if (!dragStart.current) {
      return
    }

    const deltaX = event.clientX - dragStart.current.x
    const deltaY = event.clientY - dragStart.current.y
    const tapThreshold = 12

    if (Math.abs(deltaX) < tapThreshold && Math.abs(deltaY) < tapThreshold) {
      const rect = event.currentTarget.getBoundingClientRect()
      const direction = event.clientX < rect.left + rect.width / 2 ? -1 : 1
      moveByStep(direction)
    }

    dragStart.current = null
  }

  const normalizedRotation = ((rotation % 360) + 360) % 360
  const activeIndex = Math.round(((360 - normalizedRotation + step / 2) % 360) / step) % total

  return (
    <div className="landing-page">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark">N</div>
          <span className="brand-name">Northstar</span>
        </div>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#platform">Platform</a>
          <a href="#experience">Motion</a>
          <a href="#results">Proof</a>
        </nav>

        <div className="topbar-actions">
          <button type="button" className="ghost-button">
            Sign in
          </button>
          <button type="button" className="primary-button">
            Request access
          </button>
        </div>
      </header>

      <main className="page-shell">
        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow">Built for decisive teams</span>
            <h1>Where product motion becomes momentum.</h1>
            <p>
              Northstar gives strategy, execution, and customer insight one shared rhythm,
              so your team can move faster without losing clarity.
            </p>

            <div className="cta-row">
              <button type="button" className="primary-button large">
                Try the platform
              </button>
              <button type="button" className="ghost-button large">
                See the product
              </button>
            </div>

            <div className="metric-row" id="results">
              {metrics.map((metric) => (
                <div key={metric.label} className="metric-pill">
                  <strong>{metric.value}</strong>
                  <span>{metric.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-visual" id="platform">
            <div className="glass-panel">
              <div className="panel-header">
                <span className="window-dot red"></span>
                <span className="window-dot amber"></span>
                <span className="window-dot green"></span>
              </div>

              <div className="mini-dashboard">
                <div className="mini-chart">
                  <div className="chart-bar bar-one"></div>
                  <div className="chart-bar bar-two"></div>
                  <div className="chart-bar bar-three"></div>
                  <div className="chart-bar bar-four"></div>
                  <div className="chart-bar bar-five"></div>
                  <div className="chart-bar bar-six"></div>
                </div>

                <div className="mini-cards">
                  <div className="mini-card">
                    <span>Revenue</span>
                    <strong>$1.2M</strong>
                  </div>
                  <div className="mini-card accent">
                    <span>Velocity</span>
                    <strong>+34%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="orbit-section" id="experience">
          <div className="section-heading">
            <span className="eyebrow">The motion layer</span>
            <h2>A responsive orbit that keeps the work in motion.</h2>
          </div>

          <div
            className="orbit-stage"
            onWheel={handleWheel}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            <div className="orbit-ring">
              {featureCards.map((item, index) => {
                const angle = index * step + rotation
                const radians = (angle * Math.PI) / 180
                const x = Math.cos(radians) * 220
                const y = Math.sin(radians) * 170
                const depth = Math.sin(radians + Math.PI / 2) * 180
                const isActive = index === activeIndex
                const scale = isActive ? 1.06 : 0.72 + ((depth + 180) / 360) * 0.26
                const opacity = isActive ? 1 : 0.72 + ((depth + 180) / 360) * 0.18
                const rotateY = isActive ? 0 : -22
                const rotateX = isActive ? 0 : 18

                return (
                  <article
                    key={item.title}
                    className={`orbit-card ${isActive ? 'active' : ''}`}
                    style={{
                      zIndex: Math.round(100 + depth),
                      opacity,
                      transform: `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${depth}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`,
                    }}
                  >
                    <img src={item.image} alt={item.title} />
                    <div className="orbit-card-copy">
                      <span>{item.label}</span>
                      <h3>{item.title}</h3>
                    </div>
                  </article>
                )
              })}
            </div>

            <div className="orbit-core">
              <div className="core-glow"></div>
              <div className="core-content">
                <span className="core-kicker">Now focused on</span>
                <h3>{featureCards[activeIndex].title}</h3>
                <p>{featureCards[activeIndex].label}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
