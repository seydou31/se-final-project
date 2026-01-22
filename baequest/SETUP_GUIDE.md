# BaeQuest Production Setup Guide

## 🎯 What We've Implemented

### 1. Error Boundaries ✅
- **What**: Catches JavaScript errors in React components
- **Where**: Wraps the entire app in `main.jsx`
- **Benefit**: App won't crash completely if a component fails
- **File**: [ErrorBoundary.jsx](src/components/ErrorBoundary.jsx)

### 2. Loading States ✅
- **What**: Shows spinners during async operations
- **Where**: Used in `App.jsx` during initial profile load
- **Benefit**: Better UX - users know something is happening
- **File**: [Loading.jsx](src/components/Loading.jsx)

### 3. Google Analytics ✅
- **What**: Tracks user behavior and page views
- **Where**: Automatically tracks all route changes
- **Setup Required**: Yes - add your GA tracking ID
- **File**: [analytics.js](src/utils/analytics.js)

### 4. Automated Tests ✅
- **What**: Comprehensive test suite covering all major features
- **Framework**: Vitest + React Testing Library
- **Commands**: `npm test` to run tests
- **Files**:
  - [App.test.jsx](src/components/App.test.jsx) - App integration tests
  - [ProfileModal.test.jsx](src/components/ProfileModal.test.jsx) - Profile tests
  - [Event.test.jsx](src/components/Event.test.jsx) - Event component tests
  - [Meet.test.jsx](src/components/Meet.test.jsx) - Event discovery tests
  - [Loading.test.jsx](src/components/Loading.test.jsx) - Loading component tests

---

## 📝 Setup Instructions

### Google Analytics Setup

1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property for your website
3. Get your Measurement ID (format: `G-XXXXXXXXXX`)
4. Add it to your `.env.local` file:
   ```bash
   VITE_GA_TRACKING_ID=G-XXXXXXXXXX
   ```

5. Analytics will automatically track:
   - Page views
   - User signups
   - Event check-ins
   - Profile creations

### Running Tests

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage report
npm run test:coverage
```

---

## 🚀 Deployment Checklist

Before deploying to production:

### Environment Variables

**Frontend (`.env.local`)**:
```env
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

**Backend (`.env`)**:
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://your-production-db
JWT_SECRET=your_strong_secret_key
GOOGLE_CLIENT_ID=your_google_oauth_client_id
SENDGRID_API_KEY=your_sendgrid_key
SENDGRID_FROM_EMAIL=verified@yourdomain.com
FRONTEND_URL=https://baequests.com
AWS_ACCESS_KEY_ID=your_aws_key (if using S3)
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_REGION=us-east-1
```

### Security Checks

- [ ] `.env.local` is in `.gitignore`
- [ ] All production API keys are different from development
- [ ] HTTPS enabled on production server
- [ ] CORS properly configured (only your domain)
- [ ] MongoDB has authentication enabled
- [ ] Rate limiting is active

### Build & Deploy

```bash
# Test production build locally
npm run build
npm run preview

# Deploy frontend
npm run deploy

# Deploy backend
# SSH into server and:
# 1. Pull latest code
# 2. npm install
# 3. Restart with PM2 or similar
```

---

## 📊 Monitoring & Analytics

### What's Tracked

1. **Page Views**: Every route change
2. **User Events**:
   - Sign up (email vs Google)
   - Login
   - Profile creation
   - Event check-in/checkout
   - "I'm Going" clicks

3. **Errors**: Application errors (in development, shows details)

### Viewing Analytics

1. Go to [Google Analytics Dashboard](https://analytics.google.com/)
2. Select your property
3. View real-time users, page views, events

---

## 🧪 Testing Strategy

### What We're Testing

1. **App Integration Tests** ([App.test.jsx](src/components/App.test.jsx))
   - Authentication flows (email/password and Google OAuth)
   - Profile creation and management
   - Navigation and routing
   - Error handling
   - Loading states

2. **Profile Modal Tests** ([ProfileModal.test.jsx](src/components/ProfileModal.test.jsx))
   - Create vs Edit mode
   - Form validation (age min/max, field lengths, required fields)
   - File upload validation (size limits, file types)
   - Interest selection (max 3 limit)

3. **Event Component Tests** ([Event.test.jsx](src/components/Event.test.jsx))
   - Event information display
   - "I'm Going" button functionality with double-click prevention
   - Check-in functionality
   - Real-time attendee count updates via Socket.io
   - Relative time display (hours, days)
   - Error handling

4. **Meet/Discovery Tests** ([Meet.test.jsx](src/components/Meet.test.jsx))
   - Event filtering by US state
   - Event filtering by day of week
   - Combined filters
   - Event discovery interface
   - Check-in flow transitions

5. **Loading Component Tests** ([Loading.test.jsx](src/components/Loading.test.jsx))
   - Spinner rendering
   - Custom messages
   - Fullscreen variant

### Test Coverage Summary

- **59 tests** covering critical user flows
- **Authentication**: Login, signup, Google OAuth
- **Profile Management**: Create, edit, validation
- **Events**: Discovery, filtering, check-in, "I'm Going"
- **Real-time**: Socket.io event listeners
- **Error Handling**: API failures, validation errors

### Example Tests

Simple component test:
```javascript
// Loading.test.jsx
it('renders loading spinner', () => {
  render(<Loading />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
});
```

Integration test with mocked API:
```javascript
// App.test.jsx
it('successfully logs in with email and password', async () => {
  api.login.mockResolvedValue({ token: 'mock-token' });
  api.getProfile.mockResolvedValue(mockProfile);

  await userEvent.type(screen.getByPlaceholderText(/email/i), 'test@example.com');
  await userEvent.type(screen.getByPlaceholderText(/password/i), 'password123');
  await userEvent.click(screen.getByRole('button', { name: /log in/i }));

  await waitFor(() => {
    expect(api.login).toHaveBeenCalledWith('test@example.com', 'password123');
  });
});
```

Real-time feature test:
```javascript
// Event.test.jsx
it('updates count when receiving socket event', async () => {
  render(<Event event={mockEvent} />);

  const socketCallback = mockSocket.on.mock.calls[0][1];
  socketCallback({ eventId: 'event-123', count: 10 });

  await waitFor(() => {
    expect(screen.getByText('10 people going')).toBeInTheDocument();
  });
});
```

### Adding More Tests

Create a file with `.test.jsx` extension next to your component:

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import YourComponent from './YourComponent';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

---

## 🔧 Troubleshooting

### Error Boundary Not Catching Errors

- Error boundaries only catch errors in **child components**
- They don't catch errors in:
  - Event handlers (use try/catch)
  - Async code (use try/catch)
  - Server-side rendering
  - Errors in the error boundary itself

### Analytics Not Tracking

1. Check if `VITE_GA_TRACKING_ID` is set
2. Verify you're in production mode (`import.meta.env.PROD`)
3. Check browser console for errors
4. Use Google Analytics DebugView to see real-time data

### Tests Failing

1. Make sure all dependencies are installed: `npm install`
2. Check if test environment is set up: `src/test/setup.js`
3. Run with verbose mode: `npm test -- --reporter=verbose`

---

## 📚 Additional Resources

- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Google Analytics 4](https://support.google.com/analytics/answer/10089681)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)

---

## 🎉 You're Ready for Production!

Your BaeQuest app now has:
- ✅ Error handling
- ✅ Loading states
- ✅ Analytics tracking
- ✅ Automated tests
- ✅ Clean, production-ready code

Good luck with your launch! 🚀
