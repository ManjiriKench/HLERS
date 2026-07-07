import {useNavigate} from 'react-router-dom'
import './Navbar.css'

function Navbar() {
    const navigate = useNavigate()
    return (
        <nav className="navbar">
            <h2 className="navbar-logo" onClick={() => navigate('/')}>
            HLERS
            </h2>
            <button
            className="navbar-btn"
            onClick={() => navigate('/emergency')}>
                Report Emergency
            </button>
            </nav>
    )
}
export default Navbar