import { useNavigate } from 'react-router-dom'
import './Home.css'
function Home() {
    const navigate = useNavigate()

    return(
        <div className="home-container">
            <div className="home-content">
            <div className="home-header">
                <h1>HLERS</h1>
                <p className="tagline">HyperLocal Emergency Routing System</p>
            </div>
            <div className="home-problem">
                <p>
                    When someone has a medical emergency, Google Maps shows the <em>
                    nearest</em> hospital - not the <em> right </em> one.
                </p>
                <p>
                    HLERS finds the hospital that can actually help you <strong> right now </strong> based on real-time ICU availability, specialist status, and live travel time.
                </p>
            </div>
            <button
            className="emergency-btn"
            onClick={()=> navigate('/emergency')}
            >Report Emergency</button>
            <p className="disclaimer">For real emergencies, also call<strong>108</strong>
            </p>
                
            </div>
        </div>
    )
}
export default Home