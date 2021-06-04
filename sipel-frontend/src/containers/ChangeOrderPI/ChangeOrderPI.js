import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import { store } from "react-notifications-component";
import ReactNotification from "react-notifications-component";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import authHeader from '../../services/auth-header';

class ChangeOrderPI extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrder: this.props.match.params.id,
            idPi: this.props.match.params.idPi,
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
            startPI: "",
            deadline:"",
            close: false,
            percentage: 0.0,
            orderTarget: null,
            orderPITarget: null,
            finishSubmitOrder: false,
            isCancel: false,
            isError: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitChangeOrderPI = this.handleSubmitChangeOrderPI.bind(this);
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
            const orderPIitem = await APIConfig.get(`/order/detail/PI/${this.state.idPi}`, { headers: authHeader() });
            this.setState({ orderTarget: orderItem.data });
            this.setState({ orderPITarget: orderPIitem.data });
            this.handleChangeOrder();
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleChangeOrder() {
        let ord = this.state.orderTarget;
        let ordPI = this.state.orderPITarget;
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
            startPI: moment(new Date(ordPI.startPI)).format("YYYY-MM-DD"),
            deadline: moment(new Date(ordPI.deadline)).format("YYYY-MM-DD"),
            close: ordPI.close,
            percentage: ordPI.percentage,
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

    async handleSubmitChangeOrderPI(event) {
        event.preventDefault();
        try {
            let dateOrd = moment(new Date(this.state.dateOrder)).format("YYYY-MM-DD");
            let start = moment(new Date(this.state.startPI)).format("YYYY-MM-DD");
            let end = moment(new Date(this.state.deadline)).format("YYYY-MM-DD");
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
            if (start > end){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Tanggal Selesai Project tidak boleh lebih awal dari Tanggal Mulai Project`,
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
            if (this.state.startPI.length === 0){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Tanggal Mulai Project`,
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
            if (start < dateOrd){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Tanggal Mulai Project tidak boleh lebih awal dari Tanggal Order Masuk`,
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
            if (this.state.deadline.length === 0){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib mengisi field Tanggal Selesai Project`,
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
            const dataPI = {
                startPI: this.state.startPI,
                deadline: this.state.deadline,
                percentage: this.state.percentage,
                close: this.state.close,
            }
            await APIConfig.put(`/order/ubah/${this.state.idOrder}`, data, { headers: authHeader() });
            await APIConfig.put(`/order/ubah/PI/${this.state.idPi}`, dataPI, { headers: authHeader() });
            this.loadData();
            this.setState({ finishSubmitOrder: true });
        } catch (error) {
            this.setState({ isError: true });
            //alert("Order Gagal Disimpan. Coba Kembali!");
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
            startPI,
            deadline,
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
                                                    placeholder="Masukkan Nomor Telepon Pelanggan" 
                                                    value={clientPhone} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Tanggal Mulai Project</label>
                                                <input 
                                                    type="date" 
                                                    name="startPI" 
                                                    id="startPI" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Mulai" 
                                                    value={startPI} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Tanggal Selesai Project</label>
                                                <input 
                                                    type="date" 
                                                    name="deadline" 
                                                    id="deadline" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Selesai" 
                                                    value={deadline} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                </div>
                                <div className="card-footer text-right">
                                    <Button className={classes.button1} onClick={this.handleSubmitChangeOrderPI}>Simpan</Button>
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

export default withRouter(ChangeOrderPI);