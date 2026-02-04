import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Event from './Event';

// Mock socket.io
const mockSocket = {
  on: vi.fn(),
  off: vi.fn(),
  emit: vi.fn(),
};

vi.mock('../utils/socket', () => ({
  default: mockSocket,
}));

vi.mock('../utils/api', () => ({
  getUsersAtEvent: vi.fn().mockResolvedValue([]),
}));

const mockEvent = {
  _id: 'event-123',
  title: 'Coffee Meetup',
  description: 'Let\'s grab coffee and chat!',
  date: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  endTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
  location: {
    name: 'Starbucks',
    address: '123 Main St, City, State',
  },
  image: 'https://example.com/event.jpg',
  price: 'Free',
  url: 'https://example.com/event',
  goingCount: 5,
  isUserGoing: false,
};

describe('Event Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Event Display', () => {
    it('renders event information correctly', () => {
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      expect(screen.getByText('Coffee Meetup')).toBeInTheDocument();
      expect(screen.getByText(/View on Map/i)).toBeInTheDocument();
      expect(screen.getByText(/5 people going/i)).toBeInTheDocument();
    });

    it('displays event image with correct src', () => {
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      const image = screen.getByAltText('Coffee Meetup');
      expect(image).toHaveAttribute('src', 'https://example.com/event.jpg');
    });

    it('shows map link when address is provided', () => {
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      const mapLink = screen.getByText(/view on map/i);
      expect(mapLink).toBeInTheDocument();
      expect(mapLink.closest('a')).toHaveAttribute(
        'href',
        expect.stringContaining('google.com/maps')
      );
    });

    it('shows event website link when url is provided', () => {
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      const eventLink = screen.getByText(/event website/i);
      expect(eventLink.closest('a')).toHaveAttribute('href', 'https://example.com/event');
    });

  });

  describe('Relative Time Display', () => {
    it('shows "Starts in X hours" for events starting soon', () => {
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      expect(screen.getByText(/Starts in \d+ hours?/i)).toBeInTheDocument();
    });

    it('shows "Started" for events that have already begun', () => {
      const pastEvent = {
        ...mockEvent,
        date: new Date(Date.now() - 1000).toISOString(),
      };
      render(<Event event={pastEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      expect(screen.getByText(/Started/i)).toBeInTheDocument();
    });
  });

  describe('Attendee Count', () => {
    it('displays correct attendee count when user is not going', () => {
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      expect(screen.getByText('5 people going')).toBeInTheDocument();
    });

    it('displays "other people" count when user is going', () => {
      const eventUserGoing = { ...mockEvent, isUserGoing: true, goingCount: 5 };
      render(<Event event={eventUserGoing} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      expect(screen.getByText('4 other people going')).toBeInTheDocument();
    });

    it('uses singular "person" for count of 1', () => {
      const eventOneAttendee = { ...mockEvent, goingCount: 1, isUserGoing: false };
      render(<Event event={eventOneAttendee} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      expect(screen.getByText('1 person going')).toBeInTheDocument();
    });

    it('hides attendee count when user is only attendee', () => {
      const eventOnlyUser = { ...mockEvent, goingCount: 1, isUserGoing: true };
      render(<Event event={eventOnlyUser} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      expect(screen.queryByText(/people going|person going/i)).not.toBeInTheDocument();
    });
  });

  describe('I\'m Going Button', () => {
    it('renders "I\'m Going" button when user hasn\'t clicked it', () => {
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      const goingButton = screen.getByRole('button', { name: /i'm going/i });
      expect(goingButton).toBeInTheDocument();
      expect(goingButton).not.toBeDisabled();
    });

    it('calls handleImGoing when clicked', async () => {
      const handleImGoing = vi.fn().mockResolvedValue({ count: 6 });
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={handleImGoing} />);

      const goingButton = screen.getByRole('button', { name: /i'm going/i });
      await userEvent.click(goingButton);

      await waitFor(() => {
        expect(handleImGoing).toHaveBeenCalledWith(mockEvent);
      });
    });

    it('updates to "Going" state after clicking', async () => {
      const handleImGoing = vi.fn().mockResolvedValue({ count: 6 });
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={handleImGoing} />);

      const goingButton = screen.getByRole('button', { name: /i'm going/i });
      await userEvent.click(goingButton);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /^going$/i })).toBeInTheDocument();
      });
    });

    it('shows "Going" and is disabled when user is already going', () => {
      const eventUserGoing = { ...mockEvent, isUserGoing: true };
      render(<Event event={eventUserGoing} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      const goingButton = screen.getByRole('button', { name: /^going$/i });
      expect(goingButton).toBeDisabled();
    });

    it('prevents double-clicks by showing loading state', async () => {
      const handleImGoing = vi.fn(
        () => new Promise((resolve) => setTimeout(() => resolve({ count: 6 }), 100))
      );
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={handleImGoing} />);

      const goingButton = screen.getByRole('button', { name: /i'm going/i });

      // Click twice quickly
      await userEvent.click(goingButton);
      await userEvent.click(goingButton);

      // Should show loading state
      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();

      // Should only call handler once
      expect(handleImGoing).toHaveBeenCalledTimes(1);
    });

    it('updates attendee count after marking as going', async () => {
      const handleImGoing = vi.fn().mockResolvedValue({ count: 6 });
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={handleImGoing} />);

      await userEvent.click(screen.getByRole('button', { name: /i'm going/i }));

      await waitFor(() => {
        expect(screen.getByText('5 other people going')).toBeInTheDocument();
      });
    });
  });

  describe('Check-in Button', () => {
    it('renders "I\'m here" button', () => {
      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={vi.fn()} />);

      expect(screen.getByRole('button', { name: /i'm here/i })).toBeInTheDocument();
    });

    it('calls handleCheckin when clicked', async () => {
      const handleCheckin = vi.fn();
      render(<Event event={mockEvent} handleCheckin={handleCheckin} handleImGoing={vi.fn()} />);

      const checkinButton = screen.getByRole('button', { name: /i'm here/i });
      await userEvent.click(checkinButton);

      expect(handleCheckin).toHaveBeenCalledWith(mockEvent);
    });
  });

  describe('Error Handling', () => {
    it('handles errors when marking as going fails', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const handleImGoing = vi.fn().mockRejectedValue(new Error('Network error'));

      render(<Event event={mockEvent} handleCheckin={vi.fn()} handleImGoing={handleImGoing} />);

      await userEvent.click(screen.getByRole('button', { name: /i'm going/i }));

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalledWith(
          'Failed to mark as going:',
          expect.any(Error)
        );
      });

      consoleError.mockRestore();
    });
  });
});
