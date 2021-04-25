import React from "react";
import Backdrop from "../Backdrop";
import classes from "./styles.module.css";

const Modal = (props) => {
    const { show, handleCloseModal, children } = props;
    return (
        <div>
            <Backdrop show={show} onClick={handleCloseModal} />
            <div className={[classes.modal, show ? classes.show : null].join(" ")}>
                {children}
            </div>
        </div>
    );
};

export default Modal;