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
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`ID Project Installation: ${idOrderPi}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Tanggal Mulai Proyek: ${startPI}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Tanggal Selesai Proyek: ${deadline}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Progres Pengerjaan: ${percentage} %`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Status: ${close}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectInstallation;