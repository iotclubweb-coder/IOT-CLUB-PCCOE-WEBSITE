import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import SmoothScroll from './components/layout/SmoothScroll'
import ScrollToTop from './components/layout/ScrollToTop'
import Navbar from './components/layout/Navbar'
import LoadingScreen from './components/layout/LoadingScreen'
import ScrollSection from './components/layout/ScrollSection'
import Footer from './components/layout/Footer'

// Pages
import Home from './pages/Home'
import Projects from './pages/Projects'
import EventsPage from './pages/EventsPage'
import TeamPage from './pages/TeamPage'
import Gallery from './pages/Gallery'
import Blogs from './pages/Blogs'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminLogin from './pages/admin/AdminLogin'

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/projects" element={<PageWrapper><Projects /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><EventsPage /></PageWrapper>} />
        <Route path="/team" element={<PageWrapper><TeamPage /></PageWrapper>} />
        <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
        <Route path="/blogs" element={<PageWrapper><Blogs /></PageWrapper>} />
        <Route path="/admin" element={<AdminGuard />} />
      </Routes>
    </AnimatePresence>
  )
}

function AdminGuard() {
  const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem('iot_admin_auth') === 'true')

  if (!isAuthed) {
    return <AdminLogin onLogin={() => setIsAuthed(true)} />
  }

  return <AdminDashboard />
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-screen"
    >
      {children}

      {/* Footer is global now, but could be inside pages if needed. Keeping it here for consistency. */}
      <ScrollSection>
        <Footer />
      </ScrollSection>
    </motion.div>
  )
}

function AppContent() {
  const location = useLocation()
  const isAdmin = location.pathname.startsWith('/admin')

  return (
    <>
      {!isAdmin && <Navbar />}
      <AnimatedRoutes />
    </>
  )
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <Router>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px'
          }
        }} 
      />
      <AnimatePresence mode="wait">
        {isLoading ? (
          <LoadingScreen key="loader" onComplete={() => setIsLoading(false)} />
        ) : (
          <SmoothScroll key="content">
            <ScrollToTop />
            <AppContent />
          </SmoothScroll>
        )}
      </AnimatePresence>
    </Router>
  )
}

export default App
