import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as api from '../utils/api';

// Mock the API module with all functions imported across the app
vi.mock('../utils/api', () => ({
  login: vi.fn(),
  createUser: vi.fn(),
  googleAuth: vi.fn(),
  googleAuthWithToken: vi.fn(),
  getProfile: vi.fn(),
  createProfile: vi.fn(),
  updateProfile: vi.fn(),
  getNearbyPlaces: vi.fn(),
  getPlacePhotoUrl: vi.fn(),
  checkinAtPlace: vi.fn(),
  getUsersAtPlace: vi.fn(),
  checkoutFromPlace: vi.fn(),
  logout: vi.fn(),
  deleteUser: vi.fn(),
  deleteProfile: vi.fn(),
  requestPasswordReset: vi.fn(),
  resetPassword: vi.fn(),
  verifyEmail: vi.fn(),
  sendEmailVerification: vi.fn(),
  uploadProfilePicture: vi.fn(),
}));

// Mock socket.io-client (named export)
vi.mock('socket.io-client', () => ({
  io: vi.fn(() => ({
    on: vi.fn(),
    emit: vi.fn(),
    off: vi.fn(),
    disconnect: vi.fn(),
  })),
}));

// Mock Google OAuth
vi.mock('@react-oauth/google', () => ({
  GoogleOAuthProvider: ({ children }) => children,
  GoogleLogin: ({ onSuccess }) => (
    <button
      data-testid="google-login-button"
      onClick={() => onSuccess({ credential: 'mock-google-credential' })}
    >
      Sign in with Google
    </button>
  ),
  useGoogleLogin: () => vi.fn(),
}));

// Returns the single modal that currently has the opened class
function getOpenedModal() {
  return document.querySelector('.modal_is-opened');
}

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

      expect(screen.getByText(/Meet amazing people in your area/i)).toBeInTheDocument();
    });

    it('shows login modal when SIGN IN button is clicked', async () => {
      api.getProfile.mockRejectedValue(new Error('Not authenticated'));
      renderApp();

      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      const modal = getOpenedModal();
      expect(modal).toBeTruthy();
      expect(within(modal).getByPlaceholderText('Enter email')).toBeInTheDocument();
      expect(within(modal).getByPlaceholderText('Create Password')).toBeInTheDocument();
    });

    it('successfully logs in with email and password', async () => {
      const mockProfile = {
        name: 'John Doe',
        age: 25,
        gender: 'male',
        profession: 'Engineer',
        bio: 'A developer',
        interests: ['hiking', 'coding'],
        convoStarter: 'Hello!',
      };

      api.getProfile.mockRejectedValueOnce(new Error('Not authenticated'));
      api.login.mockResolvedValue({});
      api.getProfile.mockResolvedValueOnce(mockProfile);

      renderApp();

      // Open login modal via Header SIGN IN button
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      const modal = getOpenedModal();
      await userEvent.type(within(modal).getByPlaceholderText('Enter email'), 'test@example.com');
      await userEvent.type(within(modal).getByPlaceholderText('Create Password'), 'Password1!');

      // Login button enabled once email and password pass validation
      await userEvent.click(within(modal).getByRole('button', { name: /^Login$/ }));

      await waitFor(() => {
        expect(api.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'Password1!' });
      });
    });

    it('shows create account modal when create account button is clicked', async () => {
      api.getProfile.mockRejectedValue(new Error('Not authenticated'));
      renderApp();

      // Main renders two "Create Account" buttons; click the first
      const buttons = screen.getAllByRole('button', { name: /create account/i });
      await userEvent.click(buttons[0]);

      const modal = getOpenedModal();
      expect(modal).toBeTruthy();
      expect(within(modal).getByPlaceholderText('Enter email')).toBeInTheDocument();
      expect(within(modal).getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    });

    it('successfully creates account with email and password', async () => {
      api.getProfile.mockRejectedValueOnce(new Error('Not authenticated'));
      api.createUser.mockResolvedValue({});

      renderApp();

      const buttons = screen.getAllByRole('button', { name: /create account/i });
      await userEvent.click(buttons[0]);

      const modal = getOpenedModal();
      await userEvent.type(within(modal).getByPlaceholderText('Enter email'), 'newuser@example.com');
      await userEvent.type(within(modal).getByPlaceholderText('Create Password'), 'Password1!');
      await userEvent.type(within(modal).getByPlaceholderText('Confirm Password'), 'Password1!');

      // Submit button text is "Continue"
      await userEvent.click(within(modal).getByRole('button', { name: /^Continue$/ }));

      await waitFor(() => {
        expect(api.createUser).toHaveBeenCalledWith({ email: 'newuser@example.com', password: 'Password1!' });
      });
    });
  });

  describe('Profile Management', () => {
    it('shows profile page when user has a profile', async () => {
      const mockProfile = {
        name: 'John Doe',
        age: 25,
        gender: 'male',
        profession: 'Engineer',
        bio: 'A developer',
        interests: ['hiking', 'coding'],
        convoStarter: 'Hello!',
      };

      api.getProfile.mockResolvedValue(mockProfile);

      renderApp();

      // App navigates to /profile after loading; Profile renders the name
      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });
    });

    it('shows profile creation modal after login for new users', async () => {
      // 1st getProfile (initial mount) rejects – not logged in
      api.getProfile.mockRejectedValueOnce(new Error('Not authenticated'));
      api.login.mockResolvedValue({});
      // 2nd getProfile (after login) returns null – no profile yet
      api.getProfile.mockResolvedValueOnce(null);

      renderApp();

      // Log in via SIGN IN → LoginModal
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
      let modal = getOpenedModal();
      await userEvent.type(within(modal).getByPlaceholderText('Enter email'), 'new@example.com');
      await userEvent.type(within(modal).getByPlaceholderText('Create Password'), 'Password1!');
      await userEvent.click(within(modal).getByRole('button', { name: /^Login$/ }));

      // After login with null profile, App opens the Create Profile modal
      await waitFor(() => {
        const m = getOpenedModal();
        expect(m).toBeTruthy();
        expect(within(m).getByRole('heading', { name: /create profile/i })).toBeInTheDocument();
      });
    });

    it('creates profile with required fields', async () => {
      api.getProfile.mockRejectedValueOnce(new Error('Not authenticated'));
      api.login.mockResolvedValue({});
      api.getProfile.mockResolvedValueOnce(null);
      api.createProfile.mockResolvedValue({
        name: 'Jane Doe',
        age: 28,
        gender: 'female',
        profession: 'Designer',
        bio: 'Creative designer',
        interests: ['art', 'music'],
        convoStarter: 'What do you love to do?',
      });

      renderApp();

      // Step 1: log in to trigger profile creation modal
      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));
      let modal = getOpenedModal();
      await userEvent.type(within(modal).getByPlaceholderText('Enter email'), 'jane@example.com');
      await userEvent.type(within(modal).getByPlaceholderText('Create Password'), 'Password1!');
      await userEvent.click(within(modal).getByRole('button', { name: /^Login$/ }));

      // Step 2: wait for Create Profile modal to appear
      await waitFor(() => {
        modal = getOpenedModal();
        expect(within(modal).getByRole('heading', { name: /create profile/i })).toBeInTheDocument();
      });

      // Step 3: fill all required profile fields (scoped to opened modal to avoid
      // duplicate fields from the edit-mode ProfileModal also in the DOM)
      await userEvent.type(within(modal).getByPlaceholderText('First name. Last name optional'), 'Jane Doe');
      await userEvent.type(within(modal).getByPlaceholderText('Enter your age'), '28');
      await userEvent.selectOptions(within(modal).getByLabelText(/^Gender$/), 'female');
      await userEvent.selectOptions(within(modal).getByLabelText(/^Sexual Orientation$/), 'straight');
      await userEvent.type(within(modal).getByPlaceholderText(/Software Engineer/), 'Designer');
      await userEvent.type(within(modal).getByPlaceholderText('Tell us about yourself'), 'Creative designer');
      await userEvent.click(within(modal).getByLabelText('art'));
      await userEvent.click(within(modal).getByLabelText('music'));
      await userEvent.type(within(modal).getByPlaceholderText('Enter a conversation starter'), 'What do you love to do?');

      // Step 4: submit the form
      await userEvent.click(within(modal).getByRole('button', { name: /create profile/i }));

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

      await userEvent.click(screen.getByRole('button', { name: /sign in/i }));

      const modal = getOpenedModal();
      await userEvent.type(within(modal).getByPlaceholderText('Enter email'), 'wrong@example.com');
      await userEvent.type(within(modal).getByPlaceholderText('Create Password'), 'Password1!');
      await userEvent.click(within(modal).getByRole('button', { name: /^Login$/ }));

      // loggingError renders in both LoginModal and CreateAccountModal (always in DOM);
      // scope to the still-open LoginModal
      await waitFor(() => {
        expect(within(modal).getByText(/Invalid credentials/i)).toBeInTheDocument();
      });
    });

    it('displays error when signup passwords do not match', async () => {
      api.getProfile.mockRejectedValue(new Error('Not authenticated'));
      renderApp();

      const buttons = screen.getAllByRole('button', { name: /create account/i });
      await userEvent.click(buttons[0]);

      const modal = getOpenedModal();
      await userEvent.type(within(modal).getByPlaceholderText('Enter email'), 'test@example.com');
      await userEvent.type(within(modal).getByPlaceholderText('Create Password'), 'Password1!');
      // Confirm password differs – mismatch error appears immediately on change
      await userEvent.type(within(modal).getByPlaceholderText('Confirm Password'), 'Password2!');

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading States', () => {
    it('shows loading message during profile fetch', () => {
      // tokenExists in localStorage makes isLoggedInLoading true on mount
      localStorage.setItem('tokenExists', 'true');
      // Promise that never settles keeps the app in loading state
      api.getProfile.mockImplementation(() => new Promise(() => {}));

      renderApp();

      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });
  });

  describe('Navigation', () => {
    it('navigates to Meet page when clicking Meet link', async () => {
      const mockProfile = {
        name: 'John Doe',
        age: 25,
        gender: 'male',
        profession: 'Engineer',
        bio: 'A developer',
        interests: ['hiking'],
        convoStarter: 'Hello!',
      };

      api.getProfile.mockResolvedValue(mockProfile);

      renderApp();

      // Wait for profile page (App auto-navigates to /profile after loading)
      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      });

      // Click "Meet" nav link in the Header
      const meetLink = screen.getByRole('link', { name: /^Meet$/ });
      await userEvent.click(meetLink);

      await waitFor(() => {
        expect(screen.getByText(/Find people nearby/i)).toBeInTheDocument();
      });
    });
  });
});
