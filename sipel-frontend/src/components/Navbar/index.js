import React, { useState } from "react";
import clases from "./styles.module.css";
import CustomizedButtons from "../Button";

const Navbar = () => {
    const { click,setClick } = useState(false);
    return(
        <nav className={clases.navbar}>
            <h1>SIPEL</h1>
            <div className="links">
                {/*<CustomizedButtons variant="contained" size="large" color="#FD693E" >Dashboard</CustomizedButtons>
                <CustomizedButtons variant="contained" size="large" color="#FD693E" >Order</CustomizedButtons>
                <CustomizedButtons variant="contained" size="large" color="#FD693E" >Produksi</CustomizedButtons>
                <CustomizedButtons variant="contained" size="large" color="#FD693E" >Laporan</CustomizedButtons>
                <CustomizedButtons variant="contained" size="large" color="#FD693E" >Halaman Admin</CustomizedButtons>*/}
                <a className="nav-dashboard" href="/">Dashboard</a>
                <a className="nav-order" href="/create" >Order</a>
                <a className="nav-produksi" href="/create" >Produksi</a>
                <a className="nav-laporan" href="/create" >Laporan</a>
                <a className="nav-admin" href="/create" >Halaman Admin</a>
            </div>
        </nav>
    );
}

export default Navbar;