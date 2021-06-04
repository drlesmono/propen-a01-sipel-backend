import React, { Component } from 'react'
import OrderService from "../../services/OrderService";
import classes from "./styles.module.css";

class OrderDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            
            idOrder: this.props.match.params.idOrder,
            order: {}
            

        }
        this.getJenisOrder = this.getJenisOrder.bind(this);
        this.cancel = this.cancel.bind(this);
    }


    cancel(){
        this.props.history.push(`/order-verification`); 
    }
    
    getJenisOrder(){
        if(this.state.order.managedService && this.state.order.projectInstallation){
            return "Installation Project & Managed Service";
        }
        
        if (this.state.order.managedService === true){
            return "Managed Service";
        }

        if(this.state.order.projectInstallation){
            return "Installation Project";
        }
    }

    componentDidMount(){
        OrderService.getOrderByIdOrder(this.state.idOrder).then( res => {
            this.setState({order: res.data});
        })
    }

    render() {
        return (
            <div className={classes.container}>
            <div>
                <br></br>
                
                <h3>{'Detail Order '+this.state.order.orderName} </h3>
                <br></br>
                        <table class="table table-borderless">
                            <tbody>
                                <tr>
                                <th scope="row">Nama Order</th>
                                <td>{': '+this.state.order.orderName}</td>
                                <th scope="row">Nama Klien</th>
                                <td>{': '+ this.state.order.clientName}</td>
                                </tr>

                                <tr>
                                <th scope="row">Nomor PO</th>
                                <td>{': '+ this.state.order.noPO}</td>
                                <th scope="row">Organisasi Klien</th>
                                <td>{': '+ this.state.order.clientOrg}</td>
                                </tr>

                                <tr>
                                <th scope="row">Nomor SPH</th>
                                <td>{': '+ this.state.order.noSPH}</td>
                                <th scope="row">Nomor Telepon Klien</th>
                                <td>{': '+ this.state.order.clientPhone}</td>
                                </tr>

                                <tr>
                                <th scope="row">Deskripsi</th>
                                <td>{': '+ this.state.order.description}</td>
                                <th scope="row">Email Klien</th>
                                <td>{': '+ this.state.order.clientEmail}</td>                                
                                </tr>

                                <tr>
                                <th scope="row">Tanggal Masuk</th>
                                <td>{': '+ this.state.order.dateOrder}</td>    
                                <th scope="row">PIC Klien</th>
                                <td>{': '+ this.state.order.clientPIC}</td>                             
                                </tr>

                                <tr>
                                <th scope="row">Jenis Order</th>
                                <td>{': '+ this.getJenisOrder()}</td>
                                </tr>

                                <button className="btn btn-info" onClick={this.cancel.bind(this)}>Kembali</button>
                                 
                            </tbody>
                        </table>
                    </div></div>
               
                    

                
        )
    }
}

export default OrderDetails