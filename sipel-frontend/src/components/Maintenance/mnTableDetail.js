import React from "react";

const TableMaintenanceDetail = (props) => {
    const {
        idOrderMs,
        noPO,
        clientName,
        clientOrg,
        fullname,
        periodeMulai,
        periodeSelesai,
    } = props;

    return (
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`ID Managed Service: ${idOrderMs}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Perusahaan Pelanggan: ${clientOrg}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Nomor PO: ${noPO}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Jenis Order: Managed Service`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Nama Pelanggan: ${clientName}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`PIC Engineer: ${fullname}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Periode Mulai Managed: ${periodeMulai}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Periode Selesai Managed: ${periodeSelesai}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TableMaintenanceDetail;