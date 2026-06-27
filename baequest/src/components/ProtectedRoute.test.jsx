import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

describe("ProtectedRoute", () => {
  test("shows loading state", () => {
    render(
      <MemoryRouter>
        <ProtectedRoute
          isLoggedInLoading={true}
          isLoggedIn={false}
        >
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText(/loading/i)
    ).toBeInTheDocument();
  });

  test("renders children when authenticated", () => {
    render(
      <MemoryRouter>
        <ProtectedRoute
          isLoggedInLoading={false}
          isLoggedIn={true}
        >
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText(
        "Protected Content"
      )
    ).toBeInTheDocument();
  });
});