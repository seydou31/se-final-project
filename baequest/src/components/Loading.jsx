import "../blocks/loading.css";

export default function Loading({
  fullScreen = false,
  message = "Loading...",
}) {
  const className = fullScreen
    ? "loading loading--fullscreen"
    : "loading";

  return (
    <div className={className}>
      {/* Harmonium Loader */}
      <div className="loading__harmonium">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {message && (
        <p className="loading__message">
          {message}
        </p>
      )}
    </div>
  );
}