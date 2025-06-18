import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import GolfHero from '../components/sections/golf/GolfHero'
import GolfOverview from '../components/sections/golf/GolfOverview'
import CoursesDetail from '../components/sections/golf/CoursesDetail'
import GolfAmenities from '../components/sections/golf/GolfAmenities'
import GolfMembership from '../components/sections/golf/GolfMembership'

const Golf = () => {
  const location = useLocation()

  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1))
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }, [location])

  return (
    <div>
      <GolfHero />
      <GolfOverview />
      <CoursesDetail />
      <GolfAmenities />
      <GolfMembership />
    </div>
  )
}

export default Golf
