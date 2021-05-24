import React from "react";

const Order = (props) => {
    const { 
        idOrder,
        noPO, 
        noSPH, 
        orderName, 
        description,  
        clientName,
        clientDiv,
        clientPIC,
        clientOrg,
        clientPhone,
        clientEmail,
        dateOrder,
        verified,
        jenis,
    } = props;

    return (    
        <div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`ID Order: ${idOrder}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Nama Pelanggan: ${clientName}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Nomor Order: ${noPO}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Divisi Pelanggan: ${clientDiv}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Nomor SPH: ${noSPH}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`PIC Pelanggan: ${clientPIC}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Nama Order: ${orderName}`}</p>
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
                        <p>{`Deskripsi Order: ${description}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Email Pelanggan: ${clientEmail}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Jenis Order: ${jenis}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`No.Telp Pelanggan: ${clientPhone}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Tanggal Order Masuk: ${dateOrder}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p>{`Status: ${verified}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;