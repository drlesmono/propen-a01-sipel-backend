import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
import Modal from "../../components/Modal";
import { Form } from "react-bootstrap";

class PenugasanEngineer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [ 
            // {items : [10,  '000010/I/PO-LA/2021', 'PIMS-190621/PT.Aplikasinusa', 'Project Installation (PI), Managed Service (MS)', 'Belum ditugaskan', 'Belum ditugaskan']},
            // {items : [9,  '000010/I/PO-LA/2021', 'PIMS-190621/PT.Aplikasinusa', 'Project Installation (PI), Managed Service (MS)', 'Belum ditugaskan', 'Belum ditugaskan']}
            ],
            isLoading: false,
            isEdit: false,
            orderTarget: null,
            users: [],
            optionPicPiState: "Pilih Engineer",
            optionPicMsState: "Pilih Engineer",
            services: [],
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this); 
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersVerified");
            const users = await APIConfig.get("/users");
            console.log(orders.data);
            this.setState({ ordersVerified: orders.data, users: users.data});
            console.log(users.data);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    checkTypeOrder(pi, ms){
        if(pi === true && ms === true){
            return "Project Installation, Managed Service";
        }else if(pi === true){
            return "Project Installation";
        }else if(ms === true){
            return "Managed Service";
        }
    }

    getPICPI(idOrder){
        let orderTarget = this.state.ordersVerified.filter(
            order => order.idOrder === idOrder
        );
        let pi = orderTarget.map(order => {return order.idOrderPi});
        // console.log(pi[0]);
        // console.log(orderTarget !== null && pi[0] !== null);
    
        if(orderTarget !== null && pi[0] !== null){
            let user = orderTarget.map(order => order.idOrderPi.idUserEng);
            if(user !== null){
                let pic = orderTarget.map(order => order.idOrderPi.idUserEng.fullname);
                return pic;
            }
        }

        return "Belum ditugaskan";
    }

    getPICMS(idOrder){
        let orderTarget = this.state.ordersVerified.filter(
            order => order.idOrder === idOrder
        );
        let ms = orderTarget.map(order => {return order.idOrderMs});
    
        if(orderTarget !== null && ms[0] !== null){
            let user = orderTarget.map(order => order.idOrderMs.idUserPic);
            if(user !== null){
                let pic = orderTarget.map(order => order.idOrderMs.idUserPic.fullname);
                return pic;
            }
        }
        return "Belum ditugaskan";
    }
    
    handleEdit(order) {
        this.setState({isEdit: true, orderTarget: order});
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({isEdit: false});
    }

    render() {
        const { ordersVerified, isEdit, orderTarget, users, optionPicPiState, optionPicMsState} = this.state;
        const tableHeaders = ['No.', 'Id Order', 'Nomor PO', 'Nama Order', 'Tipe', 'PIC PI', 'PIC MS', 'Aksi'];                  
        const tableRows = ordersVerified.map((order) => 
                        [order.idOrder, order.noPO, order.orderName, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.getPICPI(order.idOrder), this.getPICMS(order.idOrder),
                        <CustomizedButtons variant="contained" size="small" color="#FD693E" onClick={() => this.handleEdit(order)}>perbarui</CustomizedButtons>]);
        const tableServiceHeaders = ['No.', 'Nama Service', 'Engineer'];
        let tableServiceRows;
        let listServiceEngineer;
        // console.log(tableRows);

        // console.log(orderTarget.idOrder);
        let optionPicPiStateNew = "Pilih Engineer";
        let optionPicMsStateNew = "Pilih Engineer";
        if(orderTarget !== null){
            if(orderTarget.idOrderPi !== null){
                if(orderTarget.idOrderPi.idUserEng !== null){
                    optionPicPiStateNew = orderTarget.idOrderPi.idUserEng.id;
                }
            }
            if(orderTarget.idOrderMs !== null){
                const ordersMs = ordersVerified.filter(order => order.idOrderMs !== null && order.idOrderMs === orderTarget.idOrderMs);
                tableServiceRows = ordersMs[0].idOrderMs.listService.map((service) =>
                                        [service.name, 
                                        <Form.Control as="select" size="lg" value={service.idUser === null ? "Pilih Engineer" : service.idUser}>
                                            {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                        </Form.Control>]);
                listServiceEngineer = ordersMs[0].idOrderMs.listService.map((service) =>
                                        [service.idUser.id, service.idUser.fullname]);
                listServiceEngineer = listServiceEngineer.filter(user => user !== null);
                console.log(listServiceEngineer);
                // console.log(tableServiceRows);
                if(orderTarget.idOrderMs.idUserPic !== null){
                    optionPicMsStateNew = orderTarget.idOrderMs.idUserPic.id;
                }
            }
            this.setState({optionPicPiState: optionPicPiStateNew, optionPicMsState: optionPicMsStateNew, services: tableServiceRows});  
        }
        // console.log(picPiTarget); 

        return (
            <div>
                <h1>Daftar Order</h1>
                <CustomizedTables headers={tableHeaders} rows={tableRows}/>
                <Modal show={isEdit} handleCloseModal={this.handleCancel}>
                    <div><h3 id='titleform' >Form Penugasan Engineer</h3></div>
                    {orderTarget !== null ?
                        <><Form>
                            <table>
                                <tr>
                                    <td>Id Order</td>
                                    <td>: {orderTarget.idOrder}</td>
                                </tr>
                                <tr>
                                    <td>Nomor PO</td>
                                    <td>: {orderTarget.noPO}</td>
                                </tr>
                                <tr>
                                    <td>Nama Order</td>
                                    <td>: {orderTarget.orderName}</td>
                                </tr>
                                <tr>
                                    <td>Perusahaan</td>
                                    <td>: {orderTarget.clientOrg}</td>
                                </tr>
                                <tr>
                                    <td>Tipe</td>
                                    <td>{this.checkTypeOrder(orderTarget.projectInstallation, orderTarget.managedService)}</td>
                                </tr>
                                { orderTarget.projectInstallation ?
                                <><tr>
                                    <td style={{fontWeight: 'bold'}}>Project Installation</td>
                                </tr>
                                <tr>
                                    <td>PIC Engineer</td>
                                    <td><Form.Control as="select" size="lg" value={optionPicPiState}>
                                            {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                        </Form.Control></td>
                                </tr></>
                                : <></>}
                                { orderTarget.managedService ?
                                <><tr>
                                    <td style={{fontWeight: 'bold'}}>Managed Service</td>
                                </tr>
                                <tr>
                                    <td>Services</td>
                                    <td>
                                        <><CustomizedTables headers={tableServiceHeaders} rows={tableServiceRows}></CustomizedTables></>
                                    </td>
                                </tr>
                                <tr>
                                    <td>PIC Engineer</td>
                                    <td><Form.Control as="select" size="lg" value={optionPicMsState}>
                                            {listServiceEngineer.map(user =><option value={user[0]}>{user[1]}</option>)}
                                        </Form.Control></td>
                                </tr></>
                                : <></>}
                            </table>
                            <div style={{alignItems:'right'}}><CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handle}>
                                simpan
                            </CustomizedButtons></div>
                        </Form></>
                    : <></> }
                </Modal>
            </div>
        );
    }
}

export default PenugasanEngineer;