import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router'
import RootLayout from './layouts/RootLayout.jsx'
import PageSkeleton from './components/PageSkeleton.jsx'
import Home from './pages/Home.jsx'

const Gallery = lazy(() => import('./pages/Gallery.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const NotFound = lazy(() => import('./pages/NotFound.jsx'))

export default function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route index element={<Home />} />
        <Route
          path="gallery"
          element={
            <Suspense fallback={<PageSkeleton variant="gallery" />}>
              <Gallery />
            </Suspense>
          }
        />
        <Route
          path="about"
          element={
            <Suspense fallback={<PageSkeleton variant="text" />}>
              <About />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<PageSkeleton variant="text" />}>
              <NotFound />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  )
}
