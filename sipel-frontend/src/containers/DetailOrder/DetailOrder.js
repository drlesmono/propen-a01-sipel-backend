import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import Order from "../../components/Order/orderDetail";
import ProjectInstallation from "../../components/ProjectInstallation/piDetail";
import ManagedService from "../../components/ManagedService/msDetail";
import { withRouter } from "react-router-dom";
import CustomizedTables from "../../components/Table";
import Modal from "../../components/Modal";
import ServiceList from "../../components/Services/serviceList";
import { Button } from "react-bootstrap";
import * as moment from "moment";

const initState = {
    name: "",
}

class DetailOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrder: this.props.match.params.id,
            idOrderPi: "",
            idOrderMs: "",
            ordersPI: [],
            ordersMS: [],
            orderTarget: null,
            noPO: "",
            noSPH: "",
            orderName: "",
            description: "",
            projectInstallation: false,
            managedService: false,
            startPI: "",
            deadline:"",
            close: false,
            percentage: 0.0,
            actualStart: "",
            actualEnd: "",
            activated: false,
            listService: [],
            clientName: "",
            clientDiv: "",
            clientPIC: "",
            clientOrg: "",
            clientPhone: "",
            clientEmail: "",
            dateOrder: "",
            verified: false,
            idService: "",
            name: "",
            serviceTarget: null,
            listServiceNew: [{ index: Math.random(), name: ""}],
            finishedSubmitService: false,
            isChangeService: false,
            finishedDeleteService: false,
            finishedSubmitAddService: false,
            isAddService: false,
        }
        this.handleLookDetail = this.handleLookDetail.bind(this);
        this.handleLookService = this.handleLookService.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
        this.handleChangeOrderPI = this.handleChangeOrderPI.bind(this);
        this.handleChangeOrderMS = this.handleChangeOrderMS.bind(this);
        this.handleChangeOrderPIMS = this.handleChangeOrderPIMS.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.changeService = this.changeService.bind(this);
        this.handleSubmitChangeService = this.handleSubmitChangeService.bind(this);
        this.deleteService = this.deleteService.bind(this);
        this.handleToChangeService = this.handleToChangeService.bind(this);
        this.handleAfterSubmit = this.handleAfterSubmit.bind(this);
        this.handleAfterDelete = this.handleAfterDelete.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeFieldService = this.handleChangeFieldService.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.clickOnDelete = this.clickOnDelete.bind(this);
        this.handleSubmitTambahService = this.handleSubmitTambahService.bind(this);
        this.handleTambahService = this.handleTambahService.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const listOrderPI  = await APIConfig.get("/orderPI");
            const listOrderMS  = await APIConfig.get("/orderMS");
            const orderItem  = await APIConfig.get(`/order/detail/${this.state.idOrder}`);
            this.setState({ ordersPI: listOrderPI.data });
            this.setState({ ordersMS: listOrderMS.data });
            this.setState({ orderTarget: orderItem.data });
            this.handleLookDetail();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    getPIorder(idOrder) {
        let pi = this.state.ordersPI.filter(pi => pi.idOrder.idOrder === idOrder);
        if (pi.length !== 0) {
            return pi[0];
        }
        return null;
    }

    getMSorder(idOrder) {
        let ms = this.state.ordersMS.filter(ms => ms.idOrder.idOrder === idOrder);
        if (ms.length !== 0) {
            return ms[0];
        }
        return null;
    }

    checkTypeOrder(pi, ms) {
        if(pi === true && ms === true){
            return "Project Installation, Managed Service";
        }else if(pi === true){
            return "Project Installation";
        }else if(ms === true){
            return "Managed Service";
        }
    }

    checkStatusOrder(verif) {
        if(verif === true){
            return "Verified";
        }else {
            return "Not Verified";
        }
    }

    checkActivatedMS(active) {
        if(active === true){
            return "Activated";
        } else {
            return "Not Activated";
        }
    }

    checkClosedPI(close) {
        if(close === true){
            return "Closed";
        } else {
            return "Not Closed";
        }
    }

    getDate(date) {
        let oldDate = new Date(date);
        const month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return oldDate.getDate() + " " + month[oldDate.getMonth()] + " " + oldDate.getFullYear();

    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleBack = () => {
        this.props.history.push(`/order/order`);
    }

    handleLookDetail() {
        let order = this.state.orderTarget;
        this.setState({
            noPO: order.noPO,
            noSPH: order.noSPH,
            orderName: order.orderName,
            description: order.description,
            projectInstallation: order.projectInstallation,
            managedService: order.managedService,
            clientName: order.clientName,
            clientDiv: order.clientDiv,
            clientPIC: order.clientPIC,
            clientOrg: order.clientOrg,
            clientPhone: order.clientPhone,
            clientEmail: order.clientEmail,
            dateOrder: order.dateOrder,
            verified: order.verified,
        })
        let isPI = order.projectInstallation;
        let isMS = order.managedService;
        if (isPI === true) {
            const ordPI = this.getPIorder(order.idOrder);
            this.setState({
                idOrderPi: ordPI.idOrderPi,
                startPI: ordPI.startPI,
                deadline: ordPI.deadline,
                close: ordPI.close,
                percentage: ordPI.percentage,
            });
        }
        if (isMS === true) {
            const ordMS = this.getMSorder(order.idOrder);
            this.setState({
                idOrderMs: ordMS.idOrderMs,
                actualStart: ordMS.actualStart,
                actualEnd: ordMS.actualEnd,
                activated: ordMS.activated,
            });
            this.handleLookService();
        }
    }

    async handleLookService() {
        try {
            const services = await APIConfig.get(`/order/MS/${this.state.idOrderMs}/listService`);
            this.setState({ listService: services.data });
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    async changeService(idService) {
        try {
            const serviceItem = await APIConfig.get(`/order/detail/Service/${idService}`);
            this.setState({ serviceTarget: serviceItem.data });
            console.log(this.state.serviceTarget);
            this.handleToChangeService();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    async handleSubmitChangeService(event) {
        event.preventDefault();
        try {
            const data = {
                name: this.state.name,
            }
            await APIConfig.put(`/order/ubah/service/${this.state.idService}`, data);
            this.loadData();
            this.setState({ finishedSubmitService: true });
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async deleteService(idService) {
        try {
            await APIConfig.delete(`order/delete/service/${idService}`);
            this.loadData();
            this.setState({ finishedDeleteService: true });
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleToChangeService() {
        let service = this.state.serviceTarget;
        this.setState({
            idService: service.idService,
            name: service.name,
            isChangeService: true,
        })
    }

    handleChangeOrderPI = () => {
        this.props.history.push(`/orderPI/change/${this.state.idOrder}/${this.state.idOrderPi}`);
    }

    handleChangeOrderMS = () => {
        this.props.history.push(`/orderMS/change/${this.state.idOrder}/${this.state.idOrderMs}`);
    }
    
    handleChangeOrderPIMS = () => {
        this.props.history.push(`/orderPIMS/change/${this.state.idOrder}/${this.state.idOrderPi}/${this.state.idOrderMs}`);
    }


    handleAfterSubmit = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`);
        this.setState({ finishedSubmitService: false });
    }

    handleAfterDelete = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`);
        this.setState({ finishedDeleteService: false });
    }

    handleAfterAdd = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`);
        this.setState({ finishedSubmitAddService: false });
    }

    handleCancelSubmit(event) {
        event.preventDefault();
        this.setState({ isChangeService: false, isAddService: false });
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({ isChangeService: false, isAddService: false, ...initState });
    }

    handleChangeFieldService = (e) => {
        if (["name"].includes(e.target.name)) {
            let listServiceNew = [...this.state.listServiceNew]
            listServiceNew[e.target.dataset.id][e.target.name] = e.target.value;
        }
    }

    addNewRow = () => {
        this.setState((prevState) => ({
            listServiceNew: [...prevState.listServiceNew, { index: Math.random(), name: "" }],
        }));
    }

    deleteRow = (index) => {
        this.setState({
            listServiceNew: this.state.listServiceNew.filter((s, sindex) => index !== sindex),
        });
    }

    clickOnDelete(record) {
        this.setState({
            listServiceNew: this.state.listServiceNew.filter(r => r !== record)
        });
    }

    handleTambahService(event) {
        event.preventDefault();
        this.setState({ isAddService: true });
    }

    async handleSubmitTambahService(event) {
        event.preventDefault();
        try {
            for (let i=0; i<this.state.listServiceNew.length;i++) {
                const data = {
                    name: this.state.listServiceNew[i].name,
                };
                await APIConfig.post(`/order/tambah/MS/${this.state.idOrderMs}/Service`, data);
                this.loadData();
                this.setState({ finishedSubmitAddService: true });
            }
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    render() {
        const {
            idOrder,
            idOrderPi,
            idOrderMs,
            ordersPI,
            ordersMS,
            orderTarget ,
            noPO,
            noSPH,
            orderName,
            description,
            projectInstallation ,
            managedService ,
            startPI,
            deadline,
            close,
            percentage,
            actualStart,
            actualEnd,
            activated,
            clientName,
            clientDiv,
            clientPIC,
            clientOrg,
            clientPhone,
            clientEmail,
            dateOrder,
            verified,
            isPIchange,
            finishedSubmit,
            name,
        } = this.state;

        let { listService } = this.state;

        let { listServiceNew } = this.state;

        const tableHeaders = [
            'No', 'Nama Service', 'Ubah Service', 'Hapus Service'
        ];

        const tableRows = listService.map((service) => [service.name,
            <Button className={classes.button1} onClick={() => this.changeService(service.idService)}>&nbsp;Ubah&nbsp;</Button>, 
            <Button className={classes.button2} onClick={() => this.deleteService(service.idService)}>Hapus</Button>
        ]);

        return (
            <div className={classes.container}>
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Detail Order</h1>
            <br></br>
            <div className="row" style={{ marginTop: 10 }}>
                <div className="col-sm-1"></div>
                <div className="col-sm-10">
                    <div className="card">
                        <div className="card-body">
                            {this.state.projectInstallation && !this.state.managedService? 
                            <><div className="text-right">
                                <Button className={classes.button1} onClick={() => this.handleChangeOrderPI()}>&nbsp;Ubah Order&nbsp;</Button>
                            </div></>
                            : <></>}
                            {this.state.managedService && !this.state.projectInstallation ? 
                            <><div className="text-right">
                                <Button className={classes.button1} onClick={() => this.handleChangeOrderMS()}>&nbsp;Ubah Order&nbsp;</Button>
                            </div></>
                            : <></>}
                            {this.state.managedService && this.state.projectInstallation ? 
                            <><div className="text-right">
                                <Button className={classes.button1} onClick={() => this.handleChangeOrderPIMS()}>&nbsp;Ubah Order&nbsp;</Button>
                            </div></>
                            : <></>}
                            <Order 
                                key={this.state.idOrder}
                                idOrder={this.state.idOrder}
                                noPO={this.state.noPO}
                                noSPH={this.state.noSPH}
                                orderName={this.state.orderName}
                                description={this.state.description}
                                clientName={this.state.clientName}
                                clientDiv={this.state.clientDiv}
                                clientPIC={this.state.clientPIC}
                                clientOrg={this.state.clientOrg}
                                clientPhone={this.state.clientPhone}
                                clientEmail={this.state.clientEmail}
                                dateOrder={this.getDate(this.state.dateOrder)}
                                verified={this.checkStatusOrder(this.state.verified)}
                                jenis={this.checkTypeOrder(this.state.projectInstallation, this.state.managedService)}
                            />
                        </div>
                        <div className="card-body">
                            {this.state.projectInstallation 
                            ? 
                            <>
                            <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <h3 className={classes.subtitle}>Detail Data Project Installation</h3>
                                </div>
                            </div>
                            </div>
                            <ProjectInstallation 
                                key={this.state.idOrderPi}
                                idOrderPi={this.state.idOrderPi}
                                startPI={this.getDate(this.state.startPI)}
                                deadline={this.getDate(this.state.deadline)}
                                percentage={this.state.percentage}
                                close={this.checkClosedPI(this.state.close)} /><br></br>
                            </>
                            : 
                                <></>
                            }
                            {this.state.managedService
                            ? 
                            <>
                            <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <h3 className={classes.subtitle}>Detail Data Managed Service</h3>
                                </div>
                            </div>
                            </div>
                            <ManagedService 
                                key={this.state.idOrderMs}
                                idOrderMs={this.state.idOrderMs}
                                actualStart={this.getDate(this.state.actualStart)}
                                actualEnd={this.getDate(this.state.actualEnd)}
                                activated={this.checkActivatedMS(this.state.activated)}/>
                            <br></br>
                            <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <h3 className={classes.subtitle}>Daftar Services</h3>
                                </div>
                            </div>
                            <div className="col-sm-6">
                            <div className="text-right">
                                <Button className={classes.button1} onClick={this.handleTambahService}>+ Tambah Services</Button>
                            </div>
                            </div>
                            </div>
                            <br></br>
                            <CustomizedTables headers={tableHeaders} rows={tableRows} /><br></br>
                            </>
                            : <></> }
                        </div>
                        <div className="card-footer text-right">
                            <Button className={classes.button1} onClick={() => this.handleBack()}>&nbsp;Kembali&nbsp;</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={this.state.isChangeService} >
                <form onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center">Ubah Service</div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-10">
                                            <div className="form-group">
                                                <label className="required">Nama Service</label>
                                                <input 
                                                    type="text" 
                                                    name="name" 
                                                    id="name" 
                                                    className="form-control" 
                                                    placeholder="Masukkan nama service" 
                                                    value={name} 
                                                    onChange={this.handleChange} />
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer text-center">
                                        <Button className={classes.button1} onClick={this.handleSubmitChangeService}>Simpan</Button>
                                        <span>&nbsp;&nbsp;</span>
                                        <Button className={classes.button2} onClick={this.handleCancelSubmit}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.finishedSubmitService}>
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>{`Service Berhasil Diubah`}</h2>
                        </div>
                        <div className="card-footer text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterSubmit()}>Kembali</Button>
                        </div>
                    </div>
                </Modal>

                <Modal show={this.state.finishedDeleteService}>
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>{`Service Berhasil Dihapus`}</h2>
                        </div>
                        <div className="card-footer text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterDelete()}>Kembali</Button>
                        </div>
                    </div>
                </Modal>

                <Modal show={this.state.isAddService} >
                <form onChange={this.handleChangeFieldService} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center">Tambah Services</div>
                                    <div className="card-body">
                                        <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="required">Nama Services</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <ServiceList add={this.addNewRow} delete={this.clickOnDelete} listService={listServiceNew} />
                                        </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer text-center">
                                        <Button className={classes.button1} onClick={this.handleSubmitTambahService}>Simpan</Button>
                                        <span>&nbsp;&nbsp;</span>
                                        <Button className={classes.button2} onClick={this.handleCancelSubmit}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.finishedSubmitAddService}>
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>{`Service Berhasil Ditambahkan`}</h2>
                        </div>
                        <div className="card-footer text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterAdd()}>Kembali</Button>
                        </div>
                    </div>
                </Modal>
            </div>
            </div>
        );
    }
}

export default withRouter(DetailOrder);