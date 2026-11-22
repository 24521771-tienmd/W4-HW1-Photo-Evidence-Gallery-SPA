import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation } from 'react-router'
import App from '../App.jsx'

function LocationProbe() {
  const { pathname, search } = useLocation()
  return <output data-testid="location">{pathname + search}</output>
}

async function renderGallery(url) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <App />
      <LocationProbe />
    </MemoryRouter>,
  )
  await screen.findByRole('heading', { level: 1, name: 'Gallery' })
}

const items = () => within(screen.getByRole('list', { name: 'Photos' })).getAllByRole('listitem')
const location = () => screen.getByTestId('location').textContent

describe('gallery category filter', () => {
  it('shows all 24 photos at /gallery with "All" pressed', async () => {
    await renderGallery('/gallery')
    expect(items()).toHaveLength(24)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('group', { name: /filter by category/i })).toBeInTheDocument()
  })

  it('shows 6 photos for ?category=devices and presses "Devices"', async () => {
    await renderGallery('/gallery?category=devices')
    expect(items()).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Devices' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('updates the URL and list when a category button is clicked', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery')
    await user.click(screen.getByRole('button', { name: 'Locations' }))
    expect(location()).toBe('/gallery?category=locations')
    expect(items()).toHaveLength(6)
    expect(screen.getByRole('button', { name: 'Locations' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('removes the param when "All" is clicked', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices')
    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(location()).toBe('/gallery')
    expect(items()).toHaveLength(24)
  })

  it('falls back to all photos for an invalid category', async () => {
    await renderGallery('/gallery?category=foo')
    expect(items()).toHaveLength(24)
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('preserves other params when the category changes', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices&photoId=dev-03')
    await user.click(screen.getByRole('button', { name: 'Documents' }))
    expect(location()).toBe('/gallery?category=documents&photoId=dev-03')
    await user.click(screen.getByRole('button', { name: 'All' }))
    expect(location()).toBe('/gallery?photoId=dev-03')
  })

  it('announces the result count in a live region', async () => {
    await renderGallery('/gallery?category=exhibits')
    expect(screen.getByRole('status')).toHaveTextContent('Showing 6 photos in Exhibits')
  })

  it('renders accessible, performant images', async () => {
    await renderGallery('/gallery')
    const imgs = within(screen.getByRole('list', { name: 'Photos' })).getAllByRole('img')
    expect(imgs[0]).toHaveAttribute('fetchpriority', 'high')
    expect(imgs[0]).not.toHaveAttribute('loading', 'lazy')
    expect(imgs[23]).toHaveAttribute('loading', 'lazy')
    for (const img of imgs) {
      expect(img).toHaveAttribute('srcset')
      expect(img).toHaveAttribute('sizes')
      expect(img).toHaveAttribute('width')
      expect(img).toHaveAttribute('height')
      expect(img).toHaveAttribute('decoding', 'async')
    }
  })
})
