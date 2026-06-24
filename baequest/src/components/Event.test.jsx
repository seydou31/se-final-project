import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Event from "./Event";

vi.mock("../utils/getImageUrl", () => ({
default: vi.fn((url) => url),
}));

vi.mock("react-hot-toast", () => ({
default: {
success: vi.fn(),
error: vi.fn(),
},
}));

const now = Date.now();

const defaultEvent = {
_id: "1",
name: "Coffee Meetup",
photo: "https://example.com/event.jpg",
address: "123 Main Street",
description: "Meet fellow coffee lovers",
link: "https://example.com",
startTime: new Date(now + 60 * 60 * 1000).toISOString(),
endTime: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
ticketPrice: 0,
goingCount: 5,
isUserGoing: false,
distanceKm: 10,
liveMen: 0,
liveWomen: 0,
};

describe("Event Component", () => {
let handleCheckin;
let handleImGoing;

beforeEach(() => {
handleCheckin = vi.fn();
handleImGoing = vi.fn().mockResolvedValue({
isGoing: true,
goingCount: 6,
});
});

it("renders event name", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(screen.getByText("Coffee Meetup")).toBeInTheDocument();

});

it("renders event image", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(
  screen.getByAltText("Coffee Meetup")
).toBeInTheDocument();

});

it("renders address link", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(
  screen.getByText("123 Main Street")
).toBeInTheDocument();

});

it("renders description", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(
  screen.getByText("Meet fellow coffee lovers")
).toBeInTheDocument();

});

it("shows free badge", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

  expect(screen.getAllByText("Free")).toHaveLength(2);
});

it("renders attendee count", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(screen.getByText(/5 people/i)).toBeInTheDocument();

});

it("renders singular attendee text", () => {
render(
<Event
event={{
...defaultEvent,
goingCount: 1,
}}
handleCheckin={handleCheckin}
handleImGoing={handleImGoing}
currentTime={now}
/>
);

expect(screen.getByText(/1 person/i)).toBeInTheDocument();

});

it("shows I'm Going button initially", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(
  screen.getByRole("button", { name: /i'm going/i })
).toBeInTheDocument();

});

it("calls handleImGoing when clicked", async () => {
const user = userEvent.setup();

render(
  <Event
    event={defaultEvent}
    handleCheckin={handleCheckin}
    handleImGoing={handleImGoing}
    currentTime={now}
  />
);

await user.click(
  screen.getByRole("button", { name: /i'm going/i })
);

expect(handleImGoing).toHaveBeenCalledWith(defaultEvent);

});

it("updates to Going state after click", async () => {
const user = userEvent.setup();

render(
  <Event
    event={defaultEvent}
    handleCheckin={handleCheckin}
    handleImGoing={handleImGoing}
    currentTime={now}
  />
);

await user.click(
  screen.getByRole("button", { name: /i'm going/i })
);

await waitFor(() => {
  expect(
    screen.getByRole("button", { name: /going/i })
  ).toBeInTheDocument();
});

});

it("shows check in button when event starts within 2 hours", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(
  screen.getByRole("button", { name: /check in/i })
).toBeInTheDocument();

});

it("calls handleCheckin when check in clicked", async () => {
const user = userEvent.setup();

render(
  <Event
    event={defaultEvent}
    handleCheckin={handleCheckin}
    handleImGoing={handleImGoing}
    currentTime={now}
  />
);

await user.click(
  screen.getByRole("button", { name: /check in/i })
);

expect(handleCheckin).toHaveBeenCalledWith(defaultEvent);

});

it("shows I'm Here when event is live", () => {
const liveEvent = {
...defaultEvent,
startTime: new Date(now - 30 * 60 * 1000).toISOString(),
endTime: new Date(now + 30 * 60 * 1000).toISOString(),
};

render(
  <Event
    event={liveEvent}
    handleCheckin={handleCheckin}
    handleImGoing={handleImGoing}
    currentTime={now}
  />
);

expect(
  screen.getByRole("button", { name: /i'm here/i })
).toBeInTheDocument();

});

it("renders external link", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(
  screen.getByText(/more info/i)
).toBeInTheDocument();

});

it("renders live attendee counts", () => {
render(
<Event
event={{
...defaultEvent,
liveMen: 2,
liveWomen: 3,
}}
handleCheckin={handleCheckin}
handleImGoing={handleImGoing}
currentTime={now}
/>
);

expect(
  screen.getByText(/5 here now/i)
).toBeInTheDocument();

});

it("renders distance", () => {
render( <Event
     event={defaultEvent}
     handleCheckin={handleCheckin}
     handleImGoing={handleImGoing}
     currentTime={now}
   />
);

expect(
  screen.getByText(/6.2 mi/i)
).toBeInTheDocument();

});
});
