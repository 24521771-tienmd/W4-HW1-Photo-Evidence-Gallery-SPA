import { useEffect, useRef } from 'react'
import { CATEGORIES } from '../data/photos.js'

const dateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'long', timeZone: 'UTC' })

export default function Lightbox({ photo, onClose }) {
  const dialogRef = useRef(null)

  // Synchronizes the native <dialog> (external system) with the URL-derived photo.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (photo && !dialog.open) dialog.showModal()
    else if (!photo && dialog.open) dialog.close()
  }, [photo])

  function handleClick(event) {
    // Padding is 0 on <dialog>, so a click whose target is the dialog itself is a backdrop click.
    if (event.target === event.currentTarget) dialogRef.current.close()
  }

  const category = photo && CATEGORIES.find((c) => c.slug === photo.category)

  return (
    <dialog
      ref={dialogRef}
      className="lightbox"
      aria-labelledby="lightbox-title"
      onClose={onClose}
      onClick={handleClick}
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
          <figure className="lightbox__figure">
            <img src={photo.full} width={photo.width} height={photo.height} alt={photo.alt} />
            <figcaption>
              <h2 id="lightbox-title">{photo.title}</h2>
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
