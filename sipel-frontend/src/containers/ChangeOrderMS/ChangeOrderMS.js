import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
//import Modal from "../../components/Modal";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import { store } from "react-notifications-component";
import ReactNotification from "react-notifications-component";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import authHeader from '../../services/auth-header';

class ChangeOrderMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrder: this.props.match.params.id,
            idMs: this.props.match.params.idMs,
            noPO: "",
            noSPH: "",
            orderName: "",
            description: "",
            projectInstallation: false,
            managedService: false,
            clientName: "",
            clientDiv: "",
            clientPIC: "",
            clientOrg: "",
            clientPhone: "",
            clientEmail: "",
            dateOrder: "",
            actualStart: "",
            actualEnd: "",
            activated: false,
            orderTarget: null,
            orderMSTarget: null,
            finishSubmitOrder: false,
            isCancel: false,
            isError: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitChangeOrderMS = this.handleSubmitChangeOrderMS.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
        this.handleAfterSubmit = this.handleAfterSubmit.bind(this);
        this.handleChangeOrder = this.handleChangeOrder.bind(this);
        this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleAfterError = this.handleAfterError.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orderItem  = await APIConfig.get(`/order/detail/${this.state.idOrder}`, { headers: authHeader() });
            const orderMSitem = await APIConfig.get(`/order/detail/MS/${this.state.idMs}`, { headers: authHeader() });
            this.setState({ orderTarget: orderItem.data });
            this.setState({ orderMSTarget: orderMSitem.data });
            this.handleChangeOrder();
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleChangeOrder() {
        let ord = this.state.orderTarget;
        let ordMS = this.state.orderMSTarget;
        this.setState({
            noPO: ord.noPO,
            noSPH: ord.noSPH,
            orderName: ord.orderName,
            description: ord.description,
            projectInstallation: ord.projectInstallation,
            managedService: ord.managedService,
            clientName: ord.clientName,
            clientDiv: ord.clientDiv,
            clientPIC: ord.clientPIC,
            clientOrg: ord.clientOrg,
            clientPhone: ord.clientPhone,
            clientEmail: ord.clientEmail,
            dateOrder: moment(new Date(ord.dateOrder)).format("YYYY-MM-DD"),
            actualStart: moment(new Date(ordMS.actualStart)).format("YYYY-MM-DD"),
            actualEnd: moment(new Date(ordMS.actualEnd)).format("YYYY-MM-DD"),
            activated: ordMS.activated,
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleConfirmCancel(){
        this.setState({ isCancel: true });
    }

    handleCancelSubmit = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`, { headers: authHeader() });
    }

    handleBack() {
        this.setState({ isCancel: false });
    }

    handleAfterSubmit = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`, { headers: authHeader() });
    }

    handleAfterError = () => {
        this.props.history.push(`/order/order`, { headers: authHeader() });
        this.setState({ isError: false });
    }

    async handleSubmitChangeOrderMS(event) {
        event.preventDefault();
        try {
            let dateOrd = moment(new Date(this.state.dateOrder)).format("YYYY-MM-DD");
            let startDate = moment(new Date(this.state.actualStart)).format("YYYY-MM-DD");
            let endDate = moment(new Date(this.state.actualEnd)).format("YYYY-MM-DD");
            if (this.state.clientName === ""){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Nama Pelanggan`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (this.state.orderName === ""){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Nama Order`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (this.state.clientPIC === ""){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field PIC Pelanggan`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (this.state.description === ""){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Deskripsi Order`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (this.state.clientOrg === ""){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Perusahaan Pelanggan`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (this.state.clientEmail === ""){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Email Pelanggan`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (this.state.dateOrder.length === 0){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Tanggal Order Masuk`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (startDate > endDate){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Periode Selesai Managed tidak boleh lebih awal dari Periode Mulai Managed`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (this.state.actualStart.length === 0){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Periode Mulai Managed`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (startDate < dateOrd){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Periode Mulai Managed tidak boleh lebih awal dari Tanggal Order Masuk`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            if (this.state.actualEnd.length === 0){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Periode Selesai Managed`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 500
                });
                return false;
            }
            const data = {
                noPO: this.state.noPO,
                noSPH: this.state.noSPH,
                orderName: this.state.orderName,
                description: this.state.description,
                projectInstallation: this.state.projectInstallation,
                managedService: this.state.managedService,
                clientName: this.state.clientName,
                clientDiv: this.state.clientDiv,
                clientPIC: this.state.clientPIC,
                clientOrg: this.state.clientOrg,
                clientPhone: this.state.clientPhone,
                clientEmail: this.state.clientEmail,
                dateOrder: this.state.dateOrder,
                verified: this.state.verified
            }
            const dataMS = {
                actualStart: this.state.actualStart,
                actualEnd: this.state.actualEnd,
                activated: this.state.activated,
            }
            await APIConfig.put(`/order/ubah/${this.state.idOrder}`, data, { headers: authHeader() });
            await APIConfig.put(`/order/ubah/MS/${this.state.idMs}`, dataMS, { headers: authHeader() });
            this.loadData();
            this.setState({ finishSubmitOrder: true });
        } catch (error) {
            this.setState({ isError: true });
            console.log(error);
        }
    }

    render() {
        const { 
            noPO,
            noSPH,
            orderName,
            description,
            projectInstallation,
            managedService,
            clientName,
            clientDiv,
            clientPIC,
            clientOrg,
            clientPhone,
            clientEmail,
            dateOrder,
            actualStart,
            actualEnd,
            isCancel,
            isError
        } = this.state;

        return (
            <div className={classes.container}>
            <br></br>
            <h1 className={classes.title}>Ubah Order</h1>
            <br></br>
                <form>
                    <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-body">
                                    <ReactNotification />
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label style={{color: "black"}}>Nomor PO</label>
                                                <input 
                                                    type="text" 
                                                    name="noPO" 
                                                    id="noPO" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nomor PO" 
                                                    value={noPO} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Nama Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientName" 
                                                    id="clientName" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nama Pelanggan" 
                                                    value={clientName} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label style={{color: "black"}}>Nomor SPH</label>
                                                <input 
                                                    type="text"  
                                                    name="noSPH" 
                                                    id="noSPH" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nomor SPH" 
                                                    value={noSPH} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label style={{color: "black"}}>Divisi Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientDiv" 
                                                    id="clientDiv" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Divisi Pelanggan" 
                                                    value={clientDiv} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Nama Order</label>
                                                <input 
                                                    type="text"  
                                                    name="orderName" 
                                                    id="orderName" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nama Order" 
                                                    value={orderName} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>PIC Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientPIC" 
                                                    id="clientPIC" 
                                                    className="form-control" 
                                                    placeholder="Masukkan PIC Pelanggan" 
                                                    value={clientPIC} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Deskripsi Order</label>
                                                <input 
                                                    type="text"  
                                                    name="description" 
                                                    id="description" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Deskripsi Order" 
                                                    value={description} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Perusahaan Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientOrg" 
                                                    id="clientOrg" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Perusahaan Pelanggan" 
                                                    value={clientOrg} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label className="required" style={{color: "black"}}>Jenis Order</label>
                                            <div className="form-check"> 
                                                <input disabled
                                                    type="checkbox" 
                                                    name="projectInstallation" 
                                                    id="projectInstallation" 
                                                    className="form-check-input" 
                                                    value={projectInstallation}
                                                    checked={projectInstallation} 
                                                    onChange={(e) => this.setState(prevState => ({
                                                        projectInstallation: !prevState.projectInstallation
                                                    }))} /> 
                                                <label className="form-check-label" style={{color: "black"}}>Project Installation</label>
                                            </div>
                                            <div className="form-check">
                                                <input disabled
                                                    type="checkbox" 
                                                    name="managedService" 
                                                    id="managedService" 
                                                    className="form-check-input"
                                                    value={managedService}  
                                                    checked={managedService} 
                                                    onChange={(e) => this.setState(prev => ({
                                                        managedService: !prev.managedService
                                                    }))} />
                                                <label className="form-check-label" style={{color: "black"}}>Managed Services</label>
                                            </div>
                                        </div> 
                                        <div className="col-sm-6">
                                            <div className="form-group ">
                                                <label className="required" style={{color: "black"}}>Email Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientEmail" 
                                                    id="clientEmail" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Email Pelanggan" 
                                                    value={clientEmail} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Tanggal Masuk Order</label>
                                                <input disabled
                                                    type="date" 
                                                    name="dateOrder" 
                                                    id="dateOrder" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Masuk Order" 
                                                    value={dateOrder} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label style={{color: "black"}}>Nomor Telepon Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientPhone" 
                                                    id="clientPhone" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nomor Telepon" 
                                                    value={clientPhone} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Periode Mulai Managed</label>
                                                <input 
                                                    type="date" 
                                                    name="actualStart" 
                                                    id="actualStart" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Periode Mulai" 
                                                    value={actualStart} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Periode Selesai Managed</label>
                                                <input 
                                                    type="date" 
                                                    name="actualEnd" 
                                                    id="actualEnd" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Periode Selesai" 
                                                    value={actualEnd} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                </div>
                                <div className="card-footer text-right">
                                    <Button className={classes.button1} onClick={this.handleSubmitChangeOrderMS}>Simpan</Button>
                                    <span>&nbsp;&nbsp;</span>
                                    <Button className={classes.button2} onClick={() => this.handleConfirmCancel()}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                </div> 
                            </div>
                        </div>
                    </div>
                </form>

                <Modal show={this.state.finishSubmitOrder} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                Order Berhasil Diubah</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterSubmit()}>Kembali</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={isCancel} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Anda yakin batal menyimpan order ?</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={() => this.handleCancelSubmit()}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ya&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button2} onClick={() => this.handleBack()}>&nbsp;&nbsp;Tidak&nbsp;&nbsp;</Button>
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
                        <Button className={classes.button2} onClick={() => this.handleAfterError()}>Kembali</Button>
                    </div>
                </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default withRouter(ChangeOrderMS);
