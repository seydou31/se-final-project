import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProfileModal from "./ProfileModal";
import AppContext from "../context/AppContext";

vi.mock("../utils/api", () => ({
  uploadProfilePicture: vi.fn().mockResolvedValue({
    url: "mock-image.jpg",
  }),
}));

const toastError = vi.fn();

vi.mock("react-hot-toast", () => ({
  default: {
    error: (...args) => toastError(...args),
    success: vi.fn(),
  },
}));

const mockProfile = {
  name: "John Doe",
  age: 25,
  gender: "male",
  sexualOrientation: "straight",
  profession: "Engineer",
  bio: "I love coding",
  interests: ["gaming", "coffee"],
  convoStarter: "What do you do for fun?",
  phoneNumber: "+12025551234",
};

const renderModal = (
  props = {},
  context = { currentProfile: null }
) => {
  const defaultProps = {
    isOpen: true,
    mode: "create",
    onClose: vi.fn(),
    onOverlayClick: vi.fn(),
    onSubmit: vi.fn().mockResolvedValue({}),
  };

  return render(
    <AppContext.Provider value={context}>
      <ProfileModal {...defaultProps} {...props} />
    </AppContext.Provider>
  );
};

describe("ProfileModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Create Mode", () => {
    it("renders create profile form", () => {
      renderModal();

      expect(
        screen.getByRole("heading", { name: /create profile/i })
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(/first name/i)
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(/18\+/i)
      ).toBeInTheDocument();

      expect(
        screen.getByPlaceholderText(/software engineer/i)
      ).toBeInTheDocument();
    });

    it("creates profile successfully", async () => {
      const user = userEvent.setup();
      const onSubmit = vi.fn().mockResolvedValue({});

      renderModal({ onSubmit });

      await user.type(
        screen.getByPlaceholderText(/first name/i),
        "Jane Doe"
      );

      await user.type(
        screen.getByPlaceholderText(/18\+/i),
        "28"
      );

      const [genderSelect, orientationSelect] =
        screen.getAllByRole("combobox");

      await user.selectOptions(genderSelect, "female");
      await user.selectOptions(
        orientationSelect,
        "bisexual"
      );

      await user.type(
        screen.getByPlaceholderText(/software engineer/i),
        "Designer"
      );

      await user.type(
        screen.getByPlaceholderText(
          /tell people what makes you interesting/i
        ),
        "I enjoy travel and art."
      );

      await user.click(screen.getByText("gaming"));
      await user.click(screen.getByText("travel"));

      await user.type(
        screen.getByPlaceholderText(/ice-breaker question/i),
        "What is your favorite country?"
      );

      await user.type(
        screen.getByPlaceholderText(/\+1 202 555 1234/i),
        "+15555550001"
      );

      const consentCheckbox =
        screen.getByRole("checkbox");

      await user.click(consentCheckbox);

      expect(consentCheckbox).toBeChecked();

      await user.click(
        screen.getByRole("button", {
          name: /create profile/i,
        })
      );

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledTimes(1);
      });
    }, 10000);

    it("limits interests to 3", async () => {
      const user = userEvent.setup();

      renderModal();

      await user.click(screen.getByText("gaming"));
      await user.click(screen.getByText("travel"));
      await user.click(screen.getByText("photography"));
      await user.click(screen.getByText("cooking"));

      await waitFor(() => {
        expect(toastError).toHaveBeenCalledWith(
          "Pick up to 3 interests only."
        );
      });
    }, 10000);

    it("requires sms consent checkbox", () => {
      renderModal();

      expect(
        screen.getByRole("checkbox")
      ).toBeRequired();
    });
  });

  describe("Edit Mode", () => {
    it("loads existing profile data", async () => {
      renderModal(
        { mode: "edit" },
        { currentProfile: mockProfile }
      );

      await waitFor(() => {
        expect(
          screen.getByDisplayValue("John Doe")
        ).toBeInTheDocument();
      });
    });

    it("shows close button in edit mode", () => {
      renderModal(
        { mode: "edit" },
        { currentProfile: mockProfile }
      );

      expect(
        screen.getByText("close")
      ).toBeInTheDocument();
    });

    it("updates profile successfully", async () => {
      const user = userEvent.setup();

      const onSubmit = vi.fn().mockResolvedValue({});

      renderModal(
        {
          mode: "edit",
          onSubmit,
        },
        {
          currentProfile: mockProfile,
        }
      );

      const nameInput =
        await screen.findByDisplayValue("John Doe");

      await user.click(nameInput);
      await user.keyboard("{Control>}a{/Control}");
      await user.keyboard("{Backspace}");

      expect(nameInput).toHaveValue("");

      await user.type(nameInput, "John Smith");

      expect(nameInput).toHaveValue("John Smith");

      await user.click(
        screen.getByRole("button", {
          name: /save changes/i,
        })
      );

      await waitFor(() => {
        expect(onSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            name: "John Smith",
          })
        );
      });
    }, 10000);
  });

  describe("Validation", () => {
    it("enforces age minimum of 18", () => {
      renderModal();

      const ageInput =
        screen.getByPlaceholderText("18+");

      expect(ageInput).toHaveAttribute("min", "18");
      expect(ageInput).toHaveAttribute("max", "99");
    });

    it("profession field enforces length", () => {
      renderModal();

      const field =
        screen.getByPlaceholderText(
          /software engineer/i
        );

      expect(field).toHaveAttribute("minLength", "2");
      expect(field).toHaveAttribute("maxLength", "50");
    });

    it("bio field enforces length", () => {
      renderModal();

      const bio =
        screen.getByPlaceholderText(
          /tell people what makes you interesting/i
        );

      expect(bio).toHaveAttribute("minLength", "6");
      expect(bio).toHaveAttribute("maxLength", "280");
    });

    it("conversation starter enforces length", () => {
      renderModal();

      const field =
        screen.getByPlaceholderText(
          /ice-breaker question/i
        );

      expect(field).toHaveAttribute("minLength", "10");
      expect(field).toHaveAttribute("maxLength", "160");
    });
  });
});