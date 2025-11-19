import '../blocks/navigation.css'

export default function NavigationModal({isOpen, onClose, handleNavigate}){
    return (
         <div className={`navigation ${isOpen ? "navigation_is-opened" : ""}`}>
            <div className="navigation__content">
                <h3 className="navigation__title">You are too far from the event.</h3>
                <button onClick={handleNavigate}  className="navigation__checkout-btn">Navigate</button>
                <button onClick={onClose} className="navigation__cancel-btn">Cancel</button>
            </div>
        </div>
    )
}