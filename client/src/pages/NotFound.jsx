import { useNavigate } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="notfound-container">
      <div className="notfound-content">
        <h1 className="notfound-code">404</h1>
        <h2 className="notfound-title">Page Not Found</h2>
        <p className="notfound-message">
          This page doesn't exist. In a medical emergency, every second counts—please return to safety or report an emergency immediately.
        </p>
        <div className="notfound-actions">
          <button className="notfound-btn primary" onClick={() => navigate('/emergency')}>
            Report Emergency
          </button>
          <button className="notfound-btn secondary" onClick={() => navigate('/')}>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotFound