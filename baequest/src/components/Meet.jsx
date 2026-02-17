import { useState, useEffect, useRef } from "react";
import Place from "./Place";
import OtherUsers from "./OtherUsers";
import Loading from "./Loading";
import { getNearbyPlaces, getNearbyCuratedEvents } from "../utils/api";
import toast from 'react-hot-toast';
import "../blocks/meetup.css";

export default function Meet({
  handleCheckin,
  otherProfiles,
  setOtherProfiles,
  handleCheckoutModal,
  currentPlace,
  isCheckedIn,
  setCurrentPlace,
  setIsCheckedIn,
}) {
  const [places, setPlaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [checkingInPlaceId, setCheckingInPlaceId] = useState(null);
  const hasFetchedRef = useRef(false);

  // Only fetch places on first mount (not on every navigation)
  useEffect(() => {
    if (!isCheckedIn && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getUserLocation();
    }
  }, [isCheckedIn]);

  const getUserLocation = () => {
    setIsLoading(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        await fetchNearbyPlaces(latitude, longitude);
      },
      (error) => {
        setIsLoading(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Please allow location access to find places near you");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out");
            break;
          default:
            setLocationError("An error occurred while getting your location");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      // Fetch curated events first (they have priority)
      let curatedEvents = [];
      try {
        curatedEvents = await getNearbyCuratedEvents(lat, lng);
      } catch (err) {
        console.error("Failed to fetch curated events:", err);
        // Continue with Google Places even if curated events fail
      }

      // Fetch Google Places
      const googlePlaces = await getNearbyPlaces(lat, lng);

      // Combine: curated events first, then Google Places
      setPlaces([...curatedEvents, ...googlePlaces]);
    } catch (error) {
      console.error("Failed to fetch nearby places:", error);
      toast.error("Failed to fetch nearby places");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlaceCheckin = async (place) => {
    setCheckingInPlaceId(place.placeId);
    try {
      await handleCheckin({
        placeId: place.placeId,
        placeName: place.name,
        placeAddress: place.address,
      });
    } finally {
      setCheckingInPlaceId(null);
    }
  };

  const handleRetry = () => {
    getUserLocation();
  };

  if (isCheckedIn && currentPlace) {
    return (
      <OtherUsers
        handleCheckoutModal={handleCheckoutModal}
        otherProfiles={otherProfiles}
        setOtherProfiles={setOtherProfiles}
        currentPlace={currentPlace}
        setCurrentPlace={setCurrentPlace}
        setIsCheckedIn={setIsCheckedIn}
      />
    );
  }

  return (
    <div className="meet">
      <h1 className="meet__title">Find people nearby</h1>
      <p className="meet__subtitle">Check in at a location to see who else is there</p>

      {isLoading ? (
        <Loading message="Finding places near you..." />
      ) : locationError ? (
        <div className="meet__error">
          <p className="meet__error-text">{locationError}</p>
          <button onClick={handleRetry} className="meet__btn">
            Try Again
          </button>
        </div>
      ) : places.length === 0 ? (
        <div className="meet__empty">
          <p>No places found nearby</p>
          <button onClick={handleRetry} className="meet__btn">
            Refresh
          </button>
        </div>
      ) : (
        <>
          <div className="meet__places">
            {places.map((place) => (
              <Place
                key={place.placeId}
                place={place}
                handleCheckin={handlePlaceCheckin}
                isCheckingIn={checkingInPlaceId === place.placeId}
              />
            ))}
          </div>
          <p className="meet__hint">Don't see your location? Try refreshing.</p>
          <button onClick={handleRetry} className="meet__refresh-btn">
            Refresh Places
          </button>
        </>
      )}
    </div>
  );
}
