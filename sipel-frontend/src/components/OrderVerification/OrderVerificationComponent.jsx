import React, { Component } from 'react'
import OrderService from "../../services/OrderService";
import { Form } from "react-bootstrap";


class OrderVerificationComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            idOrder: this.props.match.params.idOrder,
            verified: false, 
            
            

        }
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    componentDidMount(){
        OrderService.getOrderByIdOrder(this.state.idOrder).then( (res) =>{
            let order = res.data;
        });
    }
    

    handleChangeField= (event) => {
        if (event.target.value === "Verified"){
            this.setState({verified: true});
        } else {
            this.setState({verified: false});
        }
        
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
                                                                
                        
                                        <label>Pilih Status :</label>
                                        <td><Form.Control
                                                as="select"
                                                size="lg"
                                                name="statusMs"
                                                value={ this.state.value }
                                                onChange={this.handleChangeField}>
                                                <option value="">---Belum Pilih---</option>
                                                <option value="Verified">Verified</option>
                                                <option value="Pending">Pending</option>
                                            </Form.Control></td>
                                            <button className="btn btn-success" onClick={this.handleSubmit}>Simpan</button>
                                            <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Batal</button>
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
           
        )
    }
}

export default OrderVerificationComponent