// import logo from './logo.svg';
import { useRoutes} from "hookrouter";
// import routes from "./router";
import './App.css';
import Layout from "./components/Layout";
import Progress from "./containers/Progress";
import ReportAdmin from "./containers/ReportAdmin";
import ReportFinance from "./containers/ReportFinance";
import ReportHead from "./containers/ReportHead";
import PenugasanEngineer from "./containers/PenugasanEngineer";
import PeriodeKontrak from "./containers/PeriodeKontrak";
import LaporanInstalasiMaintenance from "./containers/LaporanInstalasiMaintenance";
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import homepage from "./assets/homepage.png";

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
  "/order/progress": () => <Progress />,
  "/produksi/penugasan": () => <PenugasanEngineer />,
  "/produksi/periodeKontrak": () => <PeriodeKontrak />,
  "/laporan/daftarLaporan" : () => <LaporanInstalasiMaintenance />,
  "/laporan/finance" : () => < ReportFinance/>,
  "/laporan/head" : () => < ReportHead/>,
  "/laporan/admin" : () => < ReportAdmin/>,
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
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item> */}
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="#action/3.1" style={{color: "black"}} className="pl-5 pr-5">Action</Nav.Link>
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
                    <Nav.Link href="#produksi/maintenance" style={{color: "black"}} className="pl-5 pr-5">Maintenance</Nav.Link>
                  </div>
                  {/* <NavDropdown.Item href="#produksi/progress-delivery">Progress Delivery</NavDropdown.Item>
                  <NavDropdown.Item href="/produksi/periodeKontrak">Periode Kontrak</NavDropdown.Item>
                  <NavDropdown.Item href="#produksi/maintenance">Maintenance</NavDropdown.Item> */}
                </NavDropdown>
                <NavDropdown title="Laporan"  id="collasible-nav-dropdown">
                  <div className="d-flex justify-content-between">
                    <Nav.Link href="/laporan/daftarLaporan" style={{color: "black"}} className="pl-5 pr-5">Daftar Laporan</Nav.Link>
                    <Nav.Link href="/laporan/admin" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>
                    <Nav.Link href="/laporan/finance" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>
                    <Nav.Link href="/laporan/head" style={{color: "black"}} className="pl-5 pr-5">Laporan</Nav.Link>
                    <Nav.Link href="#laporan/verifikasiLaporan" style={{color: "black"}} className="pl-5 pr-5">Verifikasi Laporan</Nav.Link>
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
            { routeResult }
          </Layout>
        </>
    );
}

export default App;
