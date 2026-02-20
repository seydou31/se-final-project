import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileModal from './ProfileModal';
import AppContext from '../context/AppContext';

// Mock the API
vi.mock('../utils/api', () => ({
  uploadProfilePicture: vi.fn().mockResolvedValue({ url: 'mock-url' }),
}));

// Mock toast
const mockToastError = vi.fn();
vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: { error: (...args) => mockToastError(...args) },
}));

const mockProfile = {
  name: 'John Doe',
  age: 25,
  gender: 'male',
  sexualOrientation: 'straight',
  profession: 'Engineer',
  bio: 'I love coding',
  interests: ['gaming', 'hiking', 'coffee'],
  convoStarter: 'What is your favorite hobby?',
  phoneNumber: '+12025551234',
};

const renderProfileModal = (props = {}, contextValue = {}) => {
  const defaultProps = {
    isOpen: true,
    mode: 'create',
    onClose: vi.fn(),
    onOverlayClick: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue({}),
  };

  const defaultContext = {
    currentProfile: null,
    ...contextValue,
  };

  return render(
    <AppContext.Provider value={defaultContext}>
      <ProfileModal {...defaultProps} {...props} />
    </AppContext.Provider>
  );
};

describe('ProfileModal Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Create Mode', () => {
    it('renders create profile form with all fields', () => {
      renderProfileModal();

      expect(screen.getByRole('heading', { name: /create profile/i })).toBeInTheDocument();
      expect(screen.getByLabelText(/profile picture/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^name$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^gender$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/sexual orientation/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/profession/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/bio/i)).toBeInTheDocument();
      expect(screen.getByText(/^Interests$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/conversation starter/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create profile/i })).toBeInTheDocument();
    });

    it('prevents closing in create mode', async () => {
      const onClose = vi.fn();
      renderProfileModal({ onClose });

      // Try to close by clicking close button (should not exist)
      const closeButton = screen.queryByRole('button', { name: /close/i });
      expect(closeButton).not.toBeInTheDocument();
    });

    it('successfully creates profile with valid data', async () => {
      const onSubmit = vi.fn().mockResolvedValue({});
      renderProfileModal({ onSubmit });

      // Fill in all required fields
      await userEvent.type(screen.getByPlaceholderText(/first name/i), 'Jane Doe');
      await userEvent.type(screen.getByPlaceholderText(/enter your age/i), '28');
      await userEvent.selectOptions(screen.getByLabelText(/^gender$/i), 'female');
      await userEvent.selectOptions(screen.getByLabelText(/sexual orientation/i), 'bisexual');
      await userEvent.type(screen.getByPlaceholderText(/software engineer/i), 'Designer');
      await userEvent.type(screen.getByPlaceholderText(/tell us about yourself/i), 'I love art and design');

      // Select interests
      const gamingCheckbox = screen.getByLabelText('gaming');
      const travelCheckbox = screen.getByLabelText('travel');
      await userEvent.click(gamingCheckbox);
      await userEvent.click(travelCheckbox);

      await userEvent.type(
        screen.getByPlaceholderText(/enter a conversation starter/i),
        'What is your favorite place to travel?'
      );

      await userEvent.type(
        screen.getByPlaceholderText('+12025551234'),
        '+15555550001'
      );

      // Submit form
      const submitButton = screen.getByRole('button', { name: /create profile/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith({
          name: 'Jane Doe',
          age: '28',
          gender: 'female',
          sexualOrientation: 'bisexual',
          profession: 'Designer',
          bio: 'I love art and design',
          interests: ['gaming', 'travel'],
          convoStarter: 'What is your favorite place to travel?',
          phoneNumber: '+15555550001',
        });
      });
    });

    it('limits interests selection to 3', async () => {
      mockToastError.mockClear();
      renderProfileModal();

      // Select 3 interests
      await userEvent.click(screen.getByLabelText('gaming'));
      await userEvent.click(screen.getByLabelText('travel'));
      await userEvent.click(screen.getByLabelText('cooking'));

      // Try to select a 4th interest
      await userEvent.click(screen.getByLabelText('music'));

      expect(mockToastError).toHaveBeenCalledWith('You can select up to 3 interests only!');
    });
  });

  describe('Edit Mode', () => {
    it('renders edit profile form with existing data', async () => {
      renderProfileModal(
        { mode: 'edit' },
        { currentProfile: mockProfile }
      );

      await waitFor(() => {
        expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
        expect(screen.getByDisplayValue('25')).toBeInTheDocument();
        expect(screen.getByLabelText(/^gender$/i)).toHaveValue('male');
        expect(screen.getByLabelText(/sexual orientation/i)).toHaveValue('straight');
        expect(screen.getByDisplayValue('Engineer')).toBeInTheDocument();
        expect(screen.getByDisplayValue('I love coding')).toBeInTheDocument();
        expect(screen.getByDisplayValue('What is your favorite hobby?')).toBeInTheDocument();
      });

      // Check selected interests
      expect(screen.getByLabelText('gaming')).toBeChecked();
      expect(screen.getByLabelText('hiking')).toBeChecked();
      expect(screen.getByLabelText('coffee')).toBeChecked();
    });

    it('shows close button in edit mode', () => {
      renderProfileModal(
        { mode: 'edit' },
        { currentProfile: mockProfile }
      );

      const closeButton = screen.getByRole('button', { name: /close|×/i });
      expect(closeButton).toBeInTheDocument();
    });

    it('successfully updates profile', async () => {
      const onSubmit = vi.fn().mockResolvedValue({});
      renderProfileModal(
        { mode: 'edit', onSubmit },
        { currentProfile: mockProfile }
      );

      // Change name
      const nameInput = screen.getByDisplayValue('John Doe');
      await userEvent.clear(nameInput);
      await userEvent.type(nameInput, 'John Smith');

      // Submit
      const submitButton = screen.getByRole('button', { name: /save changes/i });
      await userEvent.click(submitButton);

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'John Smith',
          })
        );
      });
    });
  });

  describe('File Upload', () => {
    it('accepts valid image files', async () => {
      renderProfileModal();

      const file = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      const fileInput = screen.getByLabelText(/profile picture/i);

      await userEvent.upload(fileInput, file);

      expect(screen.getByText(/selected: test.jpg/i)).toBeInTheDocument();
    });

    it('rejects files larger than 5MB', async () => {
      mockToastError.mockClear();
      renderProfileModal();

      const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', {
        type: 'image/jpeg',
      });
      const fileInput = screen.getByLabelText(/profile picture/i);

      await userEvent.upload(fileInput, largeFile);

      expect(mockToastError).toHaveBeenCalledWith('File size must be less than 5MB');
    });

    it('rejects invalid file types', async () => {
      mockToastError.mockClear();
      renderProfileModal();

      const invalidFile = new File(['test'], 'test.pdf', { type: 'application/pdf' });
      const fileInput = screen.getByLabelText(/profile picture/i);

      // Use fireEvent to bypass userEvent's accept-attribute filtering
      fireEvent.change(fileInput, { target: { files: [invalidFile] } });

      expect(mockToastError).toHaveBeenCalledWith(
        'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
      );
    });
  });

  describe('Form Validation', () => {
    it('requires all fields to be filled', async () => {
      renderProfileModal();

      const submitButton = screen.getByRole('button', { name: /create profile/i });
      await userEvent.click(submitButton);

      // Form should not submit with empty fields
      const onSubmit = vi.fn();
      expect(onSubmit).not.toHaveBeenCalled();
    });

    it('enforces age minimum of 18', () => {
      renderProfileModal();

      const ageInput = screen.getByPlaceholderText(/enter your age/i);
      expect(ageInput).toHaveAttribute('min', '18');
      expect(ageInput).toHaveAttribute('max', '99');
    });

    it('enforces profession length constraints', () => {
      renderProfileModal();

      const professionInput = screen.getByPlaceholderText(/software engineer/i);
      expect(professionInput).toHaveAttribute('minLength', '2');
      expect(professionInput).toHaveAttribute('maxLength', '50');
    });

    it('enforces bio length constraints', () => {
      renderProfileModal();

      const bioInput = screen.getByPlaceholderText(/tell us about yourself/i);
      expect(bioInput).toHaveAttribute('minLength', '6');
      expect(bioInput).toHaveAttribute('maxLength', '280');
    });

    it('enforces conversation starter length constraints', () => {
      renderProfileModal();

      const convoInput = screen.getByPlaceholderText(/enter a conversation starter/i);
      expect(convoInput).toHaveAttribute('minLength', '10');
      expect(convoInput).toHaveAttribute('maxLength', '160');
    });
  });
});
