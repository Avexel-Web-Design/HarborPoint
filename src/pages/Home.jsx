import Cover from '../components/sections/home/Cover'
import Hero from '../components/sections/home/Hero'
import Welcome from '../components/sections/home/Welcome'
import GolfCourses from '../components/sections/home/GolfCourses'
import Lifestyle from '../components/sections/home/Lifestyle'
import CallToAction from '../components/sections/home/CallToAction'

const Home = () => {
  return (
    <div>
      <Cover />
      <Hero />
      <Welcome />
      <GolfCourses />
      <Lifestyle />
      <CallToAction />
    </div>
  )
}

export default Home
