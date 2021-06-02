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
            <p style={{color: "black"}}>{`Nomor Laporan: ${reportNum}`}</p>
            <p style={{color: "black"}}>{`Nama Laporan: ${reportName}`}</p>
            <p style={{color: "black"}}>{`Nomor PO: ${noPO}`}</p>
            <p style={{color: "black"}}>{`Perusahaan Pelanggan: ${clientOrg}`}</p>
            <p style={{color: "black"}}>{`Status: ${statusApproval}`}</p>
            <p style={{color: "black"}}>{`Tanggal Dibuat: ${uploadedDate}`}</p>
        </div>
    );
};

export default Laporan;