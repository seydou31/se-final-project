import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, test, expect, vi } from "vitest";
import AddEvent from "./AddEvent";

vi.mock("../hooks/useEventManagerAuth", () => ({
  useEventManagerAuth: () => ({
    me: { stripeOnboardingComplete: false },
    loading: false,
  }),
}));

vi.mock("../utils/api.js", () => ({
  createCuratedEvent: vi.fn(),
  eventManagerGetOnboardingLink: vi.fn(),
}));

describe("AddEvent — photo preview", () => {
  test("shows an image preview after selecting a photo", async () => {
    render(
      <MemoryRouter>
        <AddEvent />
      </MemoryRouter>
    );

    const file = new File(["fake-bytes"], "banner.png", { type: "image/png" });
    const fileInput = document.querySelector('input[type="file"]');

    fireEvent.change(fileInput, { target: { files: [file] } });

    const preview = await waitFor(() => screen.getByAltText("Preview"));
    expect(preview).toBeInTheDocument();
    expect(preview.tagName).toBe("IMG");
    expect(preview.src).toMatch(/^data:/);
  });
});
