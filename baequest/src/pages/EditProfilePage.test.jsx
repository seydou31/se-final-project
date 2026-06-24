import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import EditProfilePage from "./EditProfilePage";
import AppContext from "../context/AppContext";

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../utils/api.js", () => ({
  uploadProfilePicture: vi.fn(),
}));

const mockProfile = {
  name: "John Doe",
  age: 30,
  gender: "male",
  sexualOrientation: "straight",
  profession: "Developer",
  bio: "Love coding and coffee",
  interests: ["gaming", "travel"],
  convoStarter: "What's your favorite destination?",
  phoneNumber: "+1234567890",
  profilePicture: "/uploads/profile.jpg",
};

const renderPage = (profile = mockProfile) => {
  const onSubmit = vi.fn().mockResolvedValue();

  render(
    <MemoryRouter>
      <AppContext.Provider
        value={{
          currentProfile: profile,
        }}
      >
        <EditProfilePage onSubmit={onSubmit} />
      </AppContext.Provider>
    </MemoryRouter>
  );

  return { onSubmit };
};

describe("EditProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders edit profile heading", () => {
    renderPage();

    expect(
      screen.getByRole("heading", { name: /edit profile/i })
    ).toBeInTheDocument();
  });

  it("prefills profile data", () => {
    renderPage();

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Developer")).toBeInTheDocument();
    expect(screen.getByDisplayValue("30")).toBeInTheDocument();
    expect(
      screen.getByDisplayValue("Love coding and coffee")
    ).toBeInTheDocument();
  });

  it("renders phone number", () => {
    renderPage();

    expect(
      screen.getByDisplayValue("+1234567890")
    ).toBeInTheDocument();
  });

  it("renders selected interests", () => {
    renderPage();

    expect(screen.getByText("gaming")).toBeInTheDocument();
    expect(screen.getByText("travel")).toBeInTheDocument();
  });

  it("allows updating name", async () => {
    renderPage();

    const nameInput = screen.getByDisplayValue("John Doe");

    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, "Jane Doe");

    expect(nameInput).toHaveValue("Jane Doe");
  });

  it("submits updated profile", async () => {
    const { onSubmit } = renderPage();

    await userEvent.click(
      screen.getByRole("button", {
        name: /save changes/i,
      })
    );

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("navigates back to profile on cancel", async () => {
    renderPage();

    await userEvent.click(
      screen.getByRole("button", {
        name: /cancel/i,
      })
    );

    expect(mockNavigate).toHaveBeenCalledWith("/profile");
  });

  it("renders placeholder when profile missing", () => {
    renderPage(null);

    expect(
      screen.getByRole("heading", {
        name: /edit profile/i,
      })
    ).toBeInTheDocument();
  });
});