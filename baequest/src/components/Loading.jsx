import '../blocks/loading.css';

export default function Loading({ fullScreen = false, message = 'Loading...' }) {
  const className = fullScreen ? 'loading loading--fullscreen' : 'loading';

  return (
    <div className={className}>
      <div className="loading__spinner"></div>
      {message && <p className="loading__message">{message}</p>}
    </div>
  );
}
