import React from "react";
import classes from "bootstrap/dist/css/bootstrap.min.css";

const Order = (props) => {
    const { 
        noPO, 
        noSPH, 
        orderName, 
        description, 
        isProjectInstallation, 
        isManagedService, 
        clientName,
        clientDiv,
        clientPIC,
        clientOrg,
        clientPhone,
        clientEmail } = props;
    return (
        <div className={classes.order}>
            <p>{`Nomor Order: ${noPO}`}</p>
            <p>{`Nomor SPH: ${noSPH}`}</p>
            <p>{`Nama Order: ${orderName}`}</p>
            <p>{`Deskripsi Order: ${description}`}</p>
            <p>{`Project Installation: ${isProjectInstallation}`}</p>
            <p>{`Managed Service: ${isManagedService}`}</p>
            <p>{`Nama Pelanggan: ${clientName}`}</p>
            <p>{`Divisi Pelanggan: ${clientDiv}`}</p>
            <p>{`PIC Pelanggan: ${clientPIC}`}</p>
            <p>{`Perusahaan Pelanggan: ${clientOrg}`}</p>
            <p>{`Nomor Telepon Pelanggan: ${clientPhone}`}</p>
            <p>{`Email Pelanggan: ${clientEmail}`}</p>
        </div>
    );
};

export default Order;