import React from "react";
import classes from "./styles.module.css";

const Backdrop = (props) => {
    const { show, onClick } = props;
    return show ? <div className={classes.backdrop} onClick={onClick} /> : null;
};

export default Backdrop;