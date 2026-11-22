import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import App from '../App.jsx'

function renderAt(path) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  )
}

describe('routing', () => {
  it('renders Home at "/" inside the root layout', () => {
    renderAt('/')
    expect(screen.getByRole('heading', { level: 1, name: /case evidence archive/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Skip to main content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('marks the current route link with aria-current="page"', () => {
    renderAt('/')
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Gallery' })).not.toHaveAttribute('aria-current')
  })

  it('renders the NotFound heading for unknown routes', async () => {
    renderAt('/does-not-exist')
    expect(await screen.findByRole('heading', { level: 1, name: /page not found/i })).toBeInTheDocument()
  })

  it('shows an aria-busy skeleton while the lazy Gallery loads, then the gallery heading', async () => {
    const { container } = renderAt('/gallery')
    const skeleton = container.querySelector('[aria-busy="true"]')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveAttribute('aria-live', 'polite')
    expect(skeleton).toHaveTextContent('Loading...')
    expect(await screen.findByRole('heading', { level: 1, name: 'Gallery' })).toBeInTheDocument()
    expect(container.querySelector('[aria-busy="true"]')).not.toBeInTheDocument()
  })

  it('renders About lazily with the accessibility statement', async () => {
    renderAt('/about')
    expect(await screen.findByRole('heading', { level: 1, name: 'About' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /accessibility statement/i })).toBeInTheDocument()
  })
})
