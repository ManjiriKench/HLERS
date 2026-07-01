import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import EmergencyForm from './pages/EmergencyForm'
import HospitalList from './pages/HospitalList'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/emergency" element={<EmergencyForm />} />
      <Route path="/hospitals" element={<HospitalList />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App