import React, { Component } from 'react'
import { Navbar, NavDropdown, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class HeaderComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {

            //<nav className="navbar navbar-expand-md navbar-dark bg-dark">
            //<div><a href="" className="navbar-brand">SIPEL</a></div>
            //</nav>


        }
    }

    render() {
        return (
            <div>
                <header>
                    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" id="navbar">
                        <Navbar.Brand href="/" style={{ textDecoration: 'none', color: '#F7873F' }}>SIPEL</Navbar.Brand>
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
                            <NavDropdown.Item href="/produksi/penugasan">Penugasan</NavDropdown.Item>
                            <NavDropdown.Item href="/progress-delivery">Progress Delivery</NavDropdown.Item>
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
                        </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </header>

                
            </div>
        )
    }
}

export default HeaderComponent