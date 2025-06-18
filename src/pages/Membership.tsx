import MembershipHero from '../components/sections/membership/MembershipHero'
import MembershipOverview from '../components/sections/membership/MembershipOverview'
import MembershipTypes from '../components/sections/membership/MembershipTypes'
import MembershipContact from '../components/sections/membership/MembershipContact'

const Membership = () => {
  return (
    <div>
      <MembershipHero />
      <MembershipOverview />
      <MembershipTypes />
      <MembershipContact />
    </div>
  )
}

export default Membership
