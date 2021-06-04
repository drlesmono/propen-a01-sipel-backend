import { useRoutes} from "hookrouter";
import './App.css';
import Layout from "./components/Layout";
import InputDataOrder from "./containers/InputDataOrder/InputDataOrder";
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from "./containers/Homepage";
import PenjadwalanMaintenance from "./containers/PenjadwalanMaintenance/PenjadwalanMaintenance";
import CreateMaintenance from "./containers/CreateMaintenance/CreateMaintenance";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
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

const routes = {
  "/order/progress": () => <Progress />,
  "/produksi/penugasan": () => <PenugasanEngineer />,
  "/produksi/periodeKontrak": () => <PeriodeKontrak />,
  "/laporan/daftarLaporan" : () => <LaporanInstalasiMaintenance />,
  "/laporan/finance" : () => < ReportFinance/>,
  "/laporan/head" : () => < ReportHead/>,
  "/laporan/admin" : () => < ReportAdmin/>,
  "/laporan/create-bast" : () => < Bast/>,
  // "*" : () => <PageNotFound/>
};

function App(){

  const routeResult = useRoutes(routes);

    return (
        <>
          <Navbar collapseOnSelect expand="lg" id="navbar" variant="dark" style={{ backgroundColor: '#2F3F58' }} fluid>
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
                </NavDropdown>
                <NavDropdown title="Produksi" id="collasible-nav-dropdown">
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="/produksi/penugasan" style={{color: "black"}} className="pl-5 pr-5">Penugasan</Nav.Link>
                    <Nav.Link href="/order/progress" style={{color: "black"}} className="pl-5 pr-5">Progress Delivery</Nav.Link>
                    <Nav.Link href="/produksi/periodeKontrak" style={{color: "black"}} className="pl-5 pr-5">Periode Kontrak</Nav.Link>
                    <Nav.Link href="/produksi/maintenance" style={{color: "black"}} className="pl-5 pr-5">Maintenance</Nav.Link>
                  </div>
                  {/* <NavDropdown.Item href="#produksi/progress-delivery">Progress Delivery</NavDropdown.Item>
                  <NavDropdown.Item href="/produksi/periodeKontrak">Periode Kontrak</NavDropdown.Item>
                  <NavDropdown.Item href="#produksi/maintenance">Maintenance</NavDropdown.Item> */}
                </NavDropdown>
                <NavDropdown title="Laporan"  id="collasible-nav-dropdown">
                  <div className="d-flex justify-content-between">
                  <Nav.Link href="/laporan/create-bast" style={{color: "black"}} className="pl-5 pr-5">Generate BAST</Nav.Link>
                    <Nav.Link href="/laporan/daftarLaporan" style={{color: "black"}} className="pl-5 pr-5">Daftar Laporan</Nav.Link>
                    <Nav.Link href="/laporan/admin" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>
                    <Nav.Link href="/laporan/finance" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>
                    <Nav.Link href="/laporan/head" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>
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
          <Layout>
          <Router>
            <Switch>
              <Route exact path="/" component={Homepage}/>
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
              { routeResult }
              <Route component={PageNotFound}/>
              {/* <Redirect from="*" to="/404/pageNotFound"/> */}
            </Switch>
          </Router>
          </Layout>
        </>
    );
}

export default App;
