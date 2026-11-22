import { render, screen, within } from '@testing-library/react'
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
