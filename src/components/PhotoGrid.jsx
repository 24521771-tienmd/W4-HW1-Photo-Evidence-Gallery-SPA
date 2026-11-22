const EAGER_COUNT = 8 // roughly the first two rows on desktop; the rest are lazy-loaded
const HIGH_PRIORITY_COUNT = 4 // approximately the first row

export default function PhotoGrid({ photos = [], onSelect, registerCard }) {
  return (
    <ul className="photo-grid" aria-label="Photos">
      {photos.map((photo, index) => (
        <li key={photo.id}>
          <button type="button" className="photo-card" ref={(el) => registerCard?.(photo.id, el)}
            onClick={() => onSelect?.(photo.id)}
          >
            <img
              src={photo.thumb}
              srcSet={`${photo.thumb} 400w, ${photo.full} 1200w`}
              sizes="(max-width: 30rem) 100vw, 280px"
              width={400}
              height={300}
              alt={photo.alt}
              loading={index < EAGER_COUNT ? undefined : 'lazy'}
              fetchPriority={index < HIGH_PRIORITY_COUNT ? 'high' : undefined}
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
