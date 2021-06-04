import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
//import Modal from "../../components/Modal";
import ServiceList from "../../components/Services/serviceList";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";
import { store } from "react-notifications-component";
import ReactNotification from "react-notifications-component";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import authHeader from '../../services/auth-header';

const initState = {
    startPI: "",
    deadline:"",
    actualStart: "",
    actualEnd: "",
    listService: [{ index: Math.random(), name: ""}],
}

class CreateOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            listService: [{ index: Math.random(), name: ""}],
            clientName: "",
            clientDiv: "",
            clientPIC: "",
            clientOrg: "",
            clientPhone: "",
            clientEmail: "",
            dateOrder: "",
            orderTarget: null,
            verified: false,
            isSubmitOrder: false,
            isSubmitOrderMS: false,
            finishSubmitOrder: false,
            orders: [],
            ordersMS: [],
            orderMSTarget: null,
            isCancel: false,
            isError: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitTambahOrder = this.handleSubmitTambahOrder.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
        this.handleAfterSubmit = this.handleAfterSubmit.bind(this);
        this.handleSubmitTambahPI = this.handleSubmitTambahPI.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.clickOnDelete = this.clickOnDelete.bind(this);
        this.handleSubmitTambahMS = this.handleSubmitTambahMS.bind(this);
        this.handleSubmitTambahService = this.handleSubmitTambahService.bind(this);
        this.handleSubmitTambahPIMS = this.handleSubmitTambahPIMS.bind(this);
        this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleAfterError = this.handleAfterError.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const listOrder  = await APIConfig.get("/orderList");
            const listOrderMS  = await APIConfig.get("/orders/ms");
            this.setState({ orders: listOrder.data });
            this.setState({ orderTarget: this.state.orders[this.state.orders.length - 1] });
            this.setState({ ordersMS: listOrderMS.data });
            this.setState({ orderMSTarget: this.state.ordersMS[this.state.ordersMS.length - 1] });
            //console.log(this.state.orderTarget);
            //console.log(this.state.orderMSTarget);
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleChange = (e) => {
        if (["name"].includes(e.target.name)) {
            let listService = [...this.state.listService]
            listService[e.target.dataset.id][e.target.name] = e.target.value;
        }
        if (e.target.checked !== "projectInstallation" && e.target.checked !== "managedService" && !["name"].includes(e.target.name)) {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    addNewRow = () => {
        this.setState((prevState) => ({
            listService: [...prevState.listService, { index: Math.random(), name: "" }],
        }));
    }

    deleteRow = (index) => {
        this.setState({
            listService: this.state.listService.filter((s, sindex) => index !== sindex),
        });
    }

    clickOnDelete(record) {
        this.setState({
            listService: this.state.listService.filter(r => r !== record)
        });
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({ isSubmitOrder: false, isSubmitOrderMS: false, isCancel: false, ...initState });
    }

    handleBack() {
        this.setState({ isCancel: false });
    }

    handleConfirmCancel(){
        this.setState({ isCancel: true });
    }

    handleCancelSubmit = () => {
        this.props.history.push(`/order/order`);
    }

    handleAfterSubmit = () => {
        this.props.history.push(`/order/order`);
    }

    async handleSubmitTambahOrder(event) {
        event.preventDefault();
        try {
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
            /* if (this.state.dateOrder.length === 0){
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
            } */
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
                dateOrder: new Date(),
                verified: this.state.verified
            }
            await APIConfig.post("/order/tambah", data);
            this.loadData();
            this.setState( { isSubmitOrder: true });
        } catch (error) {
            this.setState({ isError: true });
            //alert("Order Gagal Disimpan. Coba Kembali!");
            console.log(error);
        }
    }

    async handleSubmitTambahPI(event) {
        event.preventDefault();
        try {
            //let dateOrd = moment(new Date(this.state.dateOrder)).format("YYYY-MM-DD");
            let dateOrd = moment(new Date()).format("YYYY-MM-DD");
            let start = moment(new Date(this.state.startPI)).format("YYYY-MM-DD");
            let end = moment(new Date(this.state.deadline)).format("YYYY-MM-DD");
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
                    width: 380
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
                    width: 380
                });
                return false;
            }
            if (start < dateOrd){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Tanggal Mulai Project tidak boleh lebih awal dari tanggal hari ini`,
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
                    width: 380
                });
                return false;
            }
            const data = {
                startPI: this.state.startPI,
                deadline: this.state.deadline,
                percentage: this.state.percentage,
                close: this.state.close,
            }
            await APIConfig.post(`/order/tambah/PI/${this.state.orderTarget.idOrder}`, data);
            this.loadData();
            this.setState({ finishSubmitOrder: true });
            this.handleCancel(event);
        } catch (error) {
            this.setState({ isError: true });
            //alert("Data Project Installation gagal disimpan! Masukkan kembali tanggal mulai dan selesai project!");
            console.log(error);
        }
        //this.handleCancel(event);
    }

    async handleSubmitTambahMS(event) {
        event.preventDefault();
        try {
            //let dateOrd = moment(new Date(this.state.dateOrder)).format("YYYY-MM-DD");
            let dateOrd = moment(new Date()).format("YYYY-MM-DD");
            let startDate = moment(new Date(this.state.actualStart)).format("YYYY-MM-DD");
            let endDate = moment(new Date(this.state.actualEnd)).format("YYYY-MM-DD");
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
                    width: 380
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
                    width: 380
                });
                return false;
            }
            if (startDate < dateOrd){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Periode Mulai Managed tidak boleh lebih awal dari tanggal hari ini`,
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
                    width: 380
                });
                return false;
            }
            const data = {
                actualStart: this.state.actualStart,
                actualEnd: this.state.actualEnd,
                activated: this.state.activated,
            };
            await APIConfig.post(`/order/tambah/MS/${this.state.orderTarget.idOrder}`, data);
            this.loadData();
            this.setState({ isSubmitOrderMS: true});
            this.setState({ isSubmitOrder: false });
        } catch (error) {
            this.setState({ isError: true });
            //alert("Data Managed Service gagal disimpan! Masukkan kembali tanggal periode kontrak!");
            console.log(error);
        }
    }

    async handleSubmitTambahPIMS(event) {
        event.preventDefault();
        try {
            //let dateOrd = moment(new Date(this.state.dateOrder)).format("YYYY-MM-DD");
            let dateOrd = moment(new Date()).format("YYYY-MM-DD");
            let start = moment(new Date(this.state.startPI)).format("YYYY-MM-DD");
            let end = moment(new Date(this.state.deadline)).format("YYYY-MM-DD");
            let startDate = moment(new Date(this.state.actualStart)).format("YYYY-MM-DD");
            let endDate = moment(new Date(this.state.actualEnd)).format("YYYY-MM-DD");
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
                    width: 380
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
                    width: 380
                });
                return false;
            }
            if (start < dateOrd){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Tanggal Mulai Project tidak boleh lebih awal dari tanggal hari ini`,
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
                    width: 380
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
                    width: 380
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
                    width: 380
                });
                return false;
            }
            if (startDate < dateOrd){
                store.addNotification({
                    title: "Peringatan!",
                    message: `Periode Mulai Managed tidak boleh lebih awal dari tanggal hari ini`,
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
                    width: 380
                });
                return false;
            }
            const dataPI = {
                startPI: this.state.startPI,
                deadline: this.state.deadline,
                percentage: this.state.percentage,
                close: this.state.close,
            }
            const dataMS = {
                actualStart: this.state.actualStart,
                actualEnd: this.state.actualEnd,
                activated: this.state.activated,
            };
            await APIConfig.post(`/order/tambah/PI/${this.state.orderTarget.idOrder}`, dataPI);
            await APIConfig.post(`/order/tambah/MS/${this.state.orderTarget.idOrder}`, dataMS);
            this.loadData();
            this.setState({ isSubmitOrderMS: true});
            this.setState({ isSubmitOrder: false });
        } catch (error) {
            this.setState({ isError: true });
            //alert("Data PI dan MS gagal disimpan! Masukkan kembali tanggal serta periode mulai dan selesai!");
            console.log(error);
        }
    }

    async handleSubmitTambahService(event) {
        event.preventDefault();
        try {
            for (let i=0; i<this.state.listService.length;i++) {
                if (this.state.listService[i].name === "" || this.state.listService[i].name === null) {
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
            for (let i=0; i<this.state.listService.length;i++) {
                const data = {
                    name: this.state.listService[i].name,
                };
                await APIConfig.post(`/ms/${this.state.orderMSTarget.idOrderMs}/createService`, data, { headers: authHeader() });
                this.loadData();
                this.setState({ finishSubmitOrder: true });
            }
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    handleAfterError = () => {
        this.props.history.push(`/order/order`, { headers: authHeader() });
        this.setState({ isError: false });
    }

    render() {
        const { 
            noPO,
            noSPH,
            orderName,
            description,
            projectInstallation,
            managedService,
            startPI,
            deadline,
            actualStart,
            actualEnd,
            clientName,
            clientDiv,
            clientPIC,
            clientOrg,
            clientPhone,
            clientEmail,
            isCancel,
            isError
        } = this.state;

        let { listService } = this.state;

        return (
            <div className={classes.container}>
            <br></br>
            <h1 className={classes.title}>Tambah Order</h1>
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
                                                <input
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
                                                <input 
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
                                                {/* <label className="required" style={{color: "black"}}>Tanggal Masuk Order</label>
                                                <input 
                                                    type="date" 
                                                    name="dateOrder" 
                                                    id="dateOrder" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Masuk Order"
                                                    defaultValue={dateToday} 
                                                    value={dateOrder} 
                                                    onChange={this.handleChange} /> */}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group" style={{color: "black"}}>
                                                <label>Nomor Telepon Pelanggan</label>
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
                                    <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                </div>
                                <div className="card-footer text-right">
                                    <Button className={classes.button1} onClick={this.handleSubmitTambahOrder}>Simpan</Button>
                                    <span>&nbsp;&nbsp;</span>
                                    <Button className={classes.button2} onClick={() => this.handleConfirmCancel()}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                </div> 
                            </div>
                        </div>
                    </div>
                </form>

                <Modal show={this.state.projectInstallation && !this.state.managedService && this.state.isSubmitOrder} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <form onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header text-center" style={{color: "black"}}>
                                    <h5 style={{color: "black"}} >Tambah Data PI</h5>
                                </div>
                                <div className="card-body">
                                <ReactNotification />
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
                                <div className="card-footer text-center">
                                    <Button className={classes.button1} onClick={this.handleSubmitTambahPI}>Simpan Data PI</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </form>
                </Modal>

                <Modal show={this.state.managedService && !this.state.projectInstallation && this.state.isSubmitOrder} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <form onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header text-center">
                                    <h5 style={{color: "black"}}>Tambah Data MS</h5>
                                </div>
                                <div className="card-body">
                                <ReactNotification />
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
                                <div className="card-footer text-center">
                                    <Button className={classes.button1} onClick={this.handleSubmitTambahMS}>Simpan Data MS</Button>
                                </div>
                            </div>                                            
                        </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.isSubmitOrderMS} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                <form onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center"><h5 style={{color: "black"}}>Tambah Services</h5></div>
                                    <div className="card-body">
                                    <ReactNotification />
                                        <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="required" style={{color: "black"}}>Nama Services</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <ServiceList add={this.addNewRow} delete={this.clickOnDelete} listService={listService} />
                                        </tbody>
                                        </table>
                                        <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                    </div>
                                    <div className="card-footer text-center">
                                        <Button className={classes.button1} onClick={this.handleSubmitTambahService}>Simpan Data Services</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.managedService && this.state.projectInstallation && this.state.isSubmitOrder} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <form onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-12">
                            <div className="card">
                                <div className="card-header text-center">
                                    <h5 style={{color: "black"}}>Tambah Data PI-MS</h5>
                                </div>
                                <div className="card-body">
                                <ReactNotification />
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
                                <div className="card-footer text-center">
                                    <Button className={classes.button1} onClick={this.handleSubmitTambahPIMS}>Simpan Data PI-MS</Button>
                                </div>
                            </div>                                            
                        </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.finishSubmitOrder} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                Order Berhasil Ditambahkan</h4>
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
                        <Button className={classes.button1} onClick={() => this.handleAfterError()}>Kembali</Button>
                    </div>
                </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default withRouter(CreateOrder);