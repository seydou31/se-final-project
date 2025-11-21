# instructions 
To access the project go to https://baequests.com
Backend is hosted at https://api.baequests.com
Backend github repo at [this link](https://github.com/seydou31/se-final-project-backend)
# 💞 BaeQuest

**BaeQuest** is a modern social dating platform designed to help people **meet face-to-face** through **real-world group events** rather than traditional profile-based or speed-dating formats.

Instead of endless swiping or awkward 3-minute sessions, BaeQuest curates relaxed, activity-based meetups — such as coffee gatherings, art workshops, hiking groups, or game nights — where users can form authentic connections through shared experiences and natural conversation.

The platform operates on a **monthly subscription model** that gives members **unlimited access** to events in their area, emphasizing genuine chemistry, comfort, and fun.

---

## 🌟 Core Features

1. **User Profiles** – Users sign up using email, phone, or social accounts, and add basic profile details.  
2. **Event Discovery** – Users browse curated local dating events happening near them.  
3. **Check-In System** – Geolocation-based check-in ensures users attend events physically.  
4. **Navigation Prompt** – If a user is too far from an event, they’re prompted to open directions via Google Maps.  
5. **Social Interaction** – Once checked in, users can see and interact with other attendees at the same event.  


---

## 🧠 Technologies Used

### Frontend
- **React.js** – For building the user interface and handling page navigation.  
- **React Router** – For protected routes and navigation between views (e.g., event page, user profiles, modals).  
- **CSS** – For styling components with responsive and modern UI design.  
- **Lucide React / Shadcn UI** – For icons and ready-made UI components. 
- **Framer Motion** – For smooth animations and transitions (used in modals or cards).  

### Geolocation & Maps
- **Browser Geolocation API** – To get the user’s live coordinates for check-ins.  
- **Google Maps API (Navigation)** – To open navigation directions to the event if the user is too far.  

Example:
```js
window.open(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`, "_blank");


