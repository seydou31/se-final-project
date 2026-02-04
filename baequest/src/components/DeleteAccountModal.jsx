import '../blocks/deleteaccount.css';
import ModalWrapper from './ModalWrapper.jsx';

export default function DeleteAccountModal({isOpen, onClose, onOverlayClick, handleDeleteAccount, isDeletingAccount = false}){
    return (
        <ModalWrapper
            isOpen={isOpen}
            onClose={onClose}
            onOverlayClick={onOverlayClick}
            title="Are you sure you want to delete your account?"
            className="deleteaccount"
        >
            <p className="deleteaccount__paragraph">This action cannot be undone. All your data will be permanently deleted.</p>
            <button
                onClick={handleDeleteAccount}
                className="deleteaccount__delete-btn"
                disabled={isDeletingAccount}
            >
                {isDeletingAccount ? "Deleting..." : "Delete Account"}
            </button>
            <button
                onClick={onClose}
                className="deleteaccount__cancel-btn"
                disabled={isDeletingAccount}
            >
                Cancel
            </button>
        </ModalWrapper>
    )
}
