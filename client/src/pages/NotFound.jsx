import { useNavigate } from 'react-router-dom'
import './NotFound.css'

function NotFound() {
    const navigate= useNavigate()
    return (
        <div className="notfound-container">
            <div className="notfound-content">
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">Page not found</h2>
                <p className="notfound-message">
                    This page doesn't exist. In an emergency, every second counts, don't waste them here.
                </p>
                <button
                    className="notfound-btn"
                    onClick={() => navigate('/')}>Go to Home</button>
            </div>
        </div>
    )
}
export default NotFound 