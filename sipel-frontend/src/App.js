/* import React, { Component } from "react";
import Layout from "./components/Layout";
import InputDataOrder from "./containers/InputDataOrder/InputDataOrder";

class App extends Component {
  render() {
    return (
      <Layout>
        <InputDataOrder/>
      </Layout>
    );
  }
}

export default App; */

// import logo from './logo.svg';
import { useRoutes, A } from "hookrouter";
// import routes from "./router";
import './App.css';
import React, { Component } from "react";
import Layout from "./components/Layout";
import InputDataOrder from "./containers/InputDataOrder/InputDataOrder";
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import homepage from "./assets/homepage.png";
import PenjadwalanMaintenance from "./containers/PenjadwalanMaintenance/PenjadwalanMaintenance";
import CreateMaintenance from "./containers/CreateMaintenance/CreateMaintenance";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import LookUpdateMaintenance from "./containers/LookUpdateMaintenance/LookUpdateMaintenance";
import CreateOrder from "./containers/CreateOrder/CreateOrder";
import DetailOrder from "./containers/DetailOrder/DetailOrder";
import ChangeOrderPI from "./containers/ChangeOrderPI/ChangeOrderPI";
import ChangeOrderMS from "./containers/ChangeOrderMS/ChangeOrderMS";
import ChangeOrderPIMS from "./containers/ChangeOrderPIMS/ChangeOrderPIMS";
import LaporanInstalasiMaintenance from "./containers/LaporanInstalasiMaintenance"
import StatusPersetujuanLaporan from "./containers/StatusPersetujuanLaporan/StatusPersetujuanLaporan";

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
  //"/order/order": () => <InputDataOrder/>,
  //"/produksi/maintenance": () => <PenjadwalanMaintenance />,
  //"/produksi/maintenance/tambah/:id" : () => <CreateMaintenance />,
  "/laporan/daftarLaporan" : () => <LaporanInstalasiMaintenance />,
  "/laporan/verifikasiLaporan" : () => <StatusPersetujuanLaporan />,
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
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="/order/order" style={{color: "black"}} className="pl-5 pr-5">Order</Nav.Link>
                    <Nav.Link href="#action/3.2" style={{color: "black"}} className="pl-5 pr-5">Another action</Nav.Link>
                    <Nav.Link href="#action/3.4" style={{color: "black"}} className="pl-5 pr-5">Something</Nav.Link>
                    <Nav.Link href="#action/3.4" style={{color: "black"}} className="pl-5 pr-5">Something 2</Nav.Link>
                  </div>
                  {/* <NavDropdown.Item href="/order/order">Order</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
                </NavDropdown>
                <NavDropdown title="Produksi" id="collasible-nav-dropdown">
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="#produksi/penugasan" style={{color: "black"}} className="pl-5 pr-5">Penugasan</Nav.Link>
                    <Nav.Link href="#produksi/progress-delivery" style={{color: "black"}} className="pl-5 pr-5">Progress Delivery</Nav.Link>
                    <Nav.Link href="#produksi/periodeKontrak" style={{color: "black"}} className="pl-5 pr-5">Periode Kontrak</Nav.Link>
                    <Nav.Link href="/produksi/maintenance" style={{color: "black"}} className="pl-5 pr-5">Maintenance</Nav.Link>
                  </div>
                  {/* <NavDropdown.Item href="#action/3.1">Penugasan</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.1">Progress Delivery</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.1">Periode Kontrak</NavDropdown.Item>
                  <NavDropdown.Item href="produksi/maintenance">Maintenance</NavDropdown.Item> */}
                </NavDropdown>
                <NavDropdown title="Laporan" id="collasible-nav-dropdown">
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="/laporan/daftarLaporan" style={{color: "black"}} className="pl-5 pr-5">Daftar Laporan</Nav.Link>
                    <Nav.Link href="/laporan/verifikasiLaporan" style={{color: "black"}} className="pl-5 pr-5">Verifikasi Laporan</Nav.Link>
                  </div>
                  {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
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
          <Router>
            <Switch>
              <Route exact path="/order/order" component={InputDataOrder} />
              <Route exact path="/produksi/maintenance" component={PenjadwalanMaintenance} />
              <Route exact path="/produksi/maintenance/create/:id" component={CreateMaintenance} />
              <Route exact path="/produksi/maintenance/look-update/:id" component={LookUpdateMaintenance} />
              <Route exact path="/order/create" component={CreateOrder} />
              <Route exact path="/order/detail/:id" component={DetailOrder} />
              <Route exact path="/orderPI/change/:id/:idPi" component={ChangeOrderPI} />
              <Route exact path="/orderMS/change/:id/:idMs" component={ChangeOrderMS} />
              <Route exact path="/orderPIMS/change/:id/:idPi/:idMs" component={ChangeOrderPIMS} />
            </Switch>
          </Router>
          </Layout>
    );
}

export default App;
