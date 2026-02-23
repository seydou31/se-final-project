import { useState, useContext } from "react";
import { createCuratedEvent } from "../utils/api";
import AppContext from "../context/AppContext";
import "../blocks/add-event.css";

export default function AddEvent() {
  const { isLoggedIn } = useContext(AppContext);
  const [passphrase, setPassphrase] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    startTime: "",
    endTime: "",
    description: "",
    link: "",
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
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
        description: formData.description,
        link: formData.link,
      };

      await createCuratedEvent(eventData, photoFile, isLoggedIn ? null : passphrase);

      setStatus({ type: "success", message: "Event created successfully!" });
      setFormData({
        name: "",
        address: "",
        city: "",
        state: "",
        zipcode: "",
        startTime: "",
        endTime: "",
        description: "",
        link: "",
      });
      setPhotoFile(null);
      setPhotoPreview(null);
      setPassphrase("");
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
        <p className="add-event__subtitle">Create a curated event for BaeQuest users. Coordinates are auto-detected from the address.</p>

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

          <div className="add-event__field">
            <label className="add-event__label">Description (optional)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="add-event__input add-event__textarea"
              placeholder="Describe the event, dress code, what to expect..."
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="add-event__field">
            <label className="add-event__label">Event Photo (optional)</label>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handlePhotoChange}
              className="add-event__input add-event__input--file"
            />
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Preview"
                className="add-event__photo-preview"
              />
            )}
          </div>

          <div className="add-event__field">
            <label className="add-event__label">Event Link (optional)</label>
            <input
              type="url"
              name="link"
              value={formData.link}
              onChange={handleChange}
              className="add-event__input"
              placeholder="https://eventbrite.com/..."
            />
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

          {!isLoggedIn && (
            <div className="add-event__field">
              <label className="add-event__label">Event Manager Passphrase</label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                className="add-event__input"
                placeholder="Enter your passphrase"
                required
              />
            </div>
          )}

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
