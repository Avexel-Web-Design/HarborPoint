import LifestyleHero from '../components/sections/lifestyle/LifestyleHero'
import LifestyleOverview from '../components/sections/lifestyle/LifestyleOverview'
import RacquetSports from '../components/sections/lifestyle/RacquetSports'
import PoolFitness from '../components/sections/lifestyle/PoolFitness'
import DiningWellness from '../components/sections/lifestyle/DiningWellness'
import ClubsTrails from '../components/sections/lifestyle/ClubsTrails'

const Lifestyle = () => {
  return (
    <div>
      <LifestyleHero />
      <LifestyleOverview />
      <RacquetSports />
      <PoolFitness />
      <DiningWellness />
      <ClubsTrails />
    </div>
  )
}

export default Lifestyle
