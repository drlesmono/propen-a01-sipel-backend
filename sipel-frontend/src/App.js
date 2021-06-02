// import logo from './logo.svg';
import { useRoutes} from "hookrouter";
// import routes from "./router";
import './App.css';
import React, { Component } from "react";
import Layout from "./components/Layout";
import PenugasanEngineer from "./containers/PenugasanEngineer";
import PeriodeKontrak from "./containers/PeriodeKontrak";
import LaporanInstalasiMaintenance from "./containers/LaporanInstalasiMaintenance";
import FinalisasiLaporan from "./containers/FinalisasiLaporan";
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import homepage from "./assets/homepage.png";

import { Switch, Route, Link } from "react-router-dom";
import AuthService from "./services/auth.service";
import Login from "./components/Auth/login.component";
import Register from "./components/Auth/register.component";
import Profile from "./components/Auth/profile.component";
import Home from "./components/Home";
import BoardAdmin from "./components/board-admin.component";


/**const routes = {
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
  "/produksi/periodeKontrak": () => <PeriodeKontrak />,
  "/laporan/daftarLaporan" : () => <LaporanInstalasiMaintenance />,
  "/order/finalisasiLaporan" : () => <FinalisasiLaporan />
};

function App(){

  const routeResult = useRoutes(routes);

    return (
        <>
          <Navbar collapseOnSelect expand="lg" id="navbar" variant="dark" style={{ backgroundColor: '#2F3F58' }}>
            <Navbar.Brand href="/" style={{ textDecoration: 'none', color: '#F7873F' }}>SIPEL</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#dashboard">Dashboard</Nav.Link>
                <NavDropdown title="Order" id="collasible-nav-dropdown">
                  {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> }
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="#action/3.1" style={{color: "black"}} className="pl-5 pr-5">Action</Nav.Link>
                    <Nav.Link href="#action/3.2" style={{color: "black"}} className="pl-5 pr-5">Another action</Nav.Link>
                    <Nav.Link href="#action/3.4" style={{color: "black"}} className="pl-5 pr-5">Something</Nav.Link>
                    <Nav.Link href="/order/finalisasiLaporan" style={{color: "black"}} className="pl-5 pr-5">Finalisasi Laporan</Nav.Link>
                  </div>
                </NavDropdown>
                <NavDropdown title="Produksi" id="collasible-nav-dropdown">
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="/produksi/penugasan" style={{color: "black"}} className="pl-5 pr-5">Penugasan</Nav.Link>
                    <Nav.Link href="#produksi/progress-delivery" style={{color: "black"}} className="pl-5 pr-5">Progress Delivery</Nav.Link>
                    <Nav.Link href="/produksi/periodeKontrak" style={{color: "black"}} className="pl-5 pr-5">Periode Kontrak</Nav.Link>
                    <Nav.Link href="#produksi/maintenance" style={{color: "black"}} className="pl-5 pr-5">Maintenance</Nav.Link>
                  </div>
                  {/* <NavDropdown.Item href="#produksi/progress-delivery">Progress Delivery</NavDropdown.Item>
                  <NavDropdown.Item href="/produksi/periodeKontrak">Periode Kontrak</NavDropdown.Item>
                  <NavDropdown.Item href="#produksi/maintenance">Maintenance</NavDropdown.Item> }
                </NavDropdown>
                <NavDropdown title="Laporan"  id="collasible-nav-dropdown">
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="/laporan/daftarLaporan" style={{color: "black"}} className="pl-5 pr-5">Daftar Laporan</Nav.Link>
                    <Nav.Link href="#laporan/verifikasiLaporan" style={{color: "black"}} className="pl-5 pr-5">Verifikasi Laporan</Nav.Link>
                  </div>
                  {/* <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> }
                </NavDropdown>
                <Nav.Link href="#halamanAdmin">Halaman Admin</Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link href="#deets">name_here</Nav.Link>
                {/* <Nav.Link eventKey={2} href="#memes">
                  Dank memes
                </Nav.Link> }
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          <Layout>
            { routeResult }
          </Layout>
        </>
    );
}

export default App;*/

class App extends Component {
  constructor(props) {
    super(props);
    this.logOut = this.logOut.bind(this);

    this.state = {
      showPeriodeKontrak: false,
      showPenugasanEngineer: false,
      showMengelolaLaporan: false,
	    showBoardAdmin: false,
      showHalamanAdmin: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showPeriodeKontrak: user.roles.includes("ROLE_ADMIN", "ROLE_MANAGER"),
        showPenugasanEngineer: user.roles.includes("ROLE_ADMIN", "ROLE_MANAGER"),
        showMengelolaLaporan: user.roles.includes("ROLE_ADMIN", "ROLE_MANAGER", "ROLE_ENGINEER"),
		    showBoardAdmin: user.roles.includes("ROLE_ADMIN"),
        showHalamanAdmin: user.roles.includes("ROLE_ADMIN", "ROLE_MANAGER"),
      });
    }
  }

  logOut() {
    AuthService.logout();
  }
  render() {
    const { currentUser, showPeriodeKontrak, showPenugasanEngineer, showMengelolaLaporan, showBoardAdmin, showHalamanAdmin } = this.state;

    return (
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to={"/"} className="navbar-brand">
            SIPEL
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to={"/home"} className="nav-link">
                Home
              </Link>
            </li>

            {showPenugasanEngineer && (
              <li className="nav-item">
                <Link to={"/penugasan"} className="nav-link">
                  Penugasan Engineer
                </Link>
              </li>
            )}

            {showPeriodeKontrak && (
              <li className="nav-item">
                <Link to={"/periode-kontrak"} className="nav-link">
                  Periode Kontrak
                </Link>
              </li>
            )}

            {showMengelolaLaporan && (
              <li className="nav-item">
                <Link to={"/mengelola-laporan"} className="nav-link">
                  Mengelola Laporan
                </Link>
              </li>
            )}

          </div>

          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/profile"} className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={this.logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to={"/login"} className="nav-link">
                  Login
                </Link>
              </li>

              <li className="nav-item">
                <Link to={"/register"} className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/penugasan" component={PenugasanEngineer} />
            <Route path="/periode-kontrak" component={PeriodeKontrak} />
            <Route path="/mengelola-laporan" component={LaporanInstalasiMaintenance} />
			      <Route path="/api/test/admin" component={BoardAdmin} />
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;
