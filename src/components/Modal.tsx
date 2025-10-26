import { useEffect } from "react";
import { createPortal } from "react-dom";

//modal props
type ModalProps = {
    isOpen: boolean;
    children: React.ReactNode;
};


function Modal({ isOpen, children }: ModalProps) {

    //gestisco lo scroll con useEffect lavorando direttamente sul dom
    useEffect(() => {
        if (isOpen) {
            //se la modale è aperta blocco lo scroll
            document.body.style.overflow = 'hidden';
        } else {
            //altrimenti ripristino lo scroll
            document.body.style.overflow = '';
        }

        return () => {
            //uso cleanup function per ripristinare lo scroll se la modale viene chiusa
            document.body.style.overflow = '';
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 bg-sky/60 backdrop-blur flex items-center justify-center z-[9999]">
            <div className="bg-sky-300 rounded-xl p-8 max-w-md w-11/12 text-center shadow-2xl">
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')!
    );
}

export default Modal;