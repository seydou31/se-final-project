import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import EventsPage from "./EventsPage";
import SocketContext from "../context/SocketContext";

import useEventStore from "../store/useEventStore";
import { getAllEvents } from "../utils/api";
import { act } from "@testing-library/react";

// Mock API
vi.mock("../utils/api", () => ({
getAllEvents: vi.fn(),
markAsGoing: vi.fn(),
}));

// Mock Event component
vi.mock("../components/Event", () => ({
default: ({ event }) => ( <div data-testid="event-card">{event.title}</div>
),
}));

// Mock OtherUsers component
vi.mock("../components/OtherUsers", () => ({
default: () => <div>Other Users View</div>,
}));

// Mock Zustand store
vi.mock("../store/useEventStore");

const mockEvents = [
{
_id: "1",
title: "Speed Dating Night",
},
{
_id: "2",
title: "Coffee Meetup",
},
];

const renderComponent = () => {
return render( <MemoryRouter>
<SocketContext.Provider value={{ eventVersion: 0 }}> <EventsPage
       handleCheckin={vi.fn()}
       handleCheckoutModal={vi.fn()}
       otherProfiles={[]}
       setOtherProfiles={vi.fn()}
     />
</SocketContext.Provider> </MemoryRouter>
);
};

describe("EventsPage", () => {
beforeEach(() => {
vi.clearAllMocks();

useEventStore.mockReturnValue({
  isCheckedIn: false,
  currentEvent: null,
});

global.navigator.geolocation = {
  getCurrentPosition: vi.fn((success) =>
    success({
      coords: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    })
  ),
};

});

it("renders page heading", async () => {
getAllEvents.mockResolvedValue(mockEvents);

renderComponent();

expect(
  await screen.findByText("Curated Events")
).toBeInTheDocument();

});

it("renders events from api", async () => {
getAllEvents.mockResolvedValue(mockEvents);

renderComponent();

const cards = await screen.findAllByTestId("event-card");

expect(cards).toHaveLength(2);

});

it("renders empty state", async () => {
getAllEvents.mockResolvedValue([]);

renderComponent();

expect(
  await screen.findByText("No events found")
).toBeInTheDocument();

});

it("renders search filters", async () => {
getAllEvents.mockResolvedValue([]);

renderComponent();

expect(await screen.findByPlaceholderText("e.g. New York")).toBeInTheDocument();
expect(screen.getByPlaceholderText("e.g. Manhattan")).toBeInTheDocument();
expect(screen.getByPlaceholderText("10024")).toBeInTheDocument();

});

it("search button triggers api call", async () => {
getAllEvents.mockResolvedValue([]);

renderComponent();

const searchBtn = await screen.findByRole("button", {
  name: /search events/i,
});

fireEvent.click(searchBtn);

await waitFor(() => {
  expect(getAllEvents).toHaveBeenCalled();
});

});

it("clear filters button exists", async () => {
getAllEvents.mockResolvedValue([]);

renderComponent();

expect(
  await screen.findByRole("button", {
    name: /clear filters/i,
  })
).toBeInTheDocument();

});

it("renders checked-in view when user is checked in", async () => {
  useEventStore.mockReturnValue({
    isCheckedIn: true,
    currentEvent: { _id: "event1" },
  });

  await act(async () => {
    renderComponent();
  });

  expect(
    screen.getByText("Other Users View")
  ).toBeInTheDocument();
});
});
