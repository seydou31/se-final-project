import { describe, test, expect, vi } from "vitest";
import {
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

vi.mock("./Main", () => ({
  default: () => (
    <div>Main Page</div>
  ),
}));

vi.mock("../pages/AboutUs", () => ({
  default: () => (
    <div>About Us Page</div>
  ),
}));

vi.mock("../pages/Contact", () => ({
  default: () => (
    <div>Contact Page</div>
  ),
}));

vi.mock("../pages/SignInPage", () => ({
  default: () => (
    <h1>Sign In</h1>
  ),
}));

vi.mock("../pages/SignUpPage", () => ({
  default: () => (
    <h1>Create Account</h1>
  ),
}));

vi.mock("./Profile", () => ({
  default: () => (
    <div>Profile Page</div>
  ),
}));

vi.mock("./Loading", () => ({
  default: () => (
    <div>Loading...</div>
  ),
}));

vi.mock("./ProtectedRoute", () => ({
  default: ({ children }) =>
    children,
}));

vi.mock(
  "./RequireEventManagerAuth",
  () => ({
    default: () => (
      <div>
        Event Manager Protected
      </div>
    ),
  })
);

vi.mock(
  "../hooks/useEventManagerAuth",
  () => ({
    useEventManagerAuth: () => ({
      loading: false,
      isAuthenticated: true,
      me: {},
    }),
  })
);

vi.mock("../utils/api", () => ({
  getProfile: vi
    .fn()
    .mockRejectedValue(
      new Error("No session")
    ),
}));

vi.mock("react-hot-toast", () => ({
  Toaster: () => <div />,
}));

describe("App Routing", () => {
  test("renders home page", () => {
    render(
      <MemoryRouter
        initialEntries={["/"]}
      >
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Main Page"
      )
    ).toBeInTheDocument();
  });

  test("renders signin page", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/signin",
        ]}
      >
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole(
        "heading",
        {
          name: /sign in/i,
        }
      )
    ).toBeInTheDocument();
  });

  test("renders signup page", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/signup",
        ]}
      >
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByRole(
        "heading",
        {
          name:
            /create account/i,
        }
      )
    ).toBeInTheDocument();
  });

  test("renders about page", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/about",
        ]}
      >
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "About Us Page"
      )
    ).toBeInTheDocument();
  });

  test("renders contact page", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/contact",
        ]}
      >
        <App />
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Contact Page"
      )
    ).toBeInTheDocument();
  });
});