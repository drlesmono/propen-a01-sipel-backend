import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import homepage from "../assets/homepage.png";


class LandingPage extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }
    }

    render() {
        return (
                <div style={{ margin: 75 }}>
                    <table>
                    <tr>
                        <td>
                        <div style={{ margin: 30 }}>
                            
                            <h1 style={{ color: '#2F3F58' }}>Selamat Datang di Sistem Informasi Pengelolaan Layanan</h1>
                        </div>
                        </td>
                        <td><img src={homepage} alt="homepage"/></td>
                    </tr>
                    </table>
                </div>
        )
    }
}

export default LandingPage