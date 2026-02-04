import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Meet from './Meet';
import * as api from '../utils/api';

// Mock socket
vi.mock('../utils/socket', () => ({
  default: {
    on: vi.fn(),
    off: vi.fn(),
    emit: vi.fn(),
  },
}));

// Mock API
vi.mock('../utils/api', () => ({
  markAsGoing: vi.fn(),
  getUsersAtEvent: vi.fn(),
}));

const mockEvents = [
  {
    _id: '1',
    title: 'Monday Coffee Meetup',
    description: 'Morning coffee',
    date: new Date('2026-01-06T10:00:00').toISOString(), // Monday
    endTime: new Date('2026-01-06T12:00:00').toISOString(),
    location: { name: 'Starbucks', address: '123 Main St' },
    image: 'https://example.com/coffee.jpg',
    price: 'Free',
    goingCount: 3,
    isUserGoing: false,
  },
  {
    _id: '2',
    title: 'Friday Happy Hour',
    description: 'End of week drinks',
    date: new Date('2026-01-10T18:00:00').toISOString(), // Friday
    endTime: new Date('2026-01-10T21:00:00').toISOString(),
    location: { name: 'Bar', address: '456 Oak Ave' },
    image: 'https://example.com/drinks.jpg',
    price: '$10',
    goingCount: 8,
    isUserGoing: false,
  },
];

const defaultProps = {
  events: mockEvents,
  handleFindEvents: vi.fn(),
  handleCheckin: vi.fn(),
  otherProfiles: [],
  setOtherProfiles: vi.fn(),
  handleCheckoutModal: vi.fn(),
  currentEvent: null,
  isCheckedIn: false,
  setCurrentEvent: vi.fn(),
  setIsCheckedIn: vi.fn(),
};

describe('Meet Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Event Discovery Mode (Not Checked In)', () => {
    it('renders event discovery interface', () => {
      render(<Meet {...defaultProps} />);

      expect(screen.getByText('Find events near you')).toBeInTheDocument();
      expect(screen.getByLabelText(/select state/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/select day/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /find/i })).toBeInTheDocument();
    });

    it('displays all events by default', () => {
      render(<Meet {...defaultProps} />);

      expect(screen.getByText('Monday Coffee Meetup')).toBeInTheDocument();
      expect(screen.getByText('Friday Happy Hour')).toBeInTheDocument();
    });

    it('calls handleFindEvents with selected state', async () => {
      const handleFindEvents = vi.fn();
      render(<Meet {...defaultProps} handleFindEvents={handleFindEvents} />);

      const stateSelect = screen.getByLabelText(/select state/i);
      await userEvent.selectOptions(stateSelect, 'California');

      const findButton = screen.getByRole('button', { name: /find/i });
      await userEvent.click(findButton);

      expect(handleFindEvents).toHaveBeenCalledWith('California');
    });

    it('filters events by selected day', async () => {
      render(<Meet {...defaultProps} />);

      const daySelect = screen.getByLabelText(/select day/i);
      await userEvent.selectOptions(daySelect, 'Monday');

      // Should only show Monday event
      expect(screen.getByText('Monday Coffee Meetup')).toBeInTheDocument();
      expect(screen.queryByText('Friday Happy Hour')).not.toBeInTheDocument();
    });

    it('shows all events when "All Days" is selected', async () => {
      render(<Meet {...defaultProps} />);

      const daySelect = screen.getByLabelText(/select day/i);

      // First filter to Monday
      await userEvent.selectOptions(daySelect, 'Monday');
      expect(screen.queryByText('Friday Happy Hour')).not.toBeInTheDocument();

      // Then select "All Days"
      await userEvent.selectOptions(daySelect, '');

      expect(screen.getByText('Monday Coffee Meetup')).toBeInTheDocument();
      expect(screen.getByText('Friday Happy Hour')).toBeInTheDocument();
    });
  });

  describe('State Selection', () => {
    it('renders all US states in dropdown', () => {
      render(<Meet {...defaultProps} />);

      const stateSelect = screen.getByLabelText(/select state/i);

      // Check for a few states
      expect(screen.getByRole('option', { name: 'California' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'New York' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Texas' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'All States' })).toBeInTheDocument();
    });

    it('updates selected state when changed', async () => {
      render(<Meet {...defaultProps} />);

      const stateSelect = screen.getByLabelText(/select state/i);
      await userEvent.selectOptions(stateSelect, 'Florida');

      expect(stateSelect).toHaveValue('Florida');
    });
  });

  describe('Day Filtering', () => {
    it('renders all days of week in dropdown', () => {
      render(<Meet {...defaultProps} />);

      // Check for all days
      expect(screen.getByRole('option', { name: 'Monday' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Tuesday' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Friday' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'All Days' })).toBeInTheDocument();
    });

    it('correctly filters events by Friday', async () => {
      render(<Meet {...defaultProps} />);

      const daySelect = screen.getByLabelText(/select day/i);
      await userEvent.selectOptions(daySelect, 'Friday');

      expect(screen.queryByText('Monday Coffee Meetup')).not.toBeInTheDocument();
      expect(screen.getByText('Friday Happy Hour')).toBeInTheDocument();
    });
  });

  describe('I\'m Going Functionality', () => {
    it('calls markAsGoing API when user clicks I\'m Going', async () => {
      api.markAsGoing.mockResolvedValue({ count: 4 });
      render(<Meet {...defaultProps} />);

      // Find the first event's "I'm Going" button
      const goingButtons = screen.getAllByRole('button', { name: /i'm going/i });
      await userEvent.click(goingButtons[0]);

      await waitFor(() => {
        expect(api.markAsGoing).toHaveBeenCalledWith('1');
      });
    });

    it('handles errors when marking as going fails', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      api.markAsGoing.mockRejectedValue(new Error('API error'));

      render(<Meet {...defaultProps} />);

      const goingButtons = screen.getAllByRole('button', { name: /i'm going/i });
      await userEvent.click(goingButtons[0]);

      await waitFor(() => {
        expect(consoleError).toHaveBeenCalled();
      });

      consoleError.mockRestore();
    });
  });

  describe('Check-in Flow', () => {
    it('renders OtherUsers component when checked in', () => {
      const otherProfiles = [
        {
          _id: 'user1',
          name: 'John Doe',
          age: 25,
          bio: 'Love coffee',
          interests: ['coffee', 'coding'],
          convoStarter: 'What do you do?',
        },
      ];

      render(
        <Meet
          {...defaultProps}
          isCheckedIn={true}
          otherProfiles={otherProfiles}
          currentEvent={mockEvents[0]}
        />
      );

      expect(screen.getByText('People Checked In at the event')).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    it('does not show event list when checked in', () => {
      render(
        <Meet
          {...defaultProps}
          isCheckedIn={true}
          currentEvent={mockEvents[0]}
        />
      );

      expect(screen.queryByText('Find events near you')).not.toBeInTheDocument();
      expect(screen.queryByText('Monday Coffee Meetup')).not.toBeInTheDocument();
    });
  });

  describe('Empty States', () => {
    it('renders correctly with no events', () => {
      render(<Meet {...defaultProps} events={[]} />);

      expect(screen.getByText('Find events near you')).toBeInTheDocument();
      expect(screen.queryByText('Monday Coffee Meetup')).not.toBeInTheDocument();
    });

    it('shows no events when filter eliminates all results', async () => {
      render(<Meet {...defaultProps} />);

      // Filter by a day that has no events
      const daySelect = screen.getByLabelText(/select day/i);
      await userEvent.selectOptions(daySelect, 'Sunday');

      expect(screen.queryByText('Monday Coffee Meetup')).not.toBeInTheDocument();
      expect(screen.queryByText('Friday Happy Hour')).not.toBeInTheDocument();
    });
  });

  describe('Event Rendering', () => {
    it('passes correct props to Event components', () => {
      const handleCheckin = vi.fn();
      render(<Meet {...defaultProps} handleCheckin={handleCheckin} />);

      // Check that events are rendered
      expect(screen.getByText('Monday Coffee Meetup')).toBeInTheDocument();
      expect(screen.getByText('Friday Happy Hour')).toBeInTheDocument();

      // Both should have check-in buttons
      const checkinButtons = screen.getAllByRole('button', { name: /i'm here/i });
      expect(checkinButtons).toHaveLength(2);
    });
  });

  describe('Combined Filters', () => {
    it('can use state and day filters together', async () => {
      const handleFindEvents = vi.fn();
      render(<Meet {...defaultProps} handleFindEvents={handleFindEvents} />);

      // Select both state and day
      await userEvent.selectOptions(screen.getByLabelText(/select state/i), 'California');
      await userEvent.selectOptions(screen.getByLabelText(/select day/i), 'Monday');

      // Click find
      await userEvent.click(screen.getByRole('button', { name: /find/i }));

      // Should call handleFindEvents with state
      expect(handleFindEvents).toHaveBeenCalledWith('California');

      // Should show only Monday events
      expect(screen.getByText('Monday Coffee Meetup')).toBeInTheDocument();
      expect(screen.queryByText('Friday Happy Hour')).not.toBeInTheDocument();
    });
  });
});
