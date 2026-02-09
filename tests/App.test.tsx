import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../src/App.tsx'

describe('App', () => {
  it('renders the home page with title', async () => {
    render(<App />)
    const heading = await screen.findByText('UML Lernsituation')
    expect(heading).toBeInTheDocument()
  })

  it('renders navigation links', async () => {
    render(<App />)
    const nav = await screen.findByLabelText('Hauptnavigation')
    expect(nav).toBeInTheDocument()
  })
})
