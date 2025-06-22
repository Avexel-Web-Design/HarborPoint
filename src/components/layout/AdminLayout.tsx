import { Outlet } from 'react-router-dom'
import AdminHeader from './AdminHeader'
import Footer from './Footer'

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-primary-50 to-primary-100">
      <AdminHeader />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default AdminLayout
