import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, useLocation, useNavigate } from 'react-router'
import App from '../App.jsx'

function Probe() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  return (
    <div>
      <span data-testid="location">{pathname + search}</span>
      <button type="button" onClick={() => navigate(-1)}>
        history back
      </button>
    </div>
  )
}

async function renderGallery(url) {
  render(
    <MemoryRouter initialEntries={[url]}>
      <App />
      <Probe />
    </MemoryRouter>,
  )
  await screen.findByRole('heading', { level: 1, name: 'Gallery' })
}

const location = () => screen.getByTestId('location').textContent
const openDialog = () => document.querySelector('dialog[open]')

describe('URL-driven lightbox', () => {
  it('opens a dialog with the selected photo for a valid photoId', async () => {
    await renderGallery('/gallery?category=devices&photoId=dev-03')
    const dialog = await screen.findByRole('dialog')
    expect(openDialog()).toBe(dialog)
    const heading = within(dialog).getByRole('heading', { name: 'Office workstation' })
    expect(dialog).toHaveAttribute('aria-labelledby', heading.id)
    const img = within(dialog).getByRole('img')
    expect(img).toHaveAttribute('src', '/photos/dev-03-1200.webp')
    expect(img).toHaveAttribute('width', '1200')
    expect(img).toHaveAttribute('height', '900')
    expect(within(dialog).getByText('CASE-2026-DEV-03', { exact: false })).toBeInTheDocument()
    expect(dialog.querySelector('time')).toHaveAttribute('datetime', '2026-09-11')
    expect(dialog.querySelector('dl')).toBeInTheDocument()
  })

  it('removes only photoId and keeps category when the close button is clicked', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices&photoId=dev-03')
    await user.click(await screen.findByRole('button', { name: 'Close photo' }))
    expect(location()).toBe('/gallery?category=devices')
    expect(openDialog()).toBeNull()
  })

  it('removes only photoId when the dialog is dismissed natively (Esc)', async () => {
    await renderGallery('/gallery?category=devices&photoId=dev-03')
    const dialog = await screen.findByRole('dialog')
    dialog.close() // what the browser does on Esc: closes and fires "close"
    await screen.findByText('/gallery?category=devices')
    expect(openDialog()).toBeNull()
  })

  it('closes when the backdrop (the dialog element itself) is clicked', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices&photoId=dev-03')
    await user.click(await screen.findByRole('dialog'))
    expect(location()).toBe('/gallery?category=devices')
  })

  it('adds photoId (keeping category) when a grid item is clicked, and Back closes it', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=locations')
    expect(openDialog()).toBeNull()
    const grid = screen.getByRole('list', { name: 'Photos' })
    await user.click(within(grid).getAllByRole('button')[0])
    expect(location()).toBe('/gallery?category=locations&photoId=loc-01')
    expect(await screen.findByRole('dialog')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'history back' }))
    expect(location()).toBe('/gallery?category=locations')
    expect(openDialog()).toBeNull()
  })

  it('shows a not-found status and no open dialog for an unknown photoId', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices&photoId=nope-99')
    expect(openDialog()).toBeNull()
    const status = screen.getByText(/photo.*not found/i)
    expect(status.closest('[role="status"]')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear/i }))
    expect(location()).toBe('/gallery?category=devices')
    expect(screen.queryByText(/not found/i)).not.toBeInTheDocument()
  })
})

describe('lightbox keyboard navigation', () => {
  it('shows labelled previous/next buttons and a position text', async () => {
    await renderGallery('/gallery?category=devices&photoId=dev-03')
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).getByRole('button', { name: 'Previous photo: Mobile phone' })).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Next photo: Tablet device' })).toBeInTheDocument()
    expect(within(dialog).getByText('3 of 6')).toBeInTheDocument()
  })

  it('goes to the next photo with the Next button', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices&photoId=dev-03')
    await user.click(await screen.findByRole('button', { name: /^Next photo/ }))
    expect(location()).toBe('/gallery?category=devices&photoId=dev-04')
    expect(screen.getByText('4 of 6')).toBeInTheDocument()
  })

  it('ArrowRight/ArrowLeft move within the filtered list and wrap around', async () => {
    await renderGallery('/gallery?category=devices&photoId=dev-06')
    const dialog = await screen.findByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(location()).toBe('/gallery?category=devices&photoId=dev-01')
    fireEvent.keyDown(dialog, { key: 'ArrowLeft' })
    expect(location()).toBe('/gallery?category=devices&photoId=dev-06')
    expect(within(dialog).getByRole('heading', { name: 'Field phone' })).toBeInTheDocument()
  })

  it('replaces history on arrow navigation so Back closes the lightbox', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices')
    const grid = screen.getByRole('list', { name: 'Photos' })
    await user.click(within(grid).getAllByRole('button')[0])
    const dialog = await screen.findByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(location()).toBe('/gallery?category=devices&photoId=dev-03')
    await user.click(screen.getByRole('button', { name: 'history back' }))
    expect(location()).toBe('/gallery?category=devices')
  })

  it('has no prev/next controls when the photo is outside the filtered list', async () => {
    await renderGallery('/gallery?category=devices&photoId=doc-01')
    const dialog = await screen.findByRole('dialog')
    expect(within(dialog).queryByRole('button', { name: /^Next photo/ })).toBeNull()
    fireEvent.keyDown(dialog, { key: 'ArrowRight' })
    expect(location()).toBe('/gallery?category=devices&photoId=doc-01')
  })
})

describe('lightbox focus restoration', () => {
  it('returns focus to the grid button of the last shown photo', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices')
    const grid = screen.getByRole('list', { name: 'Photos' })
    await user.click(within(grid).getAllByRole('button')[0])
    const dialog = await screen.findByRole('dialog')
    fireEvent.keyDown(dialog, { key: 'ArrowRight' }) // now dev-02
    await user.click(within(dialog).getByRole('button', { name: 'Close photo' }))
    expect(document.activeElement).toBe(within(grid).getAllByRole('button')[1])
  })

  it('falls back to the gallery heading when the photo is not in the current list', async () => {
    const user = userEvent.setup()
    await renderGallery('/gallery?category=devices&photoId=doc-01')
    await user.click(await screen.findByRole('button', { name: 'Close photo' }))
    expect(document.activeElement).toBe(screen.getByRole('heading', { level: 1, name: 'Gallery' }))
  })
})

describe('next-image preload', () => {
  const preload = (name) => document.head.querySelector(`link[rel="preload"][as="image"][href="/photos/${name}-1200.webp"]`)

  it('does not preload while the dialog is closed, and preloads the next image when open', async () => {
    await renderGallery('/gallery?category=exhibits')
    expect(preload('exh-02')).toBeNull()
  })

  it('preloads the next image when the dialog is open', async () => {
    await renderGallery('/gallery?category=exhibits&photoId=exh-01')
    await screen.findByRole('dialog')
    expect(preload('exh-02')).not.toBeNull()
  })
})
