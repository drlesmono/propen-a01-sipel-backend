import React, { Component } from 'react'
import OrderService from "../../services/OrderService";
import authHeader from '../../services/auth-header';
import axios from 'axios';
import { Form, Button, Card, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";

class OrderVerificationComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            idOrder: this.props.match.params.idOrder,
            verified: false, 
            nama_verifikasi: "",
            
            

        }
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSave = this.handleSubmit.bind(this);
        
    }

    componentDidMount(){
        OrderService.getOrderByIdOrder(this.state.idOrder).then( (res) =>{
            let order = res.data;
        });
    }

    handleChangeField= (event) => {
        this.setState({nama_verifikasi: event.target.value});
    }
    
    
    handleSubmit = (e) => {
        e.preventDefault();
        let order = {verified: this.state.verified};
        console.log('order => ' + JSON.stringify(order));
        
        OrderService.updateStatusVerifikasi(order, this.state.idOrder).then( res => {
            this.props.history.push(`/order-verification`);
        });
    }

    cancel(){
        this.props.history.push(`/order-verification`); 
    }

    handleSave = (e) => {
        e.preventDefault();
        let order = {idOrder: this.state.idOrder, nama_verifikasi: this.state.nama_verifikasi};
        console.log('order => ' + JSON.stringify(order));
        const URL = "http://localhost:2020/api/v1/order/verification";
        axios.put(URL, order, { headers: authHeader() });
        this.props.history.push(`/order-verification`)
    }

    render() {
        
        return (
            <div>
                <br/><br/>
                <div className="container">
                    <div className="row">
                        <div className = "card col-md-6 offset-md-3 offset-md-3">
                            <br/>
                            <h3 className="text-center">Ubah Status Order</h3>
                            <div className = "card-body">
                                            <Form>
                                                <Table borderless responsive="xl" size="sm">
                                                <tr>
                                                <td><p className="d-flex">Status Verifikasi<p style={{color: "red"}}>*</p></p></td>
                                                <td>
                                                <Form.Control
                                                as="select"
                                                size="lg"
                                                name="nama_verifikasi"
                                                value={ this.state.value }
                                                onChange={this.handleChangeField}>
                                                <option value="">---Belum Pilih---</option>
                                                <option value="Verified">Verified</option>
                                                <option value="Pending">Pending</option>
                                                </Form.Control>   
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style={{color: "red"}}>*Wajib dipilih</td>
                                            <td className="d-flex justify-content-end">
                                                    <Button variant="primary" className={classes.button1} onClick={this.handleSave}>
                                                        Simpan
                                                    </Button>
                                                    <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Batal</button>
                                            </td>
                                        </tr>
                                    </Table>
                                </Form>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
           
        )
    }
}

export default OrderVerificationComponent