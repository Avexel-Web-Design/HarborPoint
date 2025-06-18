import GolfHero from '../components/sections/golf/GolfHero'
import GolfOverview from '../components/sections/golf/GolfOverview'
import CoursesDetail from '../components/sections/golf/CoursesDetail'
import GolfAmenities from '../components/sections/golf/GolfAmenities'
import GolfMembership from '../components/sections/golf/GolfMembership'

const Golf = () => {
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
