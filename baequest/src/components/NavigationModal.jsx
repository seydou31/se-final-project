import '../blocks/navigation.css'
import ModalWrapper from './ModalWrapper.jsx';

export default function NavigationModal({isOpen, onClose, onOverlayClick, handleNavigate}){
    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            onOverlayClick={onOverlayClick}
            title="You are too far from the event."
            className="navigation"
        >
            <button onClick={handleNavigate} className="navigation__checkout-btn">Navigate</button>
            <button onClick={onClose} className="navigation__cancel-btn">Cancel</button>
        </ModalWrapper>
    )
}