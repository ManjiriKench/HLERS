import { useNavigate } from 'react-router-dom'
import './Home.css'

function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      <nav className="home-nav">
        <div className="nav-logo">HLERS</div>
        <div className="nav-center">
          <span className="nav-brand">HLERS</span>
        </div>
        <div className="nav-right">
          <button className="nav-how">How it works</button>
          <div className="lang-selector">
            <button className="lang-btn active">EN</button>
            <button className="lang-btn">HI</button>
            <button className="lang-btn">MR</button>
          </div>
        </div>
      </nav>
      <section className="hero">
        <div className="hero-content">
          <p className="hero-eyebrow">Emergency Hospital Routing · Pune, India</p>
          <h1 className="hero-title">
            The <span className="highlight-teal">right</span> hospital.<br />
            Not just the <span className="highlight-red">nearest</span> one.
          </h1>
          <p className="hero-sub">
            When every second matters, HLERS finds the hospital that can
            actually help right now, based on live ICU availability,
            specialist status, and real driving time.
          </p>
          <button
            className="hero-cta"
            onClick={() => navigate('/emergency')}
          >
            Report Emergency
          </button>
        </div>
      </section>

      <footer className="home-footer">
        <p>
          HLERS is a decision support tool, not a replacement for emergency services.
        </p>
        <p>
          For life-threatening emergencies, always call{' '}
          <strong>108</strong> immediately.
        </p>
      </footer>

    </div>
  )
}

export default Home