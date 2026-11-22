import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import CategoryFilter from '../components/CategoryFilter.jsx'
import PhotoGrid from '../components/PhotoGrid.jsx'
import { CATEGORIES } from '../data/photos.js'
import { getPhotosByCategory } from '../data/photoQueries.js'

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category')

  // Derived during render: an unknown category behaves like "All".
  const active = CATEGORIES.find((c) => c.slug === category) ?? null
  const photos = useMemo(() => getPhotosByCategory(active?.slug), [active])

  function handleChange(slug) {
    setSearchParams((prev) => {
      if (slug) prev.set('category', slug)
      else prev.delete('category')
      return prev
    })
  }

  return (
    <div className="page page--gallery">
      <title>Gallery | Evidence Gallery</title>
      <h1>Gallery</h1>
      <CategoryFilter activeCategory={active?.slug ?? null} onChange={handleChange} />
      <p role="status" className="result-count">
        Showing {photos.length} photos in {active ? active.label : 'all categories'}
      </p>
      <PhotoGrid photos={photos} />
    </div>
  )
}
