import React, { Component } from "react";
import Layout from "./../../components/Layout";
import PenugasanEngineer from "../PenugasanEngineer";
import PeriodeKontrak from "../PeriodeKontrak";
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import homepage from "./../../assets/homepage.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import classes from './styles.module.css';

class Homepage extends Component {
    // constructor(props) {
    //     super(props)
    //     // the initial application state
    //     this.state = {
    //       user: null,
    //       onSignOut: false
    //     }
    //   }

    render() {

        return (
        <Router>
            <Layout>
                <Navbar collapseOnSelect expand="lg" id="navbar" variant='dark' style={{ backgroundColor: '#2F3F58'}}>
                    <Navbar.Brand><Link to="/" style={{ color: '#F7873F', textDecoration: 'none' }}>SIPEL</Link></Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#dashboard">Dashboard</Nav.Link>
                        <NavDropdown title="Order" id="collasible-nav-dropdown">
                        <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                        <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                            <NavDropdown title="Produksi" id="collasible-nav-dropdown">
                            <NavDropdown.Item ><Link to="/PenugasanEngineer" style={{ textDecoration: 'none' }}>Penugasan</Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to="/Produksi/ProgressDelivery" style={{ textDecoration: 'none' }}>Progress Delivery</Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to="/PeriodeKontrak" style={{ textDecoration: 'none' }}>Periode Kontrak</Link></NavDropdown.Item>
                            <NavDropdown.Item><Link to="/Produksi/ProgressDelivery" style={{ textDecoration: 'none' }}>Maintenance</Link></NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Laporan" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                        <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link href="#halamanAdmin">Halaman Admin</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link href="#deets">name_here</Nav.Link>
                        {/* <Nav.Link eventKey={2} href="#memes">
                        Dank memes
                        </Nav.Link> */}
                    </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch>
                    <Route path="/PenugasanEngineer">
                        <PenugasanEngineer/>
                    </Route>
                    <Route path="/PeriodeKontrak">
                        <PeriodeKontrak/>
                    </Route>
                    <Route path="/">
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
                    </Route>
                </Switch>
            </Layout>
        </Router>
        );
    }
}

export default Homepage;
