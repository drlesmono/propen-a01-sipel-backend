import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import homepage from "./../../assets/homepage.png";

const Homepage = () => {
        return (
            <div> 
                <div style={{ margin: 75 }}>
                <table>
                    <tr>
                    <td>
                        <div style={{ margin: 30 }}>
                        <h3 style={{ color: '#F7873F' }}>Hello, name_here</h3>
                        <h1 style={{ color: '#2F3F58' }}>Selamat Datang di Sistem Informasi Pengelolaan Layanan</h1>
                        </div>
                    </td>
                    <td><img src={homepage} alt="homepage"/></td>
                    </tr>
                </table>
                </div>
            </div>
        );
}

export default Homepage;