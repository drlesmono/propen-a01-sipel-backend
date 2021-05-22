import React from "react";

const TableMaintenanceDetail = (props) => {
    const {
        idOrderMs,
        noPO,
        clientName,
        clientOrg,
        fullname,
    } = props;

    return (
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`ID Managed Service: ${idOrderMs}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Perusahaan Pelanggan: ${clientOrg}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Nomor PO: ${noPO}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Jenis Order: Managed Service`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Nama Pelanggan: ${clientName}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`PIC Engineer: ${fullname}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableMaintenanceDetail;