import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import RequireEventManagerAuth from "./RequireEventManagerAuth";

vi.mock(
  "../context/EventManagerAuthContext",
  () => ({
    useEventManagerAuth: () => ({
      loading: false,
      isAuthenticated: true,
    }),
  })
);

describe(
  "RequireEventManagerAuth",
  () => {
    test(
      "renders component when authenticated",
      () => {
        render(
          <MemoryRouter>
            <RequireEventManagerAuth />
          </MemoryRouter>
        );
      }
    );
  }
);