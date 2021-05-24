import React from "react";
import ServiceList from "../Services/serviceList";
import classes from "bootstrap/dist/css/bootstrap.min.css";
import Order from "../Order/orderDetail";

const ManagedService = (props) => {
    const { 
        idOrderMs,
        actualStart,
        actualEnd,
        activated
    } = props;
    return (
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`ID Managed Service: ${idOrderMs}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Periode Mulai: ${actualStart}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Periode Selesai: ${actualEnd}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Status: ${activated}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagedService;