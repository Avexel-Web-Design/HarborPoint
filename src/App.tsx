import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Golf from './pages/Golf'
import Lifestyle from './pages/Lifestyle'
import Events from './pages/Events'
import Membership from './pages/Membership'
import About from './pages/About'
import Contact from './pages/Contact'
import Careers from './pages/Careers'

function App() {
  return (    <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/golf" element={<Golf />} />
        <Route path="/lifestyle" element={<Lifestyle />} />
        <Route path="/events" element={<Events />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/careers" element={<Careers />} />
      </Route>
    </Routes>
  )
}

export default App
