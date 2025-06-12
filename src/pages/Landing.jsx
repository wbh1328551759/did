import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LandingHeader from '../components/LandingHeader'
import HeroSection from '../components/HeroSection'
import LandingBackgroundEffects from '../components/LandingBackgroundEffects'

const Landing = ({ notification }) => {
  const navigate = useNavigate()
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  const handleLaunchDID = () => {
    navigate('/my-dids')
  }

  return (
    <div className="page landing-page">
      {/* Background Effects */}
      <LandingBackgroundEffects mousePosition={mousePosition} />

      {/* Brand logo */}
      <LandingHeader isLoaded={isLoaded} />

      {/* Main content */}
      <HeroSection isLoaded={isLoaded} onLaunchDID={handleLaunchDID} />

    </div>
  )
}

export default Landing
