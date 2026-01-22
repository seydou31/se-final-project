import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from './Loading';

describe('Loading Component', () => {
  it('renders loading spinner', () => {
    render(<Loading />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('displays custom message when provided', () => {
    render(<Loading message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('renders fullscreen variant when specified', () => {
    const { container } = render(<Loading fullScreen />);
    expect(container.querySelector('.loading--fullscreen')).toBeInTheDocument();
  });

  it('renders normal variant by default', () => {
    const { container } = render(<Loading />);
    expect(container.querySelector('.loading--fullscreen')).not.toBeInTheDocument();
  });
});
