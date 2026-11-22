import { useEffect, useRef } from 'react'
import { CATEGORIES } from '../data/photos.js'
import { getNeighbors } from '../data/photoQueries.js'

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' })

export default function Lightbox({ photo, list = [], onClose, onNavigate, onRestoreFocus }) {
  const dialogRef = useRef(null)
  const lastShownId = useRef(null)

  // Synchronizes the native <dialog> (external system) with the URL-derived photo.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (photo) {
      lastShownId.current = photo.id
      if (!dialog.open) dialog.showModal()
    } else {
      if (dialog.open) dialog.close()
      if (lastShownId.current) {
        onRestoreFocus?.(lastShownId.current)
        lastShownId.current = null
      }
    }
  }, [photo, onRestoreFocus])

  function handleKeyDown(event) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return
    if (event.key === 'ArrowLeft' && prev) {
      event.preventDefault()
      onNavigate?.(prev.id)
    } else if (event.key === 'ArrowRight' && next) {
      event.preventDefault()
      onNavigate?.(next.id)
    }
  }

  function handleClick(event) {
    // Padding is 0 on <dialog>, so a click whose target is the dialog itself is a backdrop click.
    if (event.target === event.currentTarget) dialogRef.current.close()
  }

  const { prev, next } = photo ? getNeighbors(list, photo.id) : { prev: null, next: null }
  const position = photo ? list.findIndex((p) => p.id === photo.id) + 1 : 0
  const category = photo && CATEGORIES.find((c) => c.slug === photo.category)

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-labelledby="lightbox-title"
      onClose={onClose}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {photo && (
        <div className="lightbox__inner">
          <button
            type="button"
            className="lightbox__close"
            aria-label="Close photo"
            onClick={() => dialogRef.current.close()}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
              <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>
          {next && <link rel="preload" as="image" href={next.full} />}
          {prev && (
            <button
              type="button"
              className="lightbox__nav lightbox__nav--prev"
              aria-label={`Previous photo: ${prev.title}`}
              onClick={() => onNavigate?.(prev.id)}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                <path d="M15 4l-8 8 8 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {next && (
            <button
              type="button"
              className="lightbox__nav lightbox__nav--next"
              aria-label={`Next photo: ${next.title}`}
              onClick={() => onNavigate?.(next.id)}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false">
                <path d="M9 4l8 8-8 8" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          <figure className="lightbox__figure">
            <img src={photo.full} width={photo.width} height={photo.height} alt={photo.alt} />
            <figcaption>
              <h2 id="lightbox-title">{photo.title}</h2>
              {position > 0 && (
                <p className="lightbox__position" aria-live="polite">
                  {position} of {list.length}
                </p>
              )}
              <p>
                {photo.caseRef} &middot; <time dateTime={photo.takenAt}>{dateFormat.format(new Date(photo.takenAt))}</time>
              </p>
              <dl className="lightbox__meta">
                <div>
                  <dt>Format</dt>
                  <dd>WebP image</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{category?.label}</dd>
                </div>
                <div>
                  <dt>Dimensions</dt>
                  <dd>
                    {photo.width} &times; {photo.height} px
                  </dd>
                </div>
              </dl>
            </figcaption>
          </figure>
        </div>
      )}
    </dialog>
  )
}
