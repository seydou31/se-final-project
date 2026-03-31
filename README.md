# BaeQuest

**BaeQuest** is a social dating platform that connects people through real-world events. Instead of swiping or messaging strangers, users physically attend curated local events, check in via geolocation, and discover other compatible attendees in the same room.

Live at: https://baequests.com
Backend repo: https://github.com/seydou31/se-final-project-backend

---

## Core Features

### For Users
- **Event Discovery** – Browse curated dating events near you, sorted by distance
- **Geolocation Check-In** – Check in only when physically present at the event (within ~500m)
- **Auto-Checkout** – Automatically checked out when you leave the event area or the event ends
- **Live Attendee View** – See compatible users currently checked in at the same event (real-time via Socket.io)
- **Live Check-In Counts** – Events show a live breakdown of men and women checked in
- **I'm Going** – Save events to your personal list before attending
- **Post-Event Feedback** – Rate your experience via email link after checkout
- **Stripe Payments** – Pay per event when a ticket price is set

### For Event Managers
- **Invite-Only Signup** – Register with an invite code
- **Event Creation** – Create events with address, time, photo, and description (coordinates auto-detected)
- **Dashboard** – View check-in counts and earnings per event
- **Stripe Connect** – Connect a bank account to receive payouts

---

## Tech Stack

- **React** – UI and routing
- **React Router** – Protected routes and navigation
- **Socket.io Client** – Real-time attendee updates
- **Stripe.js** – Payment checkout redirect
- **CSS** – Custom responsive styling

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page |
| `/events` | Event discovery and check-in |
| `/event-manager/signup` | Event manager registration |
| `/event-manager/login` | Event manager login |
| `/event-manager/dashboard` | Event manager dashboard |
| `/event-manager/create-event` | Create a new event |
| `/event-manager/onboarding` | Stripe Connect onboarding |
| `/about` | About page |
| `/contact` | Contact page |
| `/privacy-policy` | Privacy policy |
| `/terms` | Terms of service |

---

## Local Development

```bash
git clone https://github.com/seydou31/se-final-project.git
cd se-final-project/baequest
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

Set `VITE_API_URL` in a `.env` file if your backend runs on a different port:

```env
VITE_API_URL=http://localhost:3001
```
