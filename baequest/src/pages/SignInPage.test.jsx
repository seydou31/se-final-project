import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";

import SignInPage from "./SignInPage";

vi.mock("@react-oauth/google", () => ({
  GoogleOAuthProvider: ({ children }) => children,
  GoogleLogin: () => <div data-testid="google-login">Google Login</div>,
  useGoogleLogin: () => vi.fn(),
}));

vi.mock("../assets/logo.png", () => ({
  default: "logo.png",
}));

describe("SignInPage", () => {
  const defaultProps = {
    handleSubmit: vi.fn(),
    handleForgotPasswordModal: vi.fn(),
    handleResendVerification: vi.fn(),
    handleGoogleLogin: vi.fn(),
    loggingError: "",
  };

  test("renders sign in page", () => {
    render(
      <MemoryRouter>
        <SignInPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/welcome back/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /sign in/i,
      })
    ).toBeInTheDocument();
  });

  test("renders email field", () => {
    render(
      <MemoryRouter>
        <SignInPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(
        /name@example.com/i
      )
    ).toBeInTheDocument();
  });

  test("renders password field", () => {
    render(
      <MemoryRouter>
        <SignInPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByPlaceholderText(
        /••••••••/i
      )
    ).toBeInTheDocument();
  });

  test("renders forgot password button", () => {
    render(
      <MemoryRouter>
        <SignInPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("button", {
        name: /forgot/i,
      })
    ).toBeInTheDocument();
  });

  test("renders google login", () => {
    render(
      <MemoryRouter>
        <SignInPage {...defaultProps} />
      </MemoryRouter>
    );

    expect(
      screen.getByText(/google login/i)
    ).toBeInTheDocument();
  });
});