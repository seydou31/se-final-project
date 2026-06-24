import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";

import SignUpPage from "./SignUpPage";

vi.mock("@react-oauth/google", () => ({
  GoogleLogin: () => <div>Google Signup</div>,
  useGoogleLogin: () => vi.fn(),
}));

vi.mock("../assets/logo.png", () => ({
  default: "logo.png",
}));

describe("SignUpPage", () => {
  const defaultProps = {
    handleCreateAccountSubmit: vi.fn(() =>
      Promise.resolve()
    ),
    handleGoogleSignup: vi.fn(),
    handleGoogleSignupWithToken: vi.fn(),
    loggingError: "",
    onSwitchToCreateProfile: vi.fn(),
  };

  test("renders signup page", () => {
    render(
      <MemoryRouter>
        <SignUpPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        /create your account/i
      )
    ).toBeInTheDocument();
  });

  test("renders email field", () => {
    render(
      <MemoryRouter>
        <SignUpPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(
        /you@example.com/i
      )
    ).toBeInTheDocument();
  });

  test("renders password field", () => {
    render(
      <MemoryRouter>
        <SignUpPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(
        /create password/i
      )
    ).toBeInTheDocument();
  });

  test("renders confirm password field", () => {
    render(
      <MemoryRouter>
        <SignUpPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(
        /repeat password/i
      )
    ).toBeInTheDocument();
  });

  test("renders terms checkbox", () => {
    render(
      <MemoryRouter>
        <SignUpPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("checkbox")
    ).toBeInTheDocument();
  });

  test("renders create account button", () => {
    render(
      <MemoryRouter>
        <SignUpPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: /create account/i,
      })
    ).toBeInTheDocument();
  });
});