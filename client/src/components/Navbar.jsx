import { useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="navbar-wrapper">
      <div className="navbar-island">
        <div className="navbar-left" onClick={() => navigate('/')}>
          <div className="brand-badge-wrap">
            <span className="brand-dot"></span>
          </div>
          <div className="brand-text-stack">
            <span className="navbar-logo">HLERS</span>
            <span className="navbar-tagline">Emergency Dispatch</span>
          </div>
        </div>

        <div className="navbar-center-status">
          <span className="grid-status-beacon"></span>
          <span className="grid-status-text">24/7 Live Hospital Grid Active</span>
        </div>

        <div className="navbar-right">
          <a href="tel:108" className="navbar-108-link">
            Helpline 108
          </a>
          <button
            className="navbar-btn"
            onClick={() => navigate('/emergency')}
          >
            Report Emergency
          </button>
        </div>
      </div>
    </header>
  )
}

export default Navbar