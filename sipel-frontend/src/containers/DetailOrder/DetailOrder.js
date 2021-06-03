import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import Order from "../../components/Order/orderDetail";
import ProjectInstallation from "../../components/ProjectInstallation/piDetail";
import ManagedService from "../../components/ManagedService/msDetail";
import { withRouter } from "react-router-dom";
import CustomizedTables from "../../components/Table";
//import Modal from "../../components/Modal";
import ServiceList from "../../components/Services/serviceList";
import Modal from "react-bootstrap/Modal";
import { Button } from "react-bootstrap";
import * as moment from "moment";
import { store } from "react-notifications-component";
import ReactNotification from "react-notifications-component";

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
            documents: [], //dok order
            documentTarget: null,
            isDelete: false,
            isError: false,
            isDeleteSuccess: false,
            isDeleteService: false,
            serviceTargetToDelete: null,
            isCancelChangeService: false,
            isCancelToAddService: false,
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
        this.handleAfterError = this.handleAfterError.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
        this.handleConfirmDeleteService = this.handleConfirmDeleteService.bind(this);
        this.noCancelChange = this.noCancelChange.bind(this);
        this.handleCancelSubmitService = this.handleCancelSubmitService.bind(this);
        this.noCancelToAdd = this.noCancelToAdd.bind(this);
        this.handleCancelSubmitAddService = this.handleCancelSubmitAddService.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const listOrderPI  = await APIConfig.get("/orders/pi");
            const listOrderMS  = await APIConfig.get("/orders/ms");
            const orderItem  = await APIConfig.get(`/order/detail/${this.state.idOrder}`);
            const docList = await APIConfig.get(`/order/${this.state.idOrder}/documents`); //doc order
            this.setState({ ordersPI: listOrderPI.data });
            this.setState({ ordersMS: listOrderMS.data });
            this.setState({ orderTarget: orderItem.data });
            this.setState({ documents: docList.data }); //doc order
            this.handleLookDetail();
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
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
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
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
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    async handleSubmitChangeService(event) {
        event.preventDefault();
        try {
            if (this.state.name === "" || this.state.name === null) {
                store.addNotification({
                    title: "Peringatan!",
                    message: "Anda wajib mengisi field Nama Service",
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 380
                });
                return false;
            }
            const data = {
                name: this.state.name,
            }
            // await APIConfig.put(`/order/ubah/service/${this.state.idService}`, data);
            await APIConfig.put(`/order/${this.state.orderTarget.idOrder.idOrder}/service/${this.state.idService}/updateService`, data);
            this.loadData();
            this.setState({ finishedSubmitService: true });
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
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
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.setState({ isDeleteService: false });
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
        this.setState({ finishedDeleteService: false, isDeleteSuccess: false });
    }

    handleAfterAdd = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`);
        this.setState({ finishedSubmitAddService: false });
    }

    handleAfterError = () => {
        this.props.history.push(`/order/order`);
        this.setState({ isError: false });
    }

    handleCancelSubmit(event) {
        event.preventDefault();
        this.setState({ isChangeService: false, isAddService: false, isCancelChangeService: false, isCancelToAddService: false });
    }

    handleCancelSubmitService(event) {
        event.preventDefault();
        this.setState({ isCancelChangeService: true });
    }

    handleCancelSubmitAddService(event) {
        event.preventDefault();
        this.setState({ isCancelToAddService: true });
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({ isChangeService: false, isAddService: false, isDelete: false, isDeleteService: false, ...initState });
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

    noCancelChange(event){
        event.preventDefault()
        this.setState({ isCancelChangeService: false });
    }

    noCancelToAdd(event){
        event.preventDefault()
        this.setState({ isCancelToAddService: false });
    }

    handleTambahService(event) {
        event.preventDefault();
        this.setState({ isAddService: true });
    }

    async handleSubmitTambahService(event) {
        event.preventDefault();
        try {
            for (let i=0; i<this.state.listServiceNew.length;i++) {
                if (this.state.listServiceNew[i].name === "" || this.state.listServiceNew[i].name === null) {
                    store.addNotification({
                        title: "Peringatan!",
                        message: "Anda wajib mengisi field Nama Service",
                        type: "warning",
                        container: "top-left",
                        insert: "top",
                        animationIn: ["animated", "fadeIn"],
                        animationOut: ["animated", "fadeout"],
                        dismiss: {
                            duration: 7000,
                            showIcon: true,
                        },
                        width: 380
                    });
                    return false;
                }
            }
            for (let i=0; i<this.state.listServiceNew.length;i++) {
                const data = {
                    name: this.state.listServiceNew[i].name,
                };
                await APIConfig.post(`/order/tambah/MS/${this.state.idOrderMs}/Service`, data);
                this.loadData();
                this.setState({ finishedSubmitAddService: true });
            }
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    getUrl(document){
        const BASE_URL = "https://propen-a01-sipel.herokuapp.com/order/document/";
        if(document.fileType === "application/pdf"){
            return BASE_URL+document.docName+"/preview";
        }else{
            return BASE_URL+document.docName;
        }
    }

    handleConfirmDelete(document){
        this.setState({ documentTarget: document, isDelete: true });
    }

    handleConfirmDeleteService(service){
        this.setState({ serviceTargetToDelete: service, isDeleteService: true });
    }

    async handleDelete(event){
        event.preventDefault();
        try{
            await APIConfig.delete(`/order/document/${this.state.documentTarget.idDoc}/delete`);
            this.loadData();
        }catch (error){
            this.setState({ isError: true });
            console.log(error);
        }
        this.setState({isDeleteSuccess: true, isDelete: false});
    }

    render() {
        const {
            name,
            isDelete,
            isError,
            isDeleteSuccess,
            isDeleteService,
            isCancelChangeService,
            isCancelToAddService,
        } = this.state;

        let { listService } = this.state;

        let { listServiceNew } = this.state;

        let { documents } = this.state; //doc order

        const tableHeaders = [
            'No', 'Nama Service', 'Aksi'
        ];

        const tableRows = listService.map((service) => [service.name,
            <div className="d-flex justify-content-center align-items-center">
            <Button className={classes.button1} onClick={() => this.changeService(service.idService)}>&nbsp;Ubah&nbsp;</Button> 
            <span>&nbsp;&nbsp;</span>
            <Button className={classes.button2} onClick={() => this.handleConfirmDeleteService(service)}>Hapus</Button>
            </div>
        ]);

        const tableHeadersDoc = ['No', 'Nama Dokumen', 'Tanggal Upload', 'Aksi']; //doc order

        const tableRowsDoc = documents.map((document) => [document.docName, this.getDate(document.uploadedDate),
                            <div className="d-flex justify-content-center align-items-center">
                            <Button className={classes.button1} href={this.getUrl(document)} target = "_blank">&nbsp;Preview&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button2} onClick={() => this.handleConfirmDelete(document)}>&nbsp;&nbsp;Hapus&nbsp;&nbsp;</Button>
                            </div>
                            ]); //doc order

        return (
            <div className={classes.container}>
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
                                    <h3 className={classes.subtitle} style={{color: "black"}}>Detail Data Project Installation</h3>
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
                                    <h3 className={classes.subtitle} style={{color: "black"}}>Detail Data Managed Service</h3>
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
                                    <h3 className={classes.subtitle} style={{color: "black"}}>Daftar Services</h3>
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
                            {/* doc order */}
                            <br></br>
                            <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <h3 className={classes.subtitle} style={{color: "black"}}>Daftar Dokumen Order</h3>
                                </div>
                            </div>
                            </div>
                            <CustomizedTables headers={tableHeadersDoc} rows={tableRowsDoc} /><br></br>
                        </div>
                        <div className="card-footer text-right">
                            <Button className={classes.button1} onClick={() => this.handleBack()}>&nbsp;Kembali&nbsp;</Button>
                        </div>
                    </div>
                </div>
            </div>

                <Modal show={this.state.isChangeService} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Body>
                    <ReactNotification />
                    <form onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center"><h5 style={{color: "black"}}>Ubah Service</h5></div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="col-sm-10">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Nama Service</label>
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
                                        <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                    </div>
                                    <div className="card-footer text-center">
                                        <Button className={classes.button1} onClick={this.handleSubmitChangeService}>Simpan</Button>
                                        <span>&nbsp;&nbsp;</span>
                                        <Button className={classes.button2} onClick={this.handleCancelSubmitService}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.finishedSubmitService} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Service Berhasil Diubah</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterSubmit()}>Kembali</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={isDeleteService} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Anda yakin menghapus service ?</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={() => this.deleteService(this.state.serviceTargetToDelete.idService)}>&nbsp;&nbsp;Hapus&nbsp;&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button2} onClick={this.handleCancel}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                {/* untuk batal mengubah */}
                <Modal show={isCancelChangeService} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;Anda yakin batal mengubah service ?</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={this.handleCancelSubmit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ya&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button2} onClick={this.noCancelChange}>&nbsp;&nbsp;Tidak&nbsp;&nbsp;</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.finishedDeleteService} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Service Berhasil Dihapus</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterDelete()}>Kembali</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.isAddService} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Body>
                    <ReactNotification />
                    <form onChange={this.handleChangeFieldService} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center"><h5 style={{color: "black"}}>Tambah Services</h5></div>
                                    <div className="card-body">
                                        <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="required" style={{color: "black"}}>Nama Services</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <ServiceList add={this.addNewRow} delete={this.clickOnDelete} listService={listServiceNew} />
                                        </tbody>
                                        </table>
                                        <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                    </div>
                                    <div className="card-footer text-center">
                                        <Button className={classes.button1} onClick={this.handleSubmitTambahService}>Simpan</Button>
                                        <span>&nbsp;&nbsp;</span>
                                        <Button className={classes.button2} onClick={this.handleCancelSubmitAddService}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.finishedSubmitAddService} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Service Berhasil Ditambahkan</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                        <Button className={classes.button1} onClick={() => this.handleAfterAdd()}>Kembali</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={isCancelToAddService} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;Anda yakin batal menambahkan service ?</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={this.handleCancelSubmit}>&nbsp;&nbsp;&nbsp;&nbsp;Ya&nbsp;&nbsp;&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button2} onClick={this.noCancelToAdd}>&nbsp;&nbsp;Tidak&nbsp;&nbsp;</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={isDelete} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Anda yakin menghapus dokumen ?</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={this.handleDelete}>&nbsp;&nbsp;Hapus&nbsp;&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button2} onClick={this.handleCancel}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={isDeleteSuccess} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                     <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dokumen Order Berhasil Dihapus</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterDelete()}>Kembali</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={isError} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                     <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Oops terjadi masalah pada server!
                            <br></br>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Harap coba beberapa saat lagi</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterError()}>Kembali</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default withRouter(DetailOrder);