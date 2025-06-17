import EventsHero from '../components/sections/events/EventsHero'
import EventsOverview from '../components/sections/events/EventsOverview'
import EventGallery from '../components/sections/events/EventVenues'
import EventContact from '../components/sections/events/EventContact'

const Events = () => {
  return (
    <div>
      <EventsHero />
      <EventsOverview />
      <EventGallery />
      <EventContact />
    </div>
  )
}

export default Events
