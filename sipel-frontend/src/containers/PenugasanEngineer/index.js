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
            // isChange: false,
            orderTarget: null,
            users: [],
            picEngineerPi: null,
            picEngineerMs: null,
            servicesEngineer: [],
            // listService: [],
            // services: [],
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
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

    async handleSubmit(event) {
        event.preventDefault();
        try {
            if(this.state.orderTarget.projectInstallation === true){
                // console.log(this.state.orderTarget.idOrderPi);
                const pi = this.state.orderTarget.idOrderPi;
                const dataPi = {
                    idOrderPi: pi.idOrderPi,
                    idUserEng: this.state.picEngineerPi,
                    percentage: pi.percentage,
                    startPI: pi.startPI,
                    deadline: pi.deadline,
                    dateClosedPI: pi.dateClosedPI
                }
                // console.log(dataPi);
                await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/pi/${this.state.orderTarget.idOrderPi.idOrderPi}/updatePIC`, dataPi);
            }
            if(this.state.orderTarget.managedService === true){
                const ms = this.state.orderTarget.idOrderMs;
                const dataMs = {
                    idOrderMs: ms.idOrderMs,
                    idUserPic: this.state.picEngineerMs,
                    actualStart: ms.actualStart,
                    actualEnd: ms.actualEnd,
                    activated: ms.activated,
                    timeRemaining: ms.timeRemaining,
                    dateClosedMS: ms.dateClosedMS
                }
                // console.log(dataMs);
                await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/ms/${this.state.orderTarget.idOrderMs.idOrderMs}/updatePIC`, dataMs);
                let listService = this.getListService(this.state.orderTarget);
                console.log(this.state.servicesEngineer);
                for(let i=0; i<this.state.servicesEngineer.length; i++){
                    console.log(i);
                    let service = listService[i];
                    console.log(service);
                    const dataService = {
                        idService: service.idService,
                        name: service.name,
                        idUser: this.state.servicesEngineer[i]
                    }
                    console.log(this.state.orderTarget.idOrderMs.idOrderMs);
                    // console.log(dataService);
                    await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/ms/${this.state.orderTarget.idOrderMs.idOrderMs}/service/${service.idService}/updateEngineer`, dataService);
                    // console.log(dataService);
                }
            }
            this.loadData();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
        this.setState({ 
            orderTarget: null,
            users: [],
            picEngineerPi: null,
            picEngineerMs: null,
            servicesEngineer: []
        });
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
    
        if(orderTarget !== null && pi[0] !== null){
            let user = orderTarget.map(order => order.idOrderPi.idUserEng)[0];
            console.log(user);
            if(user !== null){
                let pic = user.fullname;
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
                // let listService = ms[0].listService;
                // this.setState({ listService: listService });
                return pic;
            }
        }
        return "Belum ditugaskan";
    }
    
    handleEdit(order) {
        // const { value } = event.target;
        // console.log(event.target);
        // console.log(value);
        // const order = this.getOrder(value);
        this.setState({
            isEdit: true,
            orderTarget: order
        });
        if(order.idOrderPi !== null){
            if(order.idOrderPi.idUserEng !== null){
                this.setState({picEngineerPi: order.idOrderPi.idUserEng.id});
            }
        }
        if(order.idOrderMs !== null){
            if(order.idOrderMs.idUserPic !== null){
                let servicesEngineer = order.idOrderMs.listService.map(service => service.idUser.id);
                this.setState({
                    picEngineerMs: order.idOrderMs.idUserPic.id, 
                    servicesEngineer: servicesEngineer
                });
            }
        }
        // console.log(this.state.orderTarget);
        // console.log(this.state.picEngineerPi);
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({isEdit: false});
    }

    handleChangeField(event) {
        const { name, value } = event.target;
        console.log(name, value);
        const servicesEngineerNew = this.state.servicesEngineer;
        if( name.substring(0,16) === "servicesEngineer"){
            let index = Number(name.substring(16));
            servicesEngineerNew[index] = value;
            this.setState({ servicesEngineer: servicesEngineerNew});
        }else{
            this.setState({ [name]: value});
        }
    }

    getListService(order){
        if(order.idOrderMs !== null){
            return order.idOrderMs.listService;
        }
    }

    getOrder(idOrder){
        const orders = this.state.ordersVerified;
        for(let i=0; i<=orders.length; i++){
            if(orders[i].idOrder === idOrder){
                return orders[i];
            }
        }
    }

    render() {
        const { ordersVerified, isEdit, orderTarget, users, picEngineerPi, picEngineerMs, servicesEngineer} = this.state;
        console.log(orderTarget);
        console.log(picEngineerPi);
        console.log(servicesEngineer);
        const tableHeaders = ['No.', 'Id Order', 'Nomor PO', 'Nama Order', 'Tipe', 'PIC PI', 'PIC MS', 'Aksi'];                  
        const tableRows = ordersVerified.map((order) =>
                        [order.idOrder, order.noPO, order.orderName, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.getPICPI(order.idOrder), this.getPICMS(order.idOrder),
                        <CustomizedButtons variant="contained" size="small" color="#FD693E"
                        onClick={() => this.handleEdit(order)}>perbarui</CustomizedButtons>]);
        const tableServiceHeaders = ['No.', 'Nama Service', 'Engineer'];
        let tableServiceRows;

        if(orderTarget !== null){
            if(orderTarget.idOrderPi !== null){
            }
            if(orderTarget.idOrderMs !== null){
                tableServiceRows = orderTarget.idOrderMs.listService.map((service, index) =>
                                        [service.name, 
                                        <Form.Control as="select" size="lg" key={index} name={"servicesEngineer"+index} 
                                        value={servicesEngineer[index] === null ? users[0].id : servicesEngineer[index]}
                                        onChange={this.handleChangeField}>
                                            {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                        </Form.Control>]);
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
                                    {/* {console.log(picEngineerPi.id === null), console.log(users[0].id), console.log(picEngineerPi), console.log(users[0].id === picEngineerPi)} */}
                                    <td><Form.Control as="select" size="lg" name="picEngineerPi" value={picEngineerPi === null ? users[0].id : picEngineerPi} onChange={this.handleChangeField}>
                                            {users.map((user, index) => <option key={index} value={user.id}>{user.fullname}</option>)}
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
                                    <td><Form.Control as="select" size="lg" name="picEngineerMs" value={picEngineerMs === null ? users[0].id : picEngineerMs} onChange={this.handleChangeField}>
                                            {/* {listServiceEngineerNew.map(user =><option value={user[1]}>{user[2]}</option>)} */}
                                            {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                        </Form.Control></td>
                                </tr></>
                                : <></>}
                            </table>
                            <div style={{alignItems:'right'}}><CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmit}>
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