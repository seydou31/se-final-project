import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
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
  getNearbyPlaces: vi.fn(),
  getPlacePhotoUrl: vi.fn(),
  checkinAtPlace: vi.fn(),
  getUsersAtPlace: vi.fn(),
  checkoutFromPlace: vi.fn(),
}));

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: vi.fn(),
};

const mockPlaces = [
  {
    placeId: 'place_1',
    name: 'Coffee Shop',
    address: '123 Main St',
    rating: 4.5,
    openNow: true,
    userCount: 2,
    photos: [{ reference: 'photo_ref_1' }],
  },
  {
    placeId: 'place_2',
    name: 'Bar & Grill',
    address: '456 Oak Ave',
    rating: 4.2,
    openNow: true,
    userCount: 5,
    photos: [{ reference: 'photo_ref_2' }],
  },
];

const defaultProps = {
  handleCheckin: vi.fn(),
  otherProfiles: [],
  setOtherProfiles: vi.fn(),
  handleCheckoutModal: vi.fn(),
  currentPlace: null,
  isCheckedIn: false,
  setCurrentPlace: vi.fn(),
  setIsCheckedIn: vi.fn(),
};

describe('Meet Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset geolocation mock
    global.navigator.geolocation = mockGeolocation;
  });

  describe('Place Discovery Mode (Not Checked In)', () => {
    it('renders place discovery interface', async () => {
      // Mock geolocation to fail (no location)
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, message: 'Permission denied' });
      });

      render(<Meet {...defaultProps} />);

      expect(screen.getByText('Find people nearby')).toBeInTheDocument();
      expect(screen.getByText(/Check in at a location/i)).toBeInTheDocument();
    });

    it('shows loading state while getting location', () => {
      // Mock geolocation to never resolve
      mockGeolocation.getCurrentPosition.mockImplementation(() => {});

      render(<Meet {...defaultProps} />);

      expect(screen.getByText(/Finding places near you/i)).toBeInTheDocument();
    });

    it('shows error when location permission denied', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, PERMISSION_DENIED: 1 });
      });

      render(<Meet {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/allow location access/i)).toBeInTheDocument();
      });
    });

    it('displays places when location is available', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({ coords: { latitude: 38.9, longitude: -77.0 } });
      });
      api.getNearbyPlaces.mockResolvedValue(mockPlaces);

      render(<Meet {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
        expect(screen.getByText('Bar & Grill')).toBeInTheDocument();
      });
    });

    it('shows user count on places', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({ coords: { latitude: 38.9, longitude: -77.0 } });
      });
      api.getNearbyPlaces.mockResolvedValue(mockPlaces);

      render(<Meet {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/2 people checked in/i)).toBeInTheDocument();
        expect(screen.getByText(/5 people checked in/i)).toBeInTheDocument();
      });
    });

    it('shows empty state when no places found', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success) => {
        success({ coords: { latitude: 38.9, longitude: -77.0 } });
      });
      api.getNearbyPlaces.mockResolvedValue([]);

      render(<Meet {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/No places found nearby/i)).toBeInTheDocument();
      });
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

      const currentPlace = {
        placeId: 'place_1',
        placeName: 'Coffee Shop',
        placeAddress: '123 Main St',
      };

      render(
        <MemoryRouter>
          <Meet
            {...defaultProps}
            isCheckedIn={true}
            otherProfiles={otherProfiles}
            currentPlace={currentPlace}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('People Checked In')).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    });

    it('does not show place list when checked in', () => {
      const currentPlace = {
        placeId: 'place_1',
        placeName: 'Coffee Shop',
        placeAddress: '123 Main St',
      };

      render(
        <MemoryRouter>
          <Meet
            {...defaultProps}
            isCheckedIn={true}
            currentPlace={currentPlace}
          />
        </MemoryRouter>
      );

      expect(screen.queryByText('Find people nearby')).not.toBeInTheDocument();
    });

    it('shows place name in OtherUsers view', () => {
      const currentPlace = {
        placeId: 'place_1',
        placeName: 'Coffee Shop',
        placeAddress: '123 Main St',
      };

      render(
        <MemoryRouter>
          <Meet
            {...defaultProps}
            isCheckedIn={true}
            currentPlace={currentPlace}
          />
        </MemoryRouter>
      );

      expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
  });

  describe('Retry Functionality', () => {
    it('shows retry button on location error', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, PERMISSION_DENIED: 1 });
      });

      render(<Meet {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });
    });

    it('retries getting location when retry button clicked', async () => {
      mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
        error({ code: 1, PERMISSION_DENIED: 1 });
      });

      render(<Meet {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole('button', { name: /try again/i }));

      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalledTimes(2);
    });
  });
});
