import React from "react";
import classes from "bootstrap/dist/css/bootstrap.min.css";

const Laporan = (props) => {
    const { 
        reportNum,
        reportName,
        noPO,
        clientOrg,
        statusApproval,
        uploadedDate,
         } = props;
    return (
        <div>
            <p>{`Nomor Laporan: ${reportNum}`}</p>
            <p>{`Nama Laporan: ${reportName}`}</p>
            <p>{`Nomor PO: ${noPO}`}</p>
            <p>{`Perusahaan Pelanggan: ${clientOrg}`}</p>
            <p>{`Status: ${statusApproval}`}</p>
            <p>{`Tanggal Dibuat: ${uploadedDate}`}</p>
        </div>
    );
};

export default Laporan;