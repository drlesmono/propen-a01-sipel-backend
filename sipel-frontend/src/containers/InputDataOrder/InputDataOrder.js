import React from "react";
import ServiceList from "../../components/Services/serviceList";
import Order from "../../components/Order/orderDetail";
import ProjectInstallation from "../../components/ProjectInstallation/piDetail";
import ManagedService from "../../components/ManagedService/msDetail";
import axios from 'axios';
import { NotificationContainer, NotificationManager } from 'react-notifications';

const initState = {
    noPO: "",
    noSPH: "",
    orderName: "",
    description: "",
    isProjectInstallation: null,
    isManagedServices: null,
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
}

class InputDataOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noPO: "",
            noSPH: "",
            orderName: "",
            description: "",
            isProjectInstallation: null,
            isManagedServices: null,
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
            orders: [],
            isLoading:false,
            isCreate: false,
            isEdit: false,
            orderTarget: null,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEditOrder = this.handleEditOrder(this);
        this.handleCancel = this.handleCancel(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.clickOnDelete = this.clickOnDelete.bind(this);
    }
  
    handleChange = (e) => {
        if (["name"].includes(e.target.name)) {
            let listService = [...this.state.listService]
            listService[e.target.dataset.id][e.target.name] = e.target.value;
        } else {
            this.setState({ [e.target.name]: e.target.value })
        }
        const { currentTarget: input } = e;
        let val = { ...this.state };
        input.type === "checkbox"
            ?   (val[input.name] = input.checked)
            :   (val[input.name] = input.value);
        this.setState(val);
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

    handleSubmit = (e) => {
        e.preventDefault();
        let data = { formData: this.state }
        axios.post ("http://localhost:3000/api/v1", data).then(res => {
            if (res.data.success) NotificationManager.success(res.data.msg);
        }).catch (error => {
            if (error.response.status && error.response.status===400)
            NotificationManager.error("Bad Request");
            else NotificationManager.error("Something Went Wrong");
            this.setState({ errors: error });
        });
    }

    handleTambahOrder() {
        this.setState({ isCreate: true });
    }

    handleEditOrder(order, projectInstallation, managedService) {
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
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({ isCreate: false, isEdit: false , ...initState });
    }

    render() {
        
        let {
            noPO,
            noSPH,
            orderName,
            description,
            isProjectInstallation,
            isManagedServices,
            startPI,
            deadline,
            actualStart,
            actualEnd,
            listService,
            clientName,
            clientDiv,
            clientPIC,
            clientOrg,
            clientPhone,
            clientEmail,
        } = this.state

        return (
            <div className="content">
                <NotificationContainer/>
                <form onSubmit={this.handleSubmit} onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">Tambah Order</div>
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
                                                <label className="required">Nama Pelanggan</label>
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
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Nomor SPH</label>
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
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Divisi Pelanggan</label>
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
                                                    placeholder="Masukkan PIC Pelanggan" 
                                                    value={clientPIC} 
                                                    onChange={this.handleChange} />
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
                                                    placeholder="Masukkan Deskripsi Order" 
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
                                                    placeholder="Masukkan Perusahaan Pelanggan" 
                                                    value={clientOrg} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <label className="required">Jenis Order</label>
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    name="isProjectInstallation" 
                                                    id="isProjectInstallation" 
                                                    className="form-check-input" 
                                                    value={isProjectInstallation} 
                                                    checked={isProjectInstallation} 
                                                    onChange={this.handleChange} />
                                                <label className="form-check-label">Project Installation</label>
                                            </div>
                                            <div className="form-check">
                                                <input 
                                                    type="checkbox" 
                                                    name="isManagedServices" 
                                                    id="isManagedServices" 
                                                    className="form-check-input" 
                                                    value={isManagedServices} 
                                                    checked={isManagedServices} 
                                                    onChange={this.handleChange} />
                                                <label className="form-check-label">Managed Services</label>
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group ">
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
                                        <div className="col-sm-4">
                                            <div className="form-group ">
                                                <label className="required">Email Pelanggan</label>
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
                                <div className="card-header text-center">Services</div>
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
                                    <button type="submit" className="btn btn-primary text-center">Submit</button>
                                </div>
                            </div>
                        </div>
                        <div className="col-sm-1"></div>
                    </div>
                </form>
            </div>
        );
    }
}

export default InputDataOrder;