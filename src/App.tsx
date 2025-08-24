import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import Golf from './pages/Golf'
import Events from './pages/Events'
import Membership from './pages/Membership'
import About from './pages/About'
import Contact from './pages/Contact'

// Member components
import Login from './components/auth/Login'
import ProtectedRoute from './components/auth/ProtectedRoute'
import MemberDashboard from './pages/members/Dashboard'
import MemberLayout from './components/layout/MemberLayout'

// Admin components
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProtectedRoute from './components/admin/AdminProtectedRoute'
import AdminLayout from './components/layout/AdminLayout'

// Auth Context Providers
import { AuthProvider } from './contexts/AuthContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'

function App() {
  return (
    <AuthProvider>
      <AdminAuthProvider>
        <Routes>
          {/* Public routes with main layout */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/golf" element={<Golf />} />
            <Route path="/events" element={<Events />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Route>          {/* Member authentication routes (no layout) */}
          <Route path="/members/login" element={<Login />} />
          
          {/* Protected member area routes with MemberLayout */}
          <Route path="/members" element={
            <ProtectedRoute>
              <MemberLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<MemberDashboard />} />
          </Route>
          
          {/* Legacy member routes - redirect to dashboard */}
          <Route path="/members/profile" element={<Navigate to="/members/dashboard" replace />} />
          <Route path="/members/events" element={<Navigate to="/members/dashboard" replace />} />
          <Route path="/members/tee-times" element={<Navigate to="/members/dashboard" replace />} />
          <Route path="/members/dining" element={<Navigate to="/members/dashboard" replace />} />          {/* Admin authentication routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Protected admin routes with AdminLayout */}
          <Route path="/admin" element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
          </Route>
        </Routes>
      </AdminAuthProvider>
    </AuthProvider>
  )
}

export default App
