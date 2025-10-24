import { createPortal } from "react-dom";

//modal props
type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
};


function Modal({ isOpen, onClose, children }: ModalProps) {

    if (!isOpen) return null;

    return createPortal(
        <div>
            <div>
                <button onClick={onClose}>Chiudi</button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
}

export default Modal;