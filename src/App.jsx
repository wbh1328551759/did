import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import MyDIDs from './pages/MyDIDs'
import DIDDetail from './pages/DIDDetail'
import NotificationContainer from './components/Notification'
import useNotification from './hooks/useNotification'
import './App.css'

function App() {
  const notification = useNotification()

  return (
    <div className="app-shell">
      <Router>
        <Routes>
          <Route path="/" element={<Landing notification={notification} />} />
          <Route path="/my-dids" element={<MyDIDs notification={notification} />} />
          <Route path="/detail/:id" element={<DIDDetail notification={notification} />} />
        </Routes>
      </Router>
      <NotificationContainer 
        notifications={notification.notifications}
        onClose={notification.removeNotification}
      />
    </div>
  )
}

export default App
