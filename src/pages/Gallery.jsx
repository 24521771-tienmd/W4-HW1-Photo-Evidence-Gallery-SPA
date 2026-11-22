import { useCallback, useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import CategoryFilter from '../components/CategoryFilter.jsx'
import Lightbox from '../components/Lightbox.jsx'
import PhotoGrid from '../components/PhotoGrid.jsx'
import { CATEGORIES } from '../data/photos.js'
import { getPhotoById, getPhotosByCategory } from '../data/photoQueries.js'

export default function Gallery() {
  const [searchParams, setSearchParams] = useSearchParams()
  const category = searchParams.get('category')
  const cardRefs = useRef(new Map())
  const headingRef = useRef(null)

  // Derived during render: an unknown category behaves like "All".
  const active = CATEGORIES.find((c) => c.slug === category) ?? null
  const photos = useMemo(() => getPhotosByCategory(active?.slug), [active])

  const photoId = searchParams.get('photoId')
  const selectedPhoto = getPhotoById(photoId)
  const photoNotFound = photoId !== null && !selectedPhoto

  function removePhotoId() {
    setSearchParams(
      (prev) => {
        prev.delete('photoId')
        return prev
      },
      { replace: true },
    )
  }

  function handleClose() {
    // Also fires when the dialog is closed programmatically after photoId is already gone.
    if (searchParams.has('photoId')) removePhotoId()
  }

  function handleSelect(id) {
    setSearchParams((prev) => {
      prev.set('photoId', id)
      return prev
    })
  }

  function handleNavigate(id) {
    setSearchParams(
      (prev) => {
        prev.set('photoId', id)
        return prev
      },
      { replace: true },
    )
  }

  const registerCard = useCallback((id, el) => {
    if (el) cardRefs.current.set(id, el)
    else cardRefs.current.delete(id)
  }, [])

  // Focus the last shown photo's grid button if it is in the list, else the page heading.
  const restoreFocus = useCallback((id) => {
    const card = cardRefs.current.get(id)
    if (card) card.focus()
    else headingRef.current?.focus()
  }, [])

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
      <h1 ref={headingRef} tabIndex={-1}>
        Gallery
      </h1>
      <CategoryFilter activeCategory={active?.slug ?? null} onChange={handleChange} />
      <p role="status" className="result-count">
        Showing {photos.length} photos in {active ? active.label : 'all categories'}
      </p>
      {photoNotFound && (
        <div role="status" className="not-found-note">
          <p>Photo &ldquo;{photoId}&rdquo; was not found.</p>
          <button type="button" className="filter-button" onClick={removePhotoId}>
            Clear selection
          </button>
        </div>
      )}
      <PhotoGrid photos={photos} onSelect={handleSelect} registerCard={registerCard} />
      <Lightbox
        photo={selectedPhoto}
        list={photos}
        onClose={handleClose}
        onNavigate={handleNavigate}
        onRestoreFocus={restoreFocus}
      />
    </div>
  )
}
