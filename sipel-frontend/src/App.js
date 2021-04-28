// import logo from './logo.svg';
import './App.css';
// import { render } from '@testing-library/react';
import React, { Component } from "react";
import Layout from "./components/Layout";
import PenugasanEngineer from "./containers/PenugasanEngineer";
import PeriodeKontrak from "./containers/PeriodeKontrak";
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import homepage from "./assets/homepage.png";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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

class App extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     isHome: true,
  //     isPenugasan: false,
  //     isPeriodeKontrak: false
  //   }
  //   this.handleChangePage = this.handleChangePage.bind(this);
  // }

  // handleChangePage(event){
  //   const { name } = event.target;
  //   if(name === "Home"){
  //     this.setState({
  //       isHome: true, 
  //       isPenugasan: false,
  //       isPeriodeKontrak: false
  //     });
  //   }else if (name === "Penugasan"){
  //     this.setState({
  //       isHome: false, 
  //       isPenugasan: true,
  //       isPeriodeKontrak: false
  //     });
  //   }else if (name === "PeriodeKontrak"){
  //     this.setState({
  //       isHome: false, 
  //       isPenugasan: false,
  //       isPeriodeKontrak: true
  //     });
  //   }
  // }

  render() {
    // const { isHome, isPenugasan, isPeriodeKontrak } = this.state;

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
                  <NavDropdown.Item><Link to="/Produksi/Penugasan" style={{ textDecoration: 'none' }}>Penugasan</Link></NavDropdown.Item>
                  <NavDropdown.Item><Link to="/Produksi/Penugasan" style={{ textDecoration: 'none' }}>Progress Delivery</Link></NavDropdown.Item>
                  <NavDropdown.Item><Link to="/Produksi/PeriodeKontrak" style={{ textDecoration: 'none' }}>Periode Kontrak</Link></NavDropdown.Item>
                  <NavDropdown.Item><Link to="/Produksi/Penugasan" style={{ textDecoration: 'none' }}>Maintenance</Link></NavDropdown.Item>
                    {/* <Nav variant="tabs" defaultActiveKey="/home" id="nav">
                      <Nav.Item>
                        <Nav.Link href="/home">Active</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="link-1">Option 2</Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="disabled" disabled>
                          Disabled
                        </Nav.Link>
                      </Nav.Item>
                    </Nav> */}
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
            <Route path="/Produksi/Penugasan">
              <PenugasanEngineer/>
            </Route>
            <Route path="/Produksi/PeriodeKontrak">
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
          {/* { isHome ? 
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
          </div> : <></> }
          { isPenugasan ? <PenugasanEngineer/> : <></> }
          { isPeriodeKontrak ? <PeriodeKontrak/> : <></> } */}
        </Layout>
      </Router>
    );
  }
}

export default App;
