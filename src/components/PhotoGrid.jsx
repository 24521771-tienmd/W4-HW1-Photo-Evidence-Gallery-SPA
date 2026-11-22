const EAGER_COUNT = 4 // approximate first row; the rest are lazy-loaded

export default function PhotoGrid({ photos = [] }) {
  return (
    <ul className="photo-grid" aria-label="Photos">
      {photos.map((photo, index) => (
        <li key={photo.id}>
          <button type="button" className="photo-card">
            <img
              src={photo.thumb}
              srcSet={`${photo.thumb} 400w, ${photo.full} 1200w`}
              sizes="(max-width: 30rem) 100vw, 280px"
              width={400}
              height={300}
              alt={photo.alt}
              loading={index < EAGER_COUNT ? undefined : 'lazy'}
              fetchPriority={index === 0 ? 'high' : undefined}
              decoding="async"
            />
            <span className="photo-card__caption">
              <span className="photo-card__title">{photo.title}</span>
              <span className="photo-card__ref">{photo.caseRef}</span>
            </span>
          </button>
        </li>
      ))}
    </ul>
  )
}
