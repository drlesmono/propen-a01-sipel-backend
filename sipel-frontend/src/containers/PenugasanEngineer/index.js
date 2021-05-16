import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
// import Modal from "../../components/Modal";
import { Form, Button, Card } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";

class PenugasanEngineer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [],
            isLoading: false,
            isEdit: false,
            orderTarget: null,
            users: [],
            picEngineerPi: null,
            picEngineerMs: null,
            servicesEngineer: [],
            isReport: false,
            orderFiltered: [],
            isFiltered: false,
            isError: false,
            isSuccess: false,
            isFailed: false
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReport = this.handleReport.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleCloseNotif = this.handleCloseNotif.bind(this);
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersVerified");
            const users = await APIConfig.get("/users");
            // console.log(orders.data);
            // console.log(users.data);
            this.setState({ ordersVerified: orders.data, users: users.data});
            
        } catch (error) {
            // alert("Oops terjadi masalah pada server");
            this.setState({ isError: true });
            console.log(error);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {
            if(this.state.orderTarget.projectInstallation === true){
                const pi = this.state.orderTarget.idOrderPi;
                const dataPi = {
                    idOrderPi: pi.idOrderPi,
                    idUserEng: this.state.picEngineerPi,
                    percentage: pi.percentage,
                    startPI: pi.startPI,
                    deadline: pi.deadline,
                    dateClosedPI: pi.dateClosedPI
                }
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
                    await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/ms/${this.state.orderTarget.idOrderMs.idOrderMs}/service/${service.idService}/updateService`, dataService);
                }
            }
            this.loadData();
        } catch (error) {
            // alert("Penugasan Engineer gagal disimpan");
            console.log(error);
            return this.setState({isFailed: true});
        }
        // this.handleReport(event);
        this.setState({isSuccess: true, isEdit: false});
    }

    handleReport(event){
        event.preventDefault();
        this.setState({isSuccess: false, isReport: true});
        // alert("Penugasan Engineer berhasil disimpan");
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

    getPICService(service){
        if(service.idUser !== null) return service.idUser.fullname;
        return "Belum ditugaskan";
    }
    
    handleEdit(order) {
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
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({
            isEdit: false, 
            isReport: false, 
            isError: false, 
            isSuccess: false,
            isFailed: false
        });
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

    handleFilter(event){
        let newOrderList = this.state.ordersVerified;
        const { value } = event.target;
        if( value !== "" ){
            newOrderList = this.state.ordersVerified.filter(order => {
                return order.orderName.toLowerCase().includes(value.toLowerCase())
            });
            this.setState({ isFiltered : true });
        }else{
            this.setState({ isFiltered : false });
        }
        this.setState({ orderFiltered : newOrderList });
    }

    handleCloseNotif(){
        this.setState({ isFailed: false });
    }

    render() {
        const { ordersVerified, isEdit, orderTarget, users, picEngineerPi, isFailed,
             picEngineerMs, servicesEngineer, isReport, isError, isSuccess, orderFiltered, isFiltered } = this.state;
        console.log(orderTarget);
        console.log(picEngineerPi);
        console.log(servicesEngineer);
        const tableHeaders = ['No.', 'Id Order', 'Nomor PO', 'Nama Order', 'Tipe', 'PIC PI', 'PIC MS', 'Aksi'];                  
        const tableRows = isFiltered ? orderFiltered.map((order) =>
                        [order.idOrder, order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.getPICPI(order.idOrder), this.getPICMS(order.idOrder),
                        <div className="d-flex justify-content-center"><Button className={classes.button1}
                        onClick={() => this.handleEdit(order)}>perbarui</Button></div>])
                        : ordersVerified.map((order) =>
                        [order.idOrder, order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.getPICPI(order.idOrder), this.getPICMS(order.idOrder),
                        <div className="d-flex justify-content-center"><Button className={classes.button1}
                        onClick={() => this.handleEdit(order)}>perbarui</Button></div>])
        const tableServiceHeaders = ['No.', 'Nama Service', 'Engineer'];
        let tableServiceRows;

        if(orderTarget !== null){
            if(orderTarget.idOrderPi !== null){
            }
            if(orderTarget.idOrderMs !== null){
                tableServiceRows = orderTarget.idOrderMs.listService.map((service, index) =>
                                        [service.name, isReport ? this.getPICService(service) :
                                        <Form.Control as="select" size="sm" key={index} name={"servicesEngineer"+index} 
                                        value={servicesEngineer[index] === null ? users[0].id : servicesEngineer[index]}
                                        onChange={this.handleChangeField}>
                                            {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                        </Form.Control>]);
            }
        }

        const title = isReport? "Penugasan Engineer" : "Form Penugasan Engineer";

        return (
            <div style={{justifyContent: "space-around"}}>
                <div><h1 className="text-center">Daftar Order</h1></div>
                <div className="d-flex justify-content-end" style={{padding: 5}}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter} className={classes.search}/></div>
                <div><CustomizedTables headers={tableHeaders} rows={tableRows}/></div>
                <Modal
                    show={isEdit || isReport}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Header closeButton onClick={this.handleCancel}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {title}
                        </Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                               { isFailed ? 
                               <Card body className={classes.card}>
                                   <div className="d-flex justify-content-between">
                                        <div>Penugasan Engineer Gagal disimpan</div>
                                        <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                    </div>
                                </Card>
                               : <></> }
                            <p>
                                {orderTarget !== null ?
                                <><Form>
                                    <table>
                                        <tr>
                                            <td>Id Order</td>
                                            <td>: {orderTarget.idOrder}</td>
                                        </tr>
                                        <tr>
                                            <td>Nomor PO</td>
                                            <td>: {orderTarget.noPO === null? "-" : orderTarget.noPO}</td>
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
                                            <td>: {this.checkTypeOrder(orderTarget.projectInstallation, orderTarget.managedService)}</td>
                                        </tr>
                                        { orderTarget.projectInstallation ?
                                            <><tr>
                                                <td style={{fontWeight: 'bold'}}>Project Installation</td>
                                            </tr>
                                            <tr>
                                                <td>PIC Engineer</td>
                                                {/* {console.log(picEngineerPi.id === null), console.log(users[0].id), console.log(picEngineerPi), console.log(users[0].id === picEngineerPi)} */}
                                                {isReport ?
                                                <td>: {this.getPICPI(orderTarget.idOrder)}</td> :
                                                <td><Form.Control as="select" size="sm" name="picEngineerPi" value={picEngineerPi === null ? users[0].id : picEngineerPi} onChange={this.handleChangeField}>
                                                        {users.map((user, index) => <option key={index} value={user.id}>{user.fullname}</option>)}
                                                    </Form.Control></td>}
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
                                            {isReport ?
                                                <td>: {this.getPICMS(orderTarget.idOrder)}</td> :
                                            <td><Form.Control as="select" size="sm" name="picEngineerMs" value={picEngineerMs === null ? users[0].id : picEngineerMs} onChange={this.handleChangeField}>
                                                    {/* {listServiceEngineerNew.map(user =><option value={user[1]}>{user[2]}</option>)} */}
                                                    {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                                </Form.Control></td>}
                                        </tr></>
                                        : <></>}
                                    </table>
                                    {isReport ? <></> :
                                    <><br/><div className="d-flex justify-content-end" style={{ marginRight: 35 }}><Button variant="primary" className={classes.button1} onClick={this.handleSubmit}>
                                        simpan
                                    </Button></div></>}
                                </Form></>
                                : <></> }
                            </p>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={isSuccess || isError}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                     <Modal.Header closeButton onClick={this.handleCancel}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Notification
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {isSuccess?
                        <>
                            <div className="d-flex justify-content-center">Penugasan Engineer berhasil disimpan.</div><br></br>
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" className={classes.button1} onClick={this.handleReport}>
                                    Kembali
                                </Button>
                            </div>
                        </> :
                        <>
                        <div className="d-flex justify-content-center">Oops terjadi masalah pada server</div><br></br>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" className={classes.button1} onClick={this.handleCancel}>
                                Kembali
                            </Button>
                        </div>
                        </>}
                    </Modal.Body>
                </Modal>
        </div>
        );
    }
}

export default PenugasanEngineer;