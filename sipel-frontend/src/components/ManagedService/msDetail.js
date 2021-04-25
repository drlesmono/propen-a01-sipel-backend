import React from "react";
import ServiceList from "../Services/serviceList";
import classes from "bootstrap/dist/css/bootstrap.min.css";
import Order from "../Order/orderDetail";

const ManagedService = (props) => {
    const { 
        idOrder,
        idOrderMs,
        actualStart,
        actualEnd,
        listService } = props;
    return (
        <div className={classes.managedService}>
            <p>{`Order ${ <Order 
                idOrder={Order.idOrder}/> }`}</p>
            <p>{`ID MS ${idOrderMs}`}</p>
            <p>{`Periode Mulai: ${actualStart}`}</p>
            <p>{`Periode Selesai: ${actualEnd}`}</p>
            <p>{listService.map((service) => (
                <ServiceList 
                    name={service.name}
                />
            ))}</p>
        </div>
    );
};

export default ManagedService;