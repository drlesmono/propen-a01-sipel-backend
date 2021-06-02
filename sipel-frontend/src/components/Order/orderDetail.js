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
                        <p style={{color: "black"}}>{`ID Order: ${idOrder}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Nama Pelanggan: ${clientName}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Nomor Order: ${noPO}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Divisi Pelanggan: ${clientDiv}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Nomor SPH: ${noSPH}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`PIC Pelanggan: ${clientPIC}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Nama Order: ${orderName}`}</p>
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
                        <p style={{color: "black"}}>{`Deskripsi Order: ${description}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Email Pelanggan: ${clientEmail}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Jenis Order: ${jenis}`}</p>
                    </div>
                </div>
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`No.Telp Pelanggan: ${clientPhone}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Tanggal Order Masuk: ${dateOrder}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6">
                    <div className="form-group">
                        <p style={{color: "black"}}>{`Status: ${verified}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Order;