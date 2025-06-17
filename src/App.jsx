import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Golf from './pages/Golf'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="/golf" element={<Golf />} />
        {/* <Route path="/dining" element={<Dining />} /> */}
        {/* <Route path="/events" element={<Events />} /> */}
        {/* <Route path="/membership" element={<Membership />} /> */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
      </Route>
    </Routes>
  )
}

export default App
