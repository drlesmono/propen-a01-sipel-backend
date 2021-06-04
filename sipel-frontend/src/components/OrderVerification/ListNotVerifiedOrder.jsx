import React, { Component } from 'react'
import OrderService from "../../services/OrderService";
import classes from "./styles.module.css";


class ListNotVerifiedOrder extends Component {
    constructor(props) {
        super(props)

        this.state = {
            Orders: []

        }
        this.retrieveOrderDetails = this.retrieveOrderDetails.bind(this);
        this.getJenisOrder = this.getJenisOrder.bind(this);
        this.orderVerification = this.orderVerification.bind(this);
    }

    orderVerification(idOrder){
        this.props.history.push(`/verification/${idOrder}`);
    }

    retrieveOrderDetails(idOrder){ 
        this.props.history.push(`/order-details/${idOrder}`);
    }

    getJenisOrder(order){
        if(order.managedService && order.projectInstallation){
            return "Installation Project & Managed Service";
        }
        
        if (order.managedService === true){
            return "Managed Service";
        }

        if(order.projectInstallation){
            return "Installation Project";
        }
    }

    componentDidMount(){

        OrderService.getAllNotVerifiedOrders().then((res) => {
            this.setState({Orders: res.data});
        });
        
    }

    render() {
        return (
            <div className={classes.container}>
            <div>
                <h2 className="text-center">Daftar Order Belum Terverifikasi</h2>
                <div className = "row">
                    <table className = "table table-striped table-bordered">

                        <thead>
                            <tr>
                                <th>Nama Order</th>
                                <th>Nomor PO</th>
                                <th>Perusahaan</th>
                                <th>Nama Pelanggan</th>
                                <th>Jenis</th>
                                <th>Tanggal Masuk</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                this.state.Orders.map(
                                    order =>
                                    <tr key = {order.idOrder}>
                                        <td>{order.orderName}</td>
                                        <td>{order.noPO}</td>
                                        <td>{order.clientOrg}</td>
                                        <td>{order.clientName}</td>
                                        <td>{this.getJenisOrder(order)}</td>
                                        <td>{order.dateOrder}</td>
                                        <td>
                                        <button className="btn btn-primary" onClick = { () => this.retrieveOrderDetails(order.idOrder)}>Lihat Order </button>
                                        <button className="btn btn-info" onClick = { () => this.orderVerification(order.idOrder)}>Verifikasi</button>
                                        </td>
                                    </tr>

                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div></div>
        )
    }
}

export default ListNotVerifiedOrder