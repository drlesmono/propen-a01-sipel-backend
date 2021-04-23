import React from "react";
import classes from "bootstrap/dist/css/bootstrap.min.css";

const ProjectInstallation = (props) => {
    const { 
        startPI, 
        deadline } = props;
    return (
        <div className={classes.projectInstallation}>
            <p>{`Tanggal Mulai Proyek: ${startPI}`}</p>
            <p>{`Tanggal Selesai Proyek: ${deadline}`}</p>
        </div>
    );
};

export default ProjectInstallation;