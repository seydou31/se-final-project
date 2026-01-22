import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as api from '../utils/api';

// Mock the API module
vi.mock('../utils/api', () => ({
  login: vi.fn(),
  signup: vi.fn(),
  googleAuth: vi.fn(),
  getProfile: vi.fn(),
  createProfile: vi.fn(),
  updateProfile: vi.fn(),
  deleteAccount: vi.fn(),
  getEvents: vi.fn(),
  checkInEvent: vi.fn(),
  checkOutEvent: vi.fn(),
  getOtherUsers: vi.fn(),
  sendInterest: vi.fn(),
  getMatches: vi.fn(),
}));

// Mock socket.io-client
vi.mock('socket.io-client', () => ({
  default: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

// Mock Google OAuth
vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => children,
  GoogleLogin: ({ onSuccess, onError }) => (
    <button
      data-testid="google-login-button"
      onClick={() =>
        onSuccess({ credential: 'mock-google-credential' })
      }
    >
      Sign in with Google
    </button>
  ),
}));

const renderApp = () => {
  return render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

describe('BaeQuest App - Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Authentication Flow', () => {
    it('renders landing page when not logged in', () => {
      api.getProfile.mockRejectedValue(new Error('Not authenticated'));
      renderApp();

      expect(screen.getByText(/Find your vibe/i)).toBeInTheDocument();
    });

    it('shows login modal when login button is clicked', async () => {
      api.getProfile.mockRejectedValue(new Error('Not authenticated'));
      renderApp();

      const loginButton = screen.getByRole('button', { name: /log in/i });
      await userEvent.click(loginButton);

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    });

    it('successfully logs in with email and password', async () => {
      const mockProfile = {
        name: 'John Doe',
        age: 25,
        gender: 'male',
        profession: 'Engineer',
        interests: ['hiking', 'coding'],
        convoStarter: 'Hello!',
      };

      api.getProfile.mockRejectedValueOnce(new Error('Not authenticated'));
      api.login.mockResolvedValue({ token: 'mock-token' });
      api.getProfile.mockResolvedValue(mockProfile);

      renderApp();

      // Open login modal
      const loginButton = screen.getByRole('button', { name: /log in/i });
      await userEvent.click(loginButton);

      // Fill in credentials
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/password/i);

      await userEvent.type(emailInput, 'test@example.com');
      await userEvent.type(passwordInput, 'password123');

      // Submit login
      const submitButton = screen.getByRole('button', { name: /^log in$/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('shows create account modal when create account button is clicked', async () => {
      api.getProfile.mockRejectedValue(new Error('Not authenticated'));
      renderApp();

      const createAccountButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createAccountButton);

      expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    });

    it('successfully creates account with email and password', async () => {
      api.getProfile.mockRejectedValueOnce(new Error('Not authenticated'));
      api.signup.mockResolvedValue({ token: 'mock-token' });
      api.getProfile.mockResolvedValue(null);

      renderApp();

      // Open create account modal
      const createAccountButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createAccountButton);

      // Fill in credentials
      const emailInput = screen.getByPlaceholderText(/email/i);
      const passwordInput = screen.getByPlaceholderText(/^password$/i);
      const confirmPasswordInput = screen.getByPlaceholderText(/confirm password/i);

      await userEvent.type(emailInput, 'newuser@example.com');
      await userEvent.type(passwordInput, 'password123');
      await userEvent.type(confirmPasswordInput, 'password123');

      // Submit signup
      const submitButton = screen.getByRole('button', { name: /^create account$/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(api.signup).toHaveBeenCalledWith('newuser@example.com', 'password123');
      });
    });
  });

  describe('Profile Management', () => {
    it('redirects to profile page when user has a profile', async () => {
      const mockProfile = {
        name: 'John Doe',
        age: 25,
        gender: 'male',
        profession: 'Engineer',
        interests: ['hiking', 'coding'],
        convoStarter: 'Hello!',
      };

      api.getProfile.mockResolvedValue(mockProfile);
      api.getEvents.mockResolvedValue([]);

      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });
    });

    it('shows profile creation modal for new users', async () => {
      api.getProfile.mockResolvedValue(null);
      localStorage.setItem('tokenExists', 'true');

      renderApp();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/age/i)).toBeInTheDocument();
      });
    });

    it('creates profile with all required fields', async () => {
      api.getProfile.mockResolvedValue(null);
      api.createProfile.mockResolvedValue({
        name: 'Jane Doe',
        age: 28,
        gender: 'female',
        profession: 'Designer',
        interests: ['art', 'music'],
        convoStarter: 'Hi there!',
      });
      localStorage.setItem('tokenExists', 'true');

      renderApp();

      await waitFor(() => {
        expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
      });

      // Fill profile form
      await userEvent.type(screen.getByPlaceholderText(/name/i), 'Jane Doe');
      await userEvent.type(screen.getByPlaceholderText(/age/i), '28');
      await userEvent.type(screen.getByPlaceholderText(/profession/i), 'Designer');
      await userEvent.type(screen.getByPlaceholderText(/interests/i), 'art, music');
      await userEvent.type(screen.getByPlaceholderText(/conversation starter/i), 'Hi there!');

      const createButton = screen.getByRole('button', { name: /create profile/i });
      await userEvent.click(createButton);

      await waitFor(() => {
        expect(api.createProfile).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when login fails', async () => {
      api.getProfile.mockRejectedValueOnce(new Error('Not authenticated'));
      api.login.mockRejectedValue(new Error('Invalid credentials'));

      renderApp();

      // Open login modal
      const loginButton = screen.getByRole('button', { name: /log in/i });
      await userEvent.click(loginButton);

      // Fill credentials
      await userEvent.type(screen.getByPlaceholderText(/email/i), 'wrong@example.com');
      await userEvent.type(screen.getByPlaceholderText(/password/i), 'wrongpass');

      // Submit
      const submitButton = screen.getByRole('button', { name: /^log in$/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('displays error when signup passwords do not match', async () => {
      api.getProfile.mockRejectedValue(new Error('Not authenticated'));
      renderApp();

      // Open create account modal
      const createAccountButton = screen.getByRole('button', { name: /create account/i });
      await userEvent.click(createAccountButton);

      // Fill with mismatched passwords
      await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
      await userEvent.type(screen.getByPlaceholderText(/^password$/i), 'password123');
      await userEvent.type(screen.getByPlaceholderText(/confirm password/i), 'password456');

      const submitButton = screen.getByRole('button', { name: /^create account$/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading spinner during profile fetch', async () => {
      api.getProfile.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve(null), 1000))
      );

      renderApp();

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to events page when logged in', async () => {
      const mockProfile = {
        name: 'John Doe',
        age: 25,
        gender: 'male',
        profession: 'Engineer',
        interests: ['hiking'],
        convoStarter: 'Hello!',
      };

      api.getProfile.mockResolvedValue(mockProfile);
      api.getEvents.mockResolvedValue([
        {
          _id: '1',
          name: 'Coffee Meetup',
          date: new Date().toISOString(),
          location: 'Starbucks',
          description: 'Let\'s meet',
          attendees: [],
        },
      ]);

      renderApp();

      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });

      // Navigate to events
      const eventsLink = screen.getByRole('link', { name: /events/i });
      await userEvent.click(eventsLink);

      await waitFor(() => {
        expect(screen.getByText(/Coffee Meetup/i)).toBeInTheDocument();
      });
    });
  });
});
