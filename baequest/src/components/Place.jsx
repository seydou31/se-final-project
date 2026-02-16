import { useState } from 'react';
import { MapPin, Users } from 'lucide-react';
import { getPlacePhotoUrl } from '../utils/api';
import '../blocks/place.css';

export default function Place({ place, handleCheckin, isCheckingIn }) {
  const [imageError, setImageError] = useState(false);

  const handleCheckinClick = () => {
    if (isCheckingIn) return;
    handleCheckin(place);
  };

  const photoRef = place.photos?.[0]?.reference;
  const photoUrl = photoRef ? getPlacePhotoUrl(photoRef) : null;

  return (
    <div className="place">
      {!imageError && photoUrl ? (
        <img
          src={photoUrl}
          alt={place.name}
          className="place__image"
          loading="lazy"
          onError={() => setImageError(true)}
        />
      ) : (
        <div className="place__image place__image--placeholder">
          <MapPin size={48} />
        </div>
      )}
      <div className="place__content">
        <h2 className="place__name">{place.name}</h2>
        <p className="place__address">
          <MapPin size={16} />
          {place.address}
        </p>
        {place.rating && (
          <p className="place__rating">
            {'★'.repeat(Math.round(place.rating))}
            {'☆'.repeat(5 - Math.round(place.rating))}
            <span className="place__rating-value">{place.rating}</span>
          </p>
        )}
        {place.openNow !== undefined && (
          <p className={`place__status ${place.openNow ? 'place__status--open' : 'place__status--closed'}`}>
            {place.openNow ? 'Open Now' : 'Closed'}
          </p>
        )}
        {place.userCount > 0 && (
          <p className="place__users">
            <Users size={16} />
            {place.userCount} {place.userCount === 1 ? 'person' : 'people'} checked in
          </p>
        )}
        <div className="place__actions">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="place__map-link"
          >
            View on Map
          </a>
          <button
            onClick={handleCheckinClick}
            className="place__checkin"
            disabled={isCheckingIn}
          >
            {isCheckingIn ? "Checking in..." : "I'm here"}
          </button>
        </div>
      </div>
    </div>
  );
}
