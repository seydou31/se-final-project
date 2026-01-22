import closeBtn from "../assets/close-button.svg";
import "../blocks/modal.css";

export default function ModalWrapper({
  isOpen,
  onClose,
  onOverlayClick,
  title,
  children,
  className = "modal",
  showCloseButton = true,
}) {
  return (
    <div
      className={`${className} ${isOpen ? `${className}_is-opened` : ""}`}
      onClick={onOverlayClick}
    >
      <div className={`${className}__content`}>
        {title && <h2 className={`${className}__title`}>{title}</h2>}
        {showCloseButton && (
          <button type="button" className={`${className}__close-btn`} onClick={onClose}>
            <img
              src={closeBtn}
              alt="close modal button"
              className={`${className}__close-btn-image`}
            />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
