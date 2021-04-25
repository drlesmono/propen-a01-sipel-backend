import React from "react";
import classes from "bootstrap/dist/css/bootstrap.min.css";
import Order from "../Order/orderDetail";

const ProjectInstallation = (props) => {
    const { 
        idOrder,
        startPI, 
        deadline } = props;
    return (
        <div className={classes.projectInstallation}>
            <p>{`ID Order ${ <Order 
                idOrder={Order.idOrder}/> }`}</p>
            <p>{`Tanggal Mulai Proyek: ${startPI}`}</p>
            <p>{`Tanggal Selesai Proyek: ${deadline}`}</p>
        </div>
    );
};

export default ProjectInstallation;