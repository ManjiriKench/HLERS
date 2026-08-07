import { useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  return (
    <header className="navbar">
      <div className="navbar-left" onClick={() => navigate('/')}>
        <span className="navbar-dot"></span>
        <span className="navbar-logo">HLERS</span>
      </div>
      <div className="navbar-right">
        <button
          className="navbar-btn"
          onClick={() => navigate('/emergency')}
        >
          Report Emergency
        </button>
      </div>
    </header>
  )
}

export default Navbar