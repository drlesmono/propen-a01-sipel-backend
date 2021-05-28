import React from "react";

const OrderDetailForUnggah = (props) => {
    const { 
        noPO,
        orderName,
        clientName, 
        clientOrg,
        jenis,
        status } = props;
    return (
        <div>
        <div className="row">
            <div className="col-sm-6">
                <div className="form-group">
                    <h5>{`Nomor PO: ${noPO}`}</h5>
                </div>
            </div>
            <div className="col-sm-6">
                <div className="form-group">
                    <h5>{`Nama Pelanggan: ${clientName}`}</h5>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-6">
                <div className="form-group">
                    <h5>{`Nama Order: ${orderName}`}</h5>
                </div>
            </div>
            <div className="col-sm-6">
                <div className="form-group">
                    <h5>{`Perusahaan Pelanggan: ${clientOrg}`}</h5>
                </div>
            </div>
        </div>
        <div className="row">
            <div className="col-sm-6">
                <div className="form-group">
                    <h5>{`Jenis: ${jenis}`}</h5>
                </div>
            </div>
            <div className="col-sm-6">
                <div className="form-group">
                    <h5>{`Status: ${status}`}</h5>
                </div>
            </div>
        </div>
        </div>
    );
};

export default OrderDetailForUnggah;