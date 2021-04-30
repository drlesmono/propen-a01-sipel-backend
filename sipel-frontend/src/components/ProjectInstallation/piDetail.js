import React from "react";
import classes from "bootstrap/dist/css/bootstrap.min.css";
import Order from "../Order/orderDetail";

const ProjectInstallation = (props) => {
    const { 
        idOrderPi,
        startPI, 
        deadline,
        percentage,
        close } = props;
    return (
        <div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`ID Order PI: ${idOrderPi}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Tanggal Mulai Proyek: ${startPI}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Tanggal Selesai Proyek: ${deadline}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Progres Pengerjaan: ${percentage}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Status Ditutup: ${close}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectInstallation;