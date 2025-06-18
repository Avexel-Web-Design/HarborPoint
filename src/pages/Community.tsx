import CommunityHero from '../components/sections/community/CommunityHero'
import CommunityOverview from '../components/sections/community/CommunityOverview'
import PropertyTypes from '../components/sections/community/PropertyTypes'
import NewConstruction from '../components/sections/community/NewConstruction'
import CommunityRentals from '../components/sections/community/CommunityRentals'
import CommunityAmenities from '../components/sections/community/CommunityAmenities'
import CommunityContact from '../components/sections/community/CommunityContact'

const Community = () => {
  return (
    <>
      <CommunityHero />
      <CommunityOverview />
      <PropertyTypes />
      <NewConstruction />
      <CommunityRentals />
      <CommunityAmenities />
      <CommunityContact />
    </>
  )
}

export default Community
