import React from "react";
import classes from "bootstrap/dist/css/bootstrap.min.css";

const Service = (props) => {
    const { 
        idOrderMs,
        idService,
        name } = props;
    return (
        <div className={classes.service}>
            <p>{`Order ${idOrderMs}`}</p>
            <p>{`ID Service: ${idService}`}</p>
            <p>{`Nama Service: ${name}`}</p>
        </div>
    );
};

export default Service;