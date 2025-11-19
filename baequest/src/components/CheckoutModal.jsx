import '../blocks/checkoutmodal.css';

export default function CheckoutModal({isOpen, onClose, handleCheckout}){
    return (
        <div className={`checkout ${isOpen ? "checkout_is-opened" : ""}`}>
            <div className="checkout__content">
                <h3 className="checkout__title">Are you sure you want to check out?</h3>
                <p className="checkout__paragraph">People won't be able to see you anymore</p>
                <button onClick={handleCheckout} className="checkout__checkout-btn">Check Out</button>
                <button onClick={onClose} className="checkout__cancel-btn">Cancel</button>
            </div>
        </div>
    )
}