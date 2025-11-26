import '../blocks/checkoutmodal.css';
import ModalWrapper from './ModalWrapper.jsx';

export default function CheckoutModal({isOpen, onClose, onOverlayClick, handleCheckout}){
    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            onOverlayClick={onOverlayClick}
            title="Are you sure you want to check out?"
            className="checkout"
        >
            <p className="checkout__paragraph">People won't be able to see you anymore</p>
            <button onClick={handleCheckout} className="checkout__checkout-btn">Check Out</button>
            <button onClick={onClose} className="checkout__cancel-btn">Cancel</button>
        </ModalWrapper>
    )
}