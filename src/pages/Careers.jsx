import CareersHero from '../components/sections/careers/CareersHero'
import CareersApplications from '../components/sections/careers/CareersApplications'
import CareersOverview from '../components/sections/careers/CareersOverview'
import CareersBenefits from '../components/sections/careers/CareersBenefits'
import CareersContact from '../components/sections/careers/CareersContact'

const Careers = () => {
  return (
    <main>
      <CareersHero />
      <CareersApplications />
      <CareersOverview />
      <CareersBenefits />
      <CareersContact />
    </main>
  )
}

export default Careers
