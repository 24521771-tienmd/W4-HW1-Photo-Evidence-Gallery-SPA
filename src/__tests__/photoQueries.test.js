import { CATEGORIES, PHOTOS } from '../data/photos.js'
import { getPhotosByCategory, getPhotoById, getNeighbors } from '../data/photoQueries.js'

describe('photo catalog', () => {
  it('has 4 categories and 24 photos, 6 per category', () => {
    expect(CATEGORIES.map((c) => c.slug)).toEqual(['documents', 'devices', 'locations', 'exhibits'])
    expect(PHOTOS).toHaveLength(24)
    for (const { slug } of CATEGORIES) {
      expect(PHOTOS.filter((p) => p.category === slug)).toHaveLength(6)
    }
  })

  it('has unique ids and unique, descriptive alt text', () => {
    expect(new Set(PHOTOS.map((p) => p.id)).size).toBe(24)
    expect(new Set(PHOTOS.map((p) => p.alt)).size).toBe(24)
    for (const p of PHOTOS) expect(p.alt.length).toBeGreaterThan(30)
  })

  it('has the full photo shape', () => {
    for (const p of PHOTOS) {
      expect(p).toMatchObject({ width: 1200, height: 900 })
      expect(p.thumb).toBe(`/photos/${p.id}-400.webp`)
      expect(p.full).toBe(`/photos/${p.id}-1200.webp`)
      expect(p.takenAt).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(Number.isNaN(Date.parse(p.takenAt))).toBe(false)
      expect(p.title).toBeTruthy()
      expect(p.caseRef).toBeTruthy()
    }
  })
})

describe('getPhotosByCategory', () => {
  it('returns only photos in the category', () => {
    const result = getPhotosByCategory('devices')
    expect(result).toHaveLength(6)
    expect(result.every((p) => p.category === 'devices')).toBe(true)
  })

  it.each([undefined, null, '', 'nope'])('returns all photos for %p', (value) => {
    expect(getPhotosByCategory(value)).toHaveLength(24)
  })
})

describe('getPhotoById', () => {
  it('finds a photo', () => {
    expect(getPhotoById('dev-03')).toMatchObject({ id: 'dev-03', category: 'devices' })
  })

  it('returns undefined when missing', () => {
    expect(getPhotoById('zzz-99')).toBeUndefined()
    expect(getPhotoById(undefined)).toBeUndefined()
  })
})

describe('getNeighbors', () => {
  const list = [{ id: 'a' }, { id: 'b' }, { id: 'c' }]

  it('returns prev and next', () => {
    expect(getNeighbors(list, 'b')).toEqual({ prev: list[0], next: list[2] })
  })

  it('wraps around at both ends', () => {
    expect(getNeighbors(list, 'a').prev).toBe(list[2])
    expect(getNeighbors(list, 'c').next).toBe(list[0])
  })

  it('returns the item itself for a single-item list', () => {
    expect(getNeighbors([list[0]], 'a')).toEqual({ prev: list[0], next: list[0] })
  })

  it('returns nulls when id is not in the list', () => {
    expect(getNeighbors(list, 'x')).toEqual({ prev: null, next: null })
    expect(getNeighbors([], 'a')).toEqual({ prev: null, next: null })
  })
})
