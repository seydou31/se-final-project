import { useState } from "react";
import { createCuratedEvent } from "../utils/api";
import "../blocks/add-event.css";

export default function AddEvent() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    lat: "",
    lng: "",
    startTime: "",
    endTime: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: "", message: "" });

    try {
      // Convert local datetime to ISO string (includes timezone offset)
      const startISO = new Date(formData.startTime).toISOString();
      const endISO = new Date(formData.endTime).toISOString();

      const eventData = {
        name: formData.name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        startTime: startISO,
        endTime: endISO,
      };
      // Only include coordinates if provided
      if (formData.lat) eventData.lat = parseFloat(formData.lat);
      if (formData.lng) eventData.lng = parseFloat(formData.lng);

      await createCuratedEvent(eventData);

      setStatus({ type: "success", message: "Event created successfully!" });
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        lat: "",
        lng: "",
        startTime: "",
        endTime: "",
      });
    } catch (err) {
      setStatus({ type: "error", message: err.message || "Failed to create event" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="add-event">
      <div className="add-event__container">
        <h1 className="add-event__title">Add Event</h1>
        <p className="add-event__subtitle">Create a curated event for BaeQuest users. Coordinates will be auto-detected from the address.</p>

        {status.message && (
          <div className={`add-event__status add-event__status--${status.type}`}>
            {status.message}
          </div>
        )}

        <form className="add-event__form" onSubmit={handleSubmit}>
          <div className="add-event__field">
            <label className="add-event__label">Event Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="add-event__input"
              placeholder="Singles Mixer at The Rooftop"
              required
            />
          </div>

          <div className="add-event__field">
            <label className="add-event__label">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="add-event__input"
              placeholder="123 Main St, Washington, DC"
              required
            />
          </div>

          <div className="add-event__row">
            <div className="add-event__field">
              <label className="add-event__label">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="add-event__input"
                placeholder="Washington"
              />
            </div>
            <div className="add-event__field">
              <label className="add-event__label">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="add-event__input"
                placeholder="DC"
                maxLength={3}
              />
            </div>
            <div className="add-event__field">
              <label className="add-event__label">Zipcode</label>
              <input
                type="text"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                className="add-event__input"
                placeholder="20001"
              />
            </div>
          </div>

          <div className="add-event__row">
            <div className="add-event__field">
              <label className="add-event__label">Latitude (optional)</label>
              <input
                type="number"
                name="lat"
                value={formData.lat}
                onChange={handleChange}
                className="add-event__input"
                placeholder="Auto from address"
                step="any"
              />
            </div>
            <div className="add-event__field">
              <label className="add-event__label">Longitude (optional)</label>
              <input
                type="number"
                name="lng"
                value={formData.lng}
                onChange={handleChange}
                className="add-event__input"
                placeholder="Auto from address"
                step="any"
              />
            </div>
          </div>

          <div className="add-event__row">
            <div className="add-event__field">
              <label className="add-event__label">Start Time</label>
              <input
                type="datetime-local"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                className="add-event__input add-event__input--datetime"
                required
              />
            </div>
            <div className="add-event__field">
              <label className="add-event__label">End Time</label>
              <input
                type="datetime-local"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                className="add-event__input add-event__input--datetime"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="add-event__submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </form>
      </div>
    </main>
  );
}
