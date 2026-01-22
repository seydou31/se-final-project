import ReactGA from 'react-ga4';

// Initialize Google Analytics
export const initGA = () => {
  const trackingId = import.meta.env.VITE_GA_TRACKING_ID;

  if (trackingId && import.meta.env.PROD) {
    ReactGA.initialize(trackingId);
  }
};

// Track page views
export const trackPageView = (path) => {
  if (import.meta.env.PROD) {
    ReactGA.send({ hitType: 'pageview', page: path });
  }
};

// Track custom events
export const trackEvent = (category, action, label = null, value = null) => {
  if (import.meta.env.PROD) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }
};

// Track user signup
export const trackSignup = (method) => {
  trackEvent('User', 'Signup', method);
};

// Track user login
export const trackLogin = (method) => {
  trackEvent('User', 'Login', method);
};

// Track profile creation
export const trackProfileCreated = () => {
  trackEvent('Profile', 'Created', 'Profile Created');
};

// Track event check-in
export const trackEventCheckin = (eventTitle) => {
  trackEvent('Event', 'Check-in', eventTitle);
};

// Track event checkout
export const trackEventCheckout = (eventTitle) => {
  trackEvent('Event', 'Checkout', eventTitle);
};

// Track "I'm Going" clicks
export const trackImGoing = (eventTitle) => {
  trackEvent('Event', 'Im Going', eventTitle);
};

// Track errors
export const trackError = (errorMessage) => {
  trackEvent('Error', 'Application Error', errorMessage);
};
