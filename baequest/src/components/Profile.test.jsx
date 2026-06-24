import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import Profile from "./Profile";
import AppContext from "../context/AppContext";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockProfile = {
  name: "John Doe",
  age: 30,
  gender: "female",
  profession: "Developer",
  bio: "Love coding and coffee",
  interests: ["gaming", "travel", "music"],
  convoStarter: "What's your favorite destination?",
  profilePicture: "/uploads/profile.jpg",
};

const renderProfile = (profile = mockProfile) => {
  return render(
    <MemoryRouter>
      <AppContext.Provider
        value={{
          currentProfile: profile,
        }}
      >
        <Profile />
      </AppContext.Provider>
    </MemoryRouter>
  );
};

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders user name", () => {
    renderProfile();

    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });

  it("renders bio", () => {
    renderProfile();

    expect(screen.getByText("Love coding and coffee")).toBeInTheDocument();
  });

  it("renders age", () => {
    renderProfile();

    expect(screen.getByText("30")).toBeInTheDocument();
  });

  it("renders profession", () => {
    renderProfile();

    expect(screen.getByText("Developer")).toBeInTheDocument();
  });

  it("renders interests", () => {
    renderProfile();

    expect(screen.getByText("gaming")).toBeInTheDocument();
    expect(screen.getByText("travel")).toBeInTheDocument();
    expect(screen.getByText("music")).toBeInTheDocument();
  });

  it("renders conversation starter", () => {
    renderProfile();

    expect(
      screen.getByText(/What's your favorite destination/i)
    ).toBeInTheDocument();
  });

  it("renders profile image", () => {
    renderProfile();

    const image = screen.getByAltText("John Doe's profile");

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      "src",
      expect.stringContaining("/uploads/profile.jpg")
    );
  });

  it("shows placeholder when profile image missing", () => {
    renderProfile({
      ...mockProfile,
      profilePicture: "",
    });

    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("shows no interests message", () => {
    renderProfile({
      ...mockProfile,
      interests: [],
    });

    expect(
      screen.getByText("No interests added yet.")
    ).toBeInTheDocument();
  });

  it("navigates to edit profile page", async () => {
    const user = userEvent.setup();

    renderProfile();

    await user.click(
      screen.getByRole("button", { name: /edit profile/i })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/edit-profile");
  });

  it("renders female gender", () => {
    renderProfile();

    expect(
      screen.getByText("Gender")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("main")
    ).toHaveTextContent("female");
  });

  it("renders profile without optional fields", () => {
    renderProfile({
      name: "John Doe",
      interests: [],
    });

    expect(screen.getByText("John Doe")).toBeInTheDocument();

    expect(
      screen.getByText("No interests added yet.")
    ).toBeInTheDocument();
  });
});