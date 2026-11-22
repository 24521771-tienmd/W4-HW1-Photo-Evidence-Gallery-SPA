import { CATEGORIES } from '../data/photos.js'

export default function CategoryFilter({ activeCategory = null, onChange }) {
  const options = [{ slug: null, label: 'All' }, ...CATEGORIES]
  return (
    <fieldset className="category-filter">
      <legend>Filter by category</legend>
      <div className="category-filter__buttons">
        {options.map(({ slug, label }) => (
          <button
            key={label}
            type="button"
            className="filter-button"
            aria-pressed={slug === activeCategory}
            onClick={() => onChange(slug)}
          >
            {label}
          </button>
        ))}
      </div>
    </fieldset>
  )
}
