import { Outlet } from 'react-router-dom'
import MemberHeader from './MemberHeader'
import Footer from './Footer'

const MemberLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-primary-50 to-primary-100">
      <MemberHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default MemberLayout
