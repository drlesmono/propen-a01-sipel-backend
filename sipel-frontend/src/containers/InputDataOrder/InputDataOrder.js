import React from "react";
import ServiceList from "../../components/Services/serviceList";
import Order from "../../components/Order/orderDetail";
import ProjectInstallation from "../../components/ProjectInstallation/piDetail";
import ManagedService from "../../components/ManagedService/msDetail";
import Service from "../../components/Services/serviceDetail";
import axios from 'axios';
import APIConfig from "../../APIConfig";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
import Modal from "../../components/Modal";
import classes from "./styles.module.css";
import Checkbox from "@material-ui/core/Checkbox";
import { getByDisplayValue } from "@testing-library/dom";

const initState = {
    noPO: "",
    noSPH: "",
    orderName: "",
    description: "",
    projectInstallation: "",
    managedService: "",
    startPI: "",
    deadline: "",
    actualStart: "",
    actualEnd: "",
    listService: [{ index: Math.random(), name: ""}],
    clientName: "",
    clientDiv: "",
    clientPIC: "",
    clientOrg: "",
    clientPhone: "",
    clientEmail: "",
    dateOrder: "",
    verified: "",
    orders: [],
    isLoading:false,
    isCreate: false,
    isEdit: false,
    orderTarget: null,
    isSubmit: false,
    isSubmitPeriode: false,
}

class InputDataOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noPO: "",
            noSPH: "",
            orderName: "",
            description: "",
            projectInstallation: "",
            managedService: "",
            startPI: "",
            deadline: "",
            actualStart: "",
            actualEnd: "",
            listService: [{ idService: "", name: "", idOrderMs: null }],
            clientName: "",
            clientDiv: "",
            clientPIC: "",
            clientOrg: "",
            clientPhone: "",
            clientEmail: "",
            dateOrder: "",
            verified: false,
            orders: [],
            isLoading:false,
            isCreate: false,
            isEdit: false,
            orderTarget: null,
            isSubmit: false,
            isSubmitPeriode: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTambahOrder = this.handleTambahOrder.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.handleSubmitTambahOrder = this.handleSubmitTambahOrder.bind(this);
        this.clickOnDelete = this.clickOnDelete.bind(this);
        this.handleSubmitTambahPI = this.handleSubmitTambahPI.bind(this);
        this.handleSubmitTambahMS = this.handleSubmitTambahMS.bind(this);
        this.handleSubmitTambahService = this.handleSubmitTambahService.bind(this);
    }
  
    handleChange = (e) => {
        if (e.target.type === "checkbox") {
            if (["projectInstallation"].includes(e.target.checked)) {
                this.setState({ projectInstallation: "true" });
            }
            if (["managedService"].includes(e.target.checked)) {
                this.setState({ managedService: "true" });
            }
        }
        /* if (e.target.checked === "projectInstallation") {
            this.setState({ projectInstallation: "true" });
            console.log(e);
        }
        if (e.target.checked === "managedService") {
            this.setState({ managedService: "true" });
            console.log(e);
        } */
        if (["name"].includes(e.target.name)) {
            let listService = [...this.state.listService]
            listService[e.target.dataset.id][e.target.name] = e.target.value;
        }
        if (e.target.checked !== "projectInstallation" && e.target.checked !== "managedService" && !["name"].includes(e.target.name)) {
            this.setState({ [e.target.name]: e.target.value });
        }
        //const { currentTarget: input } = e;
        //let val = { ...this.state };
        //input.type === "checkbox"
        //    ?   (val[input.name] = input.checked)
        //    :   (val[input.name] = input.value);
        //this.setState(val);
    }

    handleCheckbox = (e) => {
        const { name, value, checked } = e.target;
        const previousState = this.state[name] || {};
        this.setState({ [name]: { ...previousState, [value]: checked }});
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

    /* handleSubmit = (e) => {
        e.preventDefault();
        let data = { formData: this.state }
        axios.post ("http://localhost:2020/api/v1/order/tambah", data).then(res => {
            if (res.data.success) NotificationManager.success(res.data.msg);
        }).catch (error => {
            if (error.response.status && error.response.status===400)
            NotificationManager.error("Bad Request");
            else NotificationManager.error("Something Went Wrong");
            this.setState({ errors: error });
        });
    } */

    handleTambahOrder() {
        this.setState({ isCreate: true });
    }

    /* handleEditOrder(order, projectInstallation, managedService) {
        this.setState({
            isEdit: true,
            noPO: order.noPO,
            noSPH: order.noSPH,
            orderName: order.orderName,
            description: order.description,
            isProjectInstallation: order.isProjectInstallation,
            isManagedServices: order.isManagedServices,
            startPI: projectInstallation.startPI,
            deadline: projectInstallation.deadline,
            actualStart: managedService.actualStart,
            actualEnd: managedService.actualEnd,
            listService: managedService.listService,
            clientName: order.className,
            clientDiv: order.clientDiv,
            clientPIC: order.clientPIC,
            clientOrg: order.clientOrg,
            clientPhone: order.clientPhone,
            clientEmail: order.clientEmail,
        });
    } */

    handleCancel(event) {
        event.preventDefault();
        this.setState({ isCreate: false, isEdit: false , ...initState });
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const { data } = await APIConfig.get("/order");
            this.setState({ orders: data });
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    async handleSubmitTambahOrder(event) {
        event.preventDefault();
        try {
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
            };
            await APIConfig.post("/order/tambah", data);
            this.setState({ isSubmit: true });
            this.loadData();
            console.log(event.target.value);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async handleSubmitTambahPI(event) {
        event.preventDefault();
        try {
            const order = this.state.orderTarget;
            const data = {
                idOrder: order,
                startPI: this.state.startPI,
                deadline: this.state.deadline
            };
            await APIConfig.post("/order/tambah/PI", data);
            this.loadData();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async handleSubmitTambahMS(event) {
        event.preventDefault();
        try {
            const order = this.state.orderTarget;
            const data = {
                idOrder: order,
                actualStart: this.state.actualStart,
                actualEnd: this.state.actualEnd
            };
            await APIConfig.post("/order/tambah/MS", data);
            this.loadData();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async handleSubmitTambahService(event) {
        event.preventDefault();
        try {
            for (let i=0; i<this.state.listService.length;i++) {
                const order = this.state.orderTarget.idOrderMs;
                const data = {
                    idOrderMs: order,
                    name: this.state.name,
                };
                await APIConfig.post("/order/tambah/Service", data);
                this.loadData();
            }
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
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

    checkStatusOrder(verif){
        if(verif === true){
            return "Verified";
        }else {
            return "Not Verified";
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
            startPI,
            deadline,
            actualStart,
            actualEnd,
            listServices,
            clientName,
            clientDiv,
            clientPIC,
            clientOrg,
            clientPhone,
            clientEmail,
            dateOrder,
            verified,
            orders
        } = this.state;

        let { listService } = this.state;
        const tableHeaders = [
            'No',
            'Id Order', 
            'Nomor PO', 
            'Nama Order', 
            'Nama Pelanggan', 
            'Perusahaan Pelanggan',
            'Jenis', 
            'Status', 
            'Aksi' 
        ];                  
        
        const tableRows = this.state.orders.map((order) => 
                        [order.idOrder, order.noPO, order.orderName, order.clientName, order.clientOrg,
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.checkStatusOrder(order.verified),
                        <CustomizedButtons 
                            variant="contained" 
                            size="medium" 
                            color="#FD693E" 
                            onClick={() => this.handleEditOrder(order)}>Ubah</CustomizedButtons>]);

        return (
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Daftar Order</h1>
            <br></br>
            <CustomizedButtons
                variant="contained"
                size="medium"
                color="#FD693E"
                onClick={this.handleTambahOrder}>Tambah Order</CustomizedButtons>
            <br></br>
            <CustomizedTables headers={tableHeaders} rows={tableRows} />
            <Modal show={this.state.isCreate || this.state.isEdit} handleCloseModal={this.handleCancel}>
            <NotificationContainer />
                <form onSubmit={this.handleSubmitTambahOrder} onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">
                                    {this.state.isCreate ? "Tambah Order" : `Ubah Order Name ${this.state.orderName}`}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Nomor PO</label>
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
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Nama Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientName" 
                                                    id="clientName" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nama" 
                                                    value={clientName} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>No.Telp Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientPhone" 
                                                    id="clientPhone" 
                                                    className="form-control" 
                                                    placeholder="Masukkan No.Telp" 
                                                    value={clientPhone} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Nomor SPH</label>
                                                <input 
                                                    type="text"  
                                                    name="noSPH" 
                                                    id="noSPH" 
                                                    className="form-control" 
                                                    placeholder="Masukkan No.SPH" 
                                                    value={noSPH} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Divisi Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientDiv" 
                                                    id="clientDiv" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Divisi" 
                                                    value={clientDiv} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group ">
                                                <label className="required">Email Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientEmail" 
                                                    id="clientEmail" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Email" 
                                                    value={clientEmail} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Nama Order</label>
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
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">PIC Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientPIC" 
                                                    id="clientPIC" 
                                                    className="form-control" 
                                                    placeholder="Masukkan PIC" 
                                                    value={clientPIC} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="required">Jenis Order</label>
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    name="projectInstallation" 
                                                    id="projectInstallation" 
                                                    className="form-check-input" 
                                                    value={projectInstallation}
                                                    checked={projectInstallation} 
                                                    onClick={this.handleChange} />
                                                <label className="form-check-label">Project Installation</label>
                                            </div>
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    name="managedService" 
                                                    id="managedService" 
                                                    className="form-check-input"
                                                    value={managedService}  
                                                    checked={managedService} 
                                                    onClick={this.handleChange} />
                                                <label className="form-check-label">Managed Services</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Deskripsi Order</label>
                                                <input 
                                                    type="text"  
                                                    name="description" 
                                                    id="description" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Deskripsi" 
                                                    value={description} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Perusahaan Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientOrg" 
                                                    id="clientOrg" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Perusahaan" 
                                                    value={clientOrg} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Tanggal Masuk Order</label>
                                                <input 
                                                    type="date" 
                                                    name="dateOrder" 
                                                    id="dateOrder" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Order" 
                                                    value={dateOrder} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahOrder}>
                                        Simpan Order
                                    </CustomizedButtons>
                                </div> 
                            </div>
                        </div>
                    </div>
                </form> 
            </Modal>
        
            <Modal show={this.state.managedService && this.state.isSubmit} handleCloseModal={this.handleCancel}>
                    <NotificationContainer />
                    <form onSubmit={this.handleSubmitTambahPI} onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">
                                    {this.state.isCreate ? "Tambah Data PI" : `Ubah Data Order PI ${this.state.orderName}`}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Tanggal Mulai Project</label>
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
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Tanggal Selesai Project</label>
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
                                </div>
                                <div className="card-footer text-center">
                                    <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahPI}>
                                        Simpan Data PI
                                    </CustomizedButtons>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
            <Modal show={this.state.managedService && this.state.isSubmit} handleCloseModal={this.handleCancel}>
                <NotificationContainer />
                <form onSubmit={this.handleSubmitTambahMS} onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header text-center">
                                {this.state.isCreate ? "Tambah Data MS" : `Ubah Data Order MS ${this.state.orderName}`}
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-sm-4">
                                        <div className="form-group">
                                            <label>Periode Mulai Managed Service</label>
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
                                <div className="col-sm-4">
                                    <div className="form-group">
                                        <label>Periode Selesai Managed Service</label>
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
                        </div>
                        <div className="card-footer text-center">
                            <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahMS}>
                                Simpan Data MS
                            </CustomizedButtons>
                        </div>
                        </div>                                            
                    </div>
                    </div>
                </form>
            </Modal>
                <Modal show={this.state.managedService && this.state.actualStart.length !== 0} handleCloseModal={this.handleCancel}>
                   <NotificationContainer />
                    <form onSubmit={this.handleSubmitTambahService} onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 20 }}>
                            <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center">Tambah Services</div>
                                    <div className="card-body">
                                        <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Nama Services</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <ServiceList add={this.addNewRow} delete={this.clickOnDelete} listService={listService} />
                                        </tbody>
                                        <tfoot>
                                            <tr><td colSpan="4">
                                                <button onClick={this.addNewRow} type="button" className="btn btn-primary text-center">
                                                    <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                </button>
                                            </td></tr>
                                        </tfoot>
                                        </table>
                                    </div>
                                    <div className="card-footer text-center">
                                        <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahService}>
                                            Simpan Data Service
                                        </CustomizedButtons>
                                    </div>
                                </div>
                            </div>
                            </div>
                    </form>
                </Modal>
            </div>      
                                
        );
    }
}      

export default InputDataOrder;