export default function PageSkeleton({ variant = 'text' }) {
  return (
    <div
      className={`page-skeleton page-skeleton--${variant}`}
      aria-busy="true"
      aria-live="polite"
    >
      <span className="visually-hidden">Loading...</span>
      <div className="skeleton-block skeleton-title" aria-hidden="true" />
      {variant === 'gallery' ? (
        <div className="skeleton-grid" aria-hidden="true">
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="skeleton-block skeleton-tile" />
          ))}
        </div>
      ) : (
        <div className="skeleton-lines" aria-hidden="true">
          <div className="skeleton-block skeleton-line" />
          <div className="skeleton-block skeleton-line" />
          <div className="skeleton-block skeleton-line skeleton-line--short" />
        </div>
      )}
    </div>
  )
}
