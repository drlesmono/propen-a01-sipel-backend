import React from "react";
import ServiceList from "../Services/serviceList";
import classes from "bootstrap/dist/css/bootstrap.min.css";
import Order from "../Order/orderDetail";

const ManagedService = (props) => {
    const { 
        idOrderMs,
        actualStart,
        actualEnd,
        listService } = props;
    return (
        <div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`ID Managed Service: ${idOrderMs}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Periode Mulai: ${actualStart}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Periode Selesai: ${actualEnd}`}</p>
                    </div>
                </div>
            </div>
        </div>
       /*  {/* </div>
        <p>{listService.map((service) => (<ServiceList name={service.name} />))}</p>
        </div> */
    );
};

export default ManagedService;