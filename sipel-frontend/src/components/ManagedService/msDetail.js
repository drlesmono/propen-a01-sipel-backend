import React from "react";
import ServiceList from "../Services/serviceList";
import classes from "bootstrap/dist/css/bootstrap.min.css";

const ManagedService = (props) => {
    const { 
        actualStart,
        actualEnd,
        listService } = props;
    return (
        <div className={classes.managedService}>
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