import React from "react";
import classes from "bootstrap/dist/css/bootstrap.min.css";

const Maintenance = (props) => {
    const { 
        idOrderMs,
        idMaintenance,
        dateMn } = props;
    return (
        <div className={classes.maintenance}>
            <p>{`Order ${idOrderMs}`}</p>
            <p>{`ID Maintenance: ${idMaintenance}`}</p>
            <p>{`Tanggal Maintenance: ${dateMn}`}</p>
        </div>
    );
};

export default Maintenance;