import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { axe } from 'vitest-axe'
import * as axeMatchers from 'vitest-axe/matchers'
import App from '../App.jsx'

expect.extend(axeMatchers)

async function renderAt(url, headingName) {
  const view = render(
    <MemoryRouter initialEntries={[url]}>
      <App />
    </MemoryRouter>,
  )
  await screen.findByRole('heading', { level: 1, name: headingName })
  return view
}

// jsdom has no layout engine, so axe's color-contrast rule cannot run here;
// contrast is verified separately (see src/__tests__/contrast.test.js).
const axeOptions = { rules: { 'color-contrast': { enabled: false } } }

describe('axe: no WCAG violations', () => {
  it('Home', async () => {
    const { container } = await renderAt('/', /case evidence archive/i)
    expect(await axe(container, axeOptions)).toHaveNoViolations()
  })

  it('Gallery without a dialog', async () => {
    const { container } = await renderAt('/gallery', 'Gallery')
    expect(await axe(container, axeOptions)).toHaveNoViolations()
  })

  it('Gallery with an open dialog', async () => {
    const { container } = await renderAt('/gallery?category=devices&photoId=dev-03', 'Gallery')
    await screen.findByRole('dialog')
    expect(await axe(container, axeOptions)).toHaveNoViolations()
  })

  it('Gallery with an unknown photoId', async () => {
    const { container } = await renderAt('/gallery?photoId=nope', 'Gallery')
    expect(await axe(container, axeOptions)).toHaveNoViolations()
  })

  it('About', async () => {
    const { container } = await renderAt('/about', 'About')
    expect(await axe(container, axeOptions)).toHaveNoViolations()
  })

  it('NotFound', async () => {
    const { container } = await renderAt('/nope', /page not found/i)
    expect(await axe(container, axeOptions)).toHaveNoViolations()
  })
})

describe('page structure', () => {
  it.each([
    ['/', /case evidence archive/i],
    ['/gallery', 'Gallery'],
    ['/about', 'About'],
    ['/nope', /page not found/i],
  ])('%s has exactly one h1 and one main landmark', async (url, name) => {
    await renderAt(url, name)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getAllByRole('main')).toHaveLength(1)
    expect(screen.getAllByRole('banner')).toHaveLength(1)
    expect(screen.getAllByRole('contentinfo')).toHaveLength(1)
  })
})
