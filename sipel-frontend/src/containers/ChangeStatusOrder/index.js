import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
import Modal from "../../components/Modal";
import { Form } from "react-bootstrap";

class ChangeStatusOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [],
            isLoading: false,
            isEdit: false,
            orderTarget: null,
            users: [],
            listService: [],

        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersVerified");
            const users = await APIConfig.get("/users");
            // const services = await APIConfig.get("/services");
            console.log(orders.data);
            console.log(users.data);
            this.setState({ ordersVerified: orders.data, users: users.data});

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

    checkStatus(order){
        if (order.projectInstallation === true){
            return order.idOrderPi.status;
        }
        else if (order.managedService === true){
            return order.idOrderMs.status;
        }
    }

    handleEdit(order, listService) {
        this.setState({isEdit: true, orderTarget: order, listService: listService});
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({isEdit: false});
    }

    handleChangeField(event) {
        const { name, value } = event.target;
        console.log(name, value);
        this.setState({ [name]: value});
    }

    render() {
        const { ordersVerified, isEdit, orderTarget, users} = this.state;
        let listService;
        const tableHeaders = ['No.', 'Id Order', 'Nomor PO', 'Perusahaan', 'Tipe', 'Status','Aksi'];
        const tableRows = ordersVerified.map((order) => [
            order.idOrder,
            order.noPO,
            order.clientName,
            this.checkTypeOrder(order.projectInstallation, order.managedService),
            this.checkStatus(order),
            <CustomizedButtons
                variant="contained"
                size="small"
                color="#FD693E"
                onClick={() => this.handleEdit(order, listService)}>
                    Ubah
            </CustomizedButtons>
        ]);
        const tableServiceHeaders = ['No.', 'Nama Service', 'Status'];
        let tableServiceRows;

        if(orderTarget !== null){
            if(orderTarget.idOrderPi !== null){
            }
            if(orderTarget.idOrderMs !== null){
                const ordersMs = ordersVerified.filter(order => order.idOrderMs !== null && order.idOrderMs === orderTarget.idOrderMs);
                tableServiceRows = ordersMs[0].idOrderMs.listService.map((service, index) => [
                    service.name,
                    <Form.Control
                        as="select"
                        size="lg"
                        name="statusPi"
                        value={ this.checkStatus(orderTarget) }
                        onChange={this.handleChangeField}>
                            <option value="Not Maintained">Not Maintained</option>
                            <option value="Maintained">Maintained</option>
                    </Form.Control>
                ]);
                listService = ordersMs[0].idOrderMs.listService.map((service) => service.idService);
            }
        }

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
                                    <td>Perusahaan</td>
                                    <td>: {orderTarget.clientOrg}</td>
                                </tr>
                                { orderTarget.projectInstallation ?
                                    <><tr>
                                        <td style={{fontWeight: 'bold'}}>Project Installation</td>
                                    </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td><Form.Control
                                                as="select"
                                                size="lg"
                                                name="statusPi"
                                                value={ this.checkStatus(orderTarget) }
                                                onChange={this.handleChangeField}>
                                                    <option value="Inactive">Inactive</option>
                                                    <option value="In Progress">In Progress</option>
                                                    <option value="On Hold">On Hold</option>
                                                    <option value="Closed">Closed</option>
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
                                                <><CustomizedTables
                                                    headers={tableServiceHeaders}
                                                    rows={tableServiceRows}>
                                                </CustomizedTables></>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Status</td>
                                            <td><Form.Control
                                                as="select"
                                                size="lg"
                                                name="statusPi"
                                                value={ this.checkStatus(orderTarget) }
                                                onChange={this.handleChangeField}>
                                                <option value="Inactive">Inactive</option>
                                                <option value="Active">Active</option>
                                                <option value="Closed">Closed</option>
                                            </Form.Control></td>
                                        </tr></>
                                    : <></>}
                            </table>
                            <div style={{alignItems:'right'}}>
                                <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleCancel}>
                                    Simpan
                                </CustomizedButtons>
                            </div>
                        </Form></>
                        : <></> }
                </Modal>
            </div>
        )
    }


}

export default ChangeStatusOrder;