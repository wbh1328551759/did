import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MyDIDs from './pages/MyDIDs'
import DIDDetail from './pages/DIDDetail'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/my-dids" element={<MyDIDs />} />
          <Route path="/detail/:id" element={<DIDDetail />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
