# Backend Implementation Guide: State-Based Event Filtering

## Overview
Complete implementation for state-based event filtering in BaeQuest. Users can now select a state from a dropdown, and events will be fetched from that state's major city using Google Places API.

## All Changes Completed ✓

### Frontend Changes (Completed ✓)
- Added state dropdown to Meet component with all 50 US states
- Updated `getEvents()` API function to pass state parameter to backend
- Updated `fetch-google-events` to send state in request body
- Added CSS styling for state filter dropdown
- Modified `handleFindEvents()` to pass state to API

### Backend Changes (Completed ✓)
- Added state field to event model schema
- Updated events controller to filter by state query parameter
- Created state coordinates mapping for all 50 US states
- Updated `fetchAndCreateEvents` to fetch events based on state coordinates
- Added geocoding function to automatically detect state from coordinates
- Created migration script for existing events

## Implementation Files Created

The following files have been created and are ready to be integrated into your backend:

### 1. Event Model with State Field
**File**: `baequest-server-models-event.js` → Copy to `baequest-server/models/event.js`

The event schema now includes a state field:

```javascript
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  location: {
    name: String,
    lat: Number,
    lng: Number,
  },
  state: { type: String }, // US state name for filtering
  date: { type: Date, required: true },
  endTime: { type: Date, required: true },
  category: String,
  image: String,
  googlePlaceId: String,
  createdAt: { type: Date, default: Date.now },
});
```

### 2. Event Controller with State Filtering and Geocoding
**File**: `baequest-server-controllers-event.js` → Copy to `baequest-server/controllers/event.js`

Key features:
- **State-based filtering**: Filters events by state query parameter
- **Geocoding function**: Automatically detects state from coordinates using Google Geocoding API
- **State coordinates mapping**: Uses state coordinates instead of user location to fetch events

```javascript
// Events endpoint now accepts ?state=California query parameter
module.exports.events = async (req, res, next) => {
  const now = new Date();
  const { state } = req.query;

  try {
    const filter = { endTime: { $gt: now } };
    if (state) {
      filter.state = state;
    }

    const data = await event.find(filter).orFail(() => {
      throw new NotFoundError("No event found");
    });

    logger.info(`Found ${data.length} active events${state ? ` in ${state}` : ''}`);
    res.status(200).send(data);
  } catch (err) {
    next(err);
  }
};
```

### 3. State Coordinates Mapping
**File**: `baequest-server-constants-stateCoordinates.js` → Copy to `baequest-server/constants/stateCoordinates.js`

Maps each US state to its major city coordinates for Google Places API searches:

```javascript
const STATE_COORDINATES = {
  "California": { lat: 34.0522, lng: -118.2437 }, // Los Angeles
  "New York": { lat: 40.7128, lng: -74.0060 }, // NYC
  "Texas": { lat: 29.7604, lng: -95.3698 }, // Houston
  // ... all 50 states
};
```

### 4. Updated Event Creation with State Detection
The `fetchAndCreateEvents` function now:

1. **Accepts state parameter** from the request body
2. **Uses state coordinates** from the mapping to search for events in that state
3. **Geocodes each place** to automatically detect and store its state
4. **Creates events** with the state field populated

```javascript
module.exports.fetchAndCreateEvents = async (req, res, next) => {
  const { state, radius = 10000 } = req.body;
  let searchLocation;

  // Use state coordinates if provided, otherwise default to DC
  if (state && STATE_COORDINATES[state]) {
    searchLocation = STATE_COORDINATES[state];
    logger.info(`Fetching events for state: ${state}`);
  } else {
    searchLocation = { lat: 38.9072, lng: -77.0369 };
  }

  // Fetch places and automatically detect their state via geocoding
  for (const place of places) {
    const detectedState = await getStateFromCoordinates(
      place.location.lat,
      place.location.lng,
      apiKey
    );
    // Events are created with the detected state
  }
};
```

### 5. Migration Script for Existing Events
**File**: `baequest-server-utils-addStateToEvents.js` → Copy to `baequest-server/utils/addStateToEvents.js`

Adds state information to events that were created before this feature:

- Finds all events without a state field
- Uses Google Geocoding API to detect state from coordinates
- Updates each event with the detected state
- Includes rate limiting to avoid API quotas

**Run with**: `node utils/addStateToEvents.js`

## How to Deploy Backend Changes

Since your backend is in Git history, you need to copy the generated files to the appropriate locations:

### Step 1: Restore Backend Directory Structure
```bash
# From project root
mkdir -p baequest-server/models
mkdir -p baequest-server/controllers
mkdir -p baequest-server/constants
mkdir -p baequest-server/utils
```

### Step 2: Copy Implementation Files
```bash
# Copy event model
cp baequest-server-models-event.js baequest-server/models/event.js

# Copy event controller
cp baequest-server-controllers-event.js baequest-server/controllers/event.js

# Copy state coordinates
cp baequest-server-constants-stateCoordinates.js baequest-server/constants/stateCoordinates.js

# Copy migration script (optional)
cp baequest-server-utils-addStateToEvents.js baequest-server/utils/addStateToEvents.js
```

### Step 3: Restore Other Backend Files from Git
```bash
# Restore remaining files from git history
git show c510262:baequest-server/app.js > baequest-server/app.js
git show c510262:baequest-server/package.json > baequest-server/package.json
# ... (restore other necessary files)
```

### Step 4: Enable Geocoding API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Library
3. Search for "Geocoding API"
4. Click "Enable"

### Step 5: Run Migration (Optional)
If you have existing events without state information:
```bash
cd baequest-server
node utils/addStateToEvents.js
```

## Testing the Implementation

### Backend Testing
```bash
# Get all events
curl http://localhost:3001/events

# Get events in California
curl http://localhost:3001/events?state=California

# Fetch new events for a specific state
curl -X POST http://localhost:3001/fetch-google-events \
  -H "Content-Type: application/json" \
  -d '{"state": "California"}'
```

### Frontend Testing
1. Open the Meet page
2. Select a state from the dropdown (e.g., "California")
3. Click "Find" button
4. Verify that:
   - Events are fetched from California
   - Events display correctly
   - Only California events are shown when filter is active

## How It Works

### User Flow
1. **User selects state**: Chooses "California" from dropdown
2. **Frontend sends request**: `POST /fetch-google-events` with `{ state: "California" }`
3. **Backend uses state coordinates**: Looks up California coordinates (LA: 34.0522, -118.2437)
4. **Google Places API call**: Fetches places near Los Angeles
5. **Geocoding**: Each place is geocoded to detect its actual state
6. **Events created**: Events saved with state field set to "California"
7. **Events fetched**: `GET /events?state=California` returns only CA events
8. **Display**: Events shown to user

## Summary of All Changes

### ✅ Frontend (Completed)
- **[Meet.jsx](baequest/src/components/Meet.jsx:51-68)** - State dropdown with 50 US states
- **[App.jsx](baequest/src/components/App.jsx:275-283)** - Pass state to API
- **[api.js](baequest/src/utils/api.js:70-96)** - Send state to backend
- **[meetup.css](baequest/src/blocks/meetup.css:46-83)** - Dropdown styling

### ✅ Backend (Files Created, Ready to Deploy)
- **baequest-server-models-event.js** - Event model with state field
- **baequest-server-controllers-event.js** - Controller with filtering & geocoding
- **baequest-server-constants-stateCoordinates.js** - All 50 state coordinates
- **baequest-server-utils-addStateToEvents.js** - Migration script

## Important Notes

### API Considerations
- **Geocoding API quota**: Default is 40,000 requests/month (free tier)
- **Rate limiting**: Migration script includes 200ms delay between requests
- **Error handling**: Events without successful geocoding will have `state: null`

### Performance
- **Caching**: Consider implementing geocoding result caching
- **Batch processing**: Migration script processes events one at a time to avoid rate limits
- **Database indexing**: Consider adding index on state field for faster queries

### Backward Compatibility
- State field is optional in the schema
- Events without state will still be returned when no filter is applied
- Existing functionality remains unchanged when state filter is not used
