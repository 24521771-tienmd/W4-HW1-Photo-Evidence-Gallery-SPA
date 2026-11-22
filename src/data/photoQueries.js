import { PHOTOS } from './photos.js'

/** Photos in a category; an unknown or empty category yields all photos. */
export function getPhotosByCategory(category) {
  if (!category) return PHOTOS
  const matches = PHOTOS.filter((photo) => photo.category === category)
  return matches.length > 0 ? matches : PHOTOS
}

/** The photo with the given id, or undefined. */
export function getPhotoById(id) {
  return PHOTOS.find((photo) => photo.id === id)
}

/** Previous and next items in `list` relative to `id`, wrapping around. */
export function getNeighbors(list, id) {
  const index = list.findIndex((photo) => photo.id === id)
  if (index === -1) return { prev: null, next: null }
  return {
    prev: list[(index - 1 + list.length) % list.length],
    next: list[(index + 1) % list.length],
  }
}
