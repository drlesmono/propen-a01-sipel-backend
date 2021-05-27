// import logo from './logo.svg';
import './App.css';
import { useRoutes, A } from "hookrouter";
// import { render } from '@testing-library/react';
import React, { Component } from "react";
import Layout from "./components/Layout";
import PenugasanEngineer from "./containers/PenugasanEngineer";
import ChangeStatusOrder from "./containers/ChangeStatusOrder";
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import homepage from "./assets/homepage.png";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

const routes = {
    "/": () =>
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
        </div>,
    "/produksi/penugasan": () => <PenugasanEngineer />,
    "/order/status-order": () => <ChangeStatusOrder />
};

function App(){

    const routeResult = useRoutes(routes);

    return (
        <Layout>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" id="navbar">
                <Navbar.Brand href="/" style={{ textDecoration: 'none', color: '#F7873F' }}>SIPEL</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="#dashboard">Dashboard</Nav.Link>
                        <NavDropdown title="Order" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/order/status-order">Status Order</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Produksi" id="collasible-nav-dropdown">
                            <NavDropdown.Item href="/produksi/penugasan">Penugasan</NavDropdown.Item>
                            <NavDropdown.Item href="#produksi/progress-delivery">Progress Delivery</NavDropdown.Item>
                            <NavDropdown.Item href="/produksi/periodeKontrak">Periode Kontrak</NavDropdown.Item>
                            <NavDropdown.Item href="#produksi/maintenance">Maintenance</NavDropdown.Item>
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
            { routeResult }
        </Layout>
    );
}

export default App;
