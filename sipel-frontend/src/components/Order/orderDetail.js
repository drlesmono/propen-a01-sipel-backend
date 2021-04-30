import React from "react";
import classes from "bootstrap/dist/css/bootstrap.min.css";
import CustomizedButtons from "../Button";

const Order = (props) => {
    const { 
        idOrder,
        noPO, 
        noSPH, 
        orderName, 
        description, 
        projectInstallation, 
        managedService, 
        clientName,
        clientDiv,
        clientPIC,
        clientOrg,
        clientPhone,
        clientEmail,
        dateOrder,
        verified,
        handleEdit,
        handleDetail } = props;
    return (    
        <div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`ID Order: ${idOrder}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Nama Pelanggan: ${clientName}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`No.Telp Pelanggan: ${clientPhone}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Nomor Order: ${noPO}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Divisi Pelanggan: ${clientDiv}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Project Installation: ${projectInstallation}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Nomor SPH: ${noSPH}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`PIC Pelanggan: ${clientPIC}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Managed Service: ${managedService}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Nama Order: ${orderName}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Perusahaan Pelanggan: ${clientOrg}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Tanggal Order Masuk: ${dateOrder}`}</p>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Deskripsi Order: ${description}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Email Pelanggan: ${clientEmail}`}</p>
                    </div>
                </div>
                <div className="col-sm-4">
                    <div className="form-group">
                        <p>{`Status: ${verified}`}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* class Order extends Component {
    constructor(props) {
        super(props);
        const { 
            idOrder,
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
            clientEmail,
            dateOrder,
            handleEdit,
            handleDetail } = props;
            return (
                <div className={classes.order}>
                    <p>{`Id Order: ${idOrder}`}</p>
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
                    <p>{`Tanggal Order Masuk: ${dateOrder}`}</p>
                    <CustomizedButtons onClick={handleEdit} variant="primary">
                        Ubah
                    </CustomizedButtons>
                    <CustomizedButtons onClick={handleDetail} variant="primary">
                        Lihat
                    </CustomizedButtons>
                </div>
            );
        };
    }
} */

export default Order;