import React, { Component } from "react";
import './App.css';
import InputDataOrder from "./containers/InputDataOrder/InputDataOrder";
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from "./containers/Homepage";
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
import UnggahDokumenOrder from "./containers/UnggahDokumenOrder/UnggahDokumenOrder";
import Progress from "./containers/Progress";
import ReportAdmin from "./containers/ReportAdmin";
import ReportFinance from "./containers/ReportFinance";
import ReportHead from "./containers/ReportHead";
import PenugasanEngineer from "./containers/PenugasanEngineer";
import PeriodeKontrak from "./containers/PeriodeKontrak";
import Bast from "./containers/Bast";
import PageNotFound from "./errors/PageNotFound"
import HalamanAdmin from "./containers/HalamanAdmin";
import AuthService from "./services/auth.service";
import Login from "./components/Auth/login.component";
import Register from "./components/Auth/register.component";
import Profile from "./components/Auth/profile.component";
import Home from "./components/Home";
import BoardAdmin from "./components/board-admin.component";
import ListVerifiedPiOrder from "./components/VerifiedPiOrder/ListVerifiedPiOrder";
import ListTaskComponent from './components/ListTask/ListTaskComponent';
import CreateTaskComponent from './components/ListTask/CreateTaskComponent';
import UpdateTaskComponent from './components/ListTask/UpdateTaskComponent';
import UpdateTaskProgressComponent from './components/ListTask/UpdateTaskProgressComponent';
import ListNotVerifiedOrder from './components/OrderVerification/ListNotVerifiedOrder';
import OrderDetails from './components/OrderVerification/OrderDetails';
import OrderVerificationComponent from './components/OrderVerification/OrderVerificationComponent';

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
      showDeliveryProgress: false,
      showLaporanFinance: false,
      showLaporanHead: false,
      showLaporanAdmin: false,
      showBast: false,
      currentUser: undefined,
    };
  }

  componentDidMount() {
    const user = AuthService.getCurrentUser();

    if (user) {
      this.setState({
        currentUser: user,
        showPeriodeKontrak: user.roles.includes("ROLE_ADMIN"),
        showPenugasanEngineer: user.roles.includes("ROLE_ADMIN"),
        showMengelolaLaporan: user.roles.includes("ROLE_ENGINEER"),
		    showBoardAdmin: user.roles.includes("ROLE_ADMIN"),
        showHalamanAdmin: user.roles.includes("ROLE_ADMIN"),
        showDeliveryProgress: user.roles.includes("ROLE_ENGINEER"),
        showOrderVerification: user.roles.includes("ROLE_ADMIN"),
        showBast: user.roles.includes("ROLE_ADMIN"),
        showLaporanAdmin: user.roles.includes("ROLE_ADMIN"),
        showLaporanFinance: user.roles.includes("ROLE_FINANCE"),
        showLaporanHead: user.roles.includes("ROLE_MANAGER")
      });
    }
  }

  logOut() {
    AuthService.logout();
  }
  render() {
    const { currentUser, showPeriodeKontrak, showOrderVerification, showPenugasanEngineer, showMengelolaLaporan, showBoardAdmin, showHalamanAdmin, showDeliveryProgress, 
    showLaporanAdmin, showLaporanFinance, showLaporanHead, showBast } = this.state;

    return (
      <div>
        <Navbar collapseOnSelect expand="lg" id="navbar" variant="dark" style={{ backgroundColor: '#2F3F58' }}>
          <Navbar.Brand href="/" style={{ textDecoration: 'none', color: '#F7873F' }}>SIPEL</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="mr-auto">
              <Nav.Link href="#dashboard">Dashboard</Nav.Link>
              <NavDropdown title="Order" id="collasible-nav-dropdown">
                <div className="d-flex justify-content-between">
                  <Nav.Link href="#action/3.1" style={{color: "black"}} className="pl-5 pr-5">Action</Nav.Link>
                  {showOrderVerification && (<Nav.Link href="/order-verification" style={{color: "black"}} className="pl-5 pr-5">Verifikasi Order</Nav.Link>)}
                  <Nav.Link href="#action/3.4" style={{color: "black"}} className="pl-5 pr-5">Something</Nav.Link>
                  <Nav.Link href="#action/3.4" style={{color: "black"}} className="pl-5 pr-5">Something 2</Nav.Link>
                  </div>
              </NavDropdown>
              <NavDropdown title="Produksi" id="collasible-nav-dropdown">
                  <div className="d-flex justify-content-between">
                  {showPenugasanEngineer && (<Nav.Link href="/produksi/penugasan" style={{color: "black"}} className="pl-5 pr-5">Penugasan</Nav.Link>)}
                  {showDeliveryProgress && (<Nav.Link href="/delivery-progress" style={{color: "black"}} className="pl-5 pr-5">Progress Delivery</Nav.Link>)}
                  {showPeriodeKontrak && (<Nav.Link href="/produksi/periode-kontrak" style={{color: "black"}} className="pl-5 pr-5">Periode Kontrak</Nav.Link>)}
                  <Nav.Link href="#produksi/maintenance" style={{color: "black"}} className="pl-5 pr-5">Maintenance</Nav.Link>
              </div>
              </NavDropdown>
              <NavDropdown title="Laporan"  id="collasible-nav-dropdown">
              <div className="d-flex justify-content-between">
              {showMengelolaLaporan && (<Nav.Link href="/laporan/daftarLaporan" style={{color: "black"}} className="pl-5 pr-5">Daftar Laporan</Nav.Link>)}
              {showLaporanAdmin &&  (<Nav.Link href="/laporan/admin" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>)}
              {showLaporanFinance && (<Nav.Link href="/laporan/finance" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>)}
              {showLaporanHead && (<Nav.Link href="/laporan/head" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>)}
              </div>
              </NavDropdown>
              {showHalamanAdmin && (<Nav.Link href="/halaman/admin">Halaman Admin</Nav.Link>)}
              </Nav>

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


</Navbar.Collapse>
</Navbar>

        <div className="container mt-3">
          <Switch>
            <Route exact path={["/"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route path="/produksi/penugasan" component={PenugasanEngineer} />
            <Route path="/produksi/periode-kontrak" component={PeriodeKontrak} />
            <Route path="/laporan/daftarLaporan" component={LaporanInstalasiMaintenance} />
			      <Route path="/api/test/admin" component={BoardAdmin} />
            <Route path="/halaman/admin" component={HalamanAdmin} />
            <Route path = "/delivery-progress" component = {ListVerifiedPiOrder}></Route>
            <Route path = "/list-task/:id" component = {ListTaskComponent}></Route>
            <Route path = "/add-task/:id" component = {CreateTaskComponent}></Route>
            <Route path = "/update-task/:idPi/:idTask" component = {UpdateTaskComponent}></Route>
            <Route path = "/add-progress/:idPi/:idTask" component = {UpdateTaskProgressComponent}></Route>
            <Route path = "/order-details/:idOrder" component = {OrderDetails}></Route>
            <Route path = "/order-verification" component = {ListNotVerifiedOrder}></Route>
            <Route path = "/verification/:idOrder" component = {OrderVerificationComponent}></Route>
            <Route path = "/order/progress" component = {Progress}></Route>
            <Route path = "/laporan/finance" component = {ReportFinance}></Route>
            <Route path = "/laporan/head" component = {ReportHead}></Route>
            <Route path = "/laporan/admin" component = {ReportAdmin}></Route>
            <Route path = "/laporan/create-bast" component = {Bast}></Route>
            <Route exact path="/order/order" component={InputDataOrder} />
            <Route exact path="/produksi/maintenance" component={PenjadwalanMaintenance} />
            <Route exact path="/produksi/maintenance/create/:id" component={CreateMaintenance} />
            <Route exact path="/produksi/maintenance/look-update/:id" component={LookUpdateMaintenance} />
            <Route exact path="/order/create" component={CreateOrder} />
            <Route exact path="/order/detail/:id" component={DetailOrder} />
            <Route exact path="/orderPI/change/:id/:idPi" component={ChangeOrderPI} />
            <Route exact path="/orderMS/change/:id/:idMs" component={ChangeOrderMS} />
            <Route exact path="/orderPIMS/change/:id/:idPi/:idMs" component={ChangeOrderPIMS} />
            <Route exact path="/laporan/verifikasiLaporan" component={StatusPersetujuanLaporan} />
            <Route exact path="/order/unggah/:id" component={UnggahDokumenOrder} />
            <Route component={PageNotFound}/>
          </Switch>
        </div>
      </div>
    );
  }
}

export default App;