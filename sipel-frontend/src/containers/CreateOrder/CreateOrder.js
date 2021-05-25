import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import Modal from "../../components/Modal";
import ServiceList from "../../components/Services/serviceList";
import { withRouter } from "react-router-dom";
import { Button } from "react-bootstrap";

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
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const listOrder  = await APIConfig.get("/orderList");
            const listOrderMS  = await APIConfig.get("/orderMS");
            this.setState({ orders: listOrder.data });
            this.setState({ orderTarget: this.state.orders[this.state.orders.length - 1] });
            this.setState({ ordersMS: listOrderMS.data });
            this.setState({ orderMSTarget: this.state.ordersMS[this.state.ordersMS.length - 1] });
            //console.log(this.state.orderTarget);
            //console.log(this.state.orderMSTarget);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
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
        this.setState({ isSubmitOrder: false, isSubmitOrderMS: false, ...initState });
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
            await APIConfig.post("/order/tambah", data);
            this.loadData();
            this.setState( { isSubmitOrder: true });
        } catch (error) {
            alert("Order Gagal Disimpan. Coba Kembali!");
            console.log(error);
        }
    }

    async handleSubmitTambahPI(event) {
        event.preventDefault();
        try {
            const data = {
                startPI: this.state.startPI,
                deadline: this.state.deadline,
                percentage: this.state.percentage,
                close: this.state.close,
            }
            await APIConfig.post(`/order/tambah/PI/${this.state.orderTarget.idOrder}`, data);
            this.loadData();
            this.setState({ finishSubmitOrder: true });
        } catch (error) {
            alert("Data Project Installation gagal disimpan! Masukkan kembali tanggal mulai dan selesai project!");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async handleSubmitTambahMS(event) {
        event.preventDefault();
        try {
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
            alert("Data Managed Service gagal disimpan! Masukkan kembali tanggal periode kontrak!");
            console.log(error);
        }
    }

    async handleSubmitTambahPIMS(event) {
        event.preventDefault();
        try {
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
            alert("Data PI dan MS gagal disimpan! Masukkan kembali tanggal serta periode mulai dan selesai!");
            console.log(error);
        }
    }

    async handleSubmitTambahService(event) {
        event.preventDefault();
        try {
            for (let i=0; i<this.state.listService.length;i++) {
                const data = {
                    name: this.state.listService[i].name,
                };
                //console.log(this.state.listService[i].name);
                await APIConfig.post(`/order/tambah/MS/${this.state.orderMSTarget.idOrderMs}/Service`, data);
                this.loadData();
                this.setState({ finishSubmitOrder: true });
            }
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
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
            dateOrder,
        } = this.state;

        let { listService } = this.state;

        return (
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Tambah Order</h1>
            <br></br>
                <form>
                    <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
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
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required">Nama Pelanggan</label>
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
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
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
                                        <div className="col-sm-6">
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
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
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
                                        <div className="col-sm-6">
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
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
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
                                        <div className="col-sm-6">
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
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label className="required">Jenis Order</label>
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
                                                    onChange={(e) => this.setState(prev => ({
                                                        managedService: !prev.managedService
                                                    }))} />
                                                <label className="form-check-label">Managed Services</label>
                                            </div>
                                        </div> 
                                        <div className="col-sm-6">
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
                                        <div className="col-sm-6">
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
                                        <div className="col-sm-6">
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
                                </div>
                                <div className="card-footer text-right">
                                    {/* <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahOrder}>
                                        Simpan
                                    </CustomizedButtons> */}
                                    <Button className={classes.button1} onClick={this.handleSubmitTambahOrder}>Simpan</Button>
                                    {/* <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={() => this.handleCancelSubmit()}>
                                        Batal
                                    </CustomizedButtons> */}
                                    <span>&nbsp;&nbsp;</span>
                                    <Button className={classes.button2} onClick={() => this.handleCancelSubmit()}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                </div> 
                            </div>
                        </div>
                    </div>
                </form>

                <Modal show={this.state.projectInstallation && !this.state.managedService && this.state.isSubmitOrder}>
                    <form onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">
                                    Tambah Data PI
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required">Tanggal Mulai Project</label>
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
                                                <label className="required">Tanggal Selesai Project</label>
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
                                    {/* <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahPI} >
                                        Simpan Data PI
                                    </CustomizedButtons> */}
                                    <Button className={classes.button1} onClick={this.handleSubmitTambahPI}>Simpan Data PI</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                </Modal>

                <Modal show={this.state.managedService && !this.state.projectInstallation && this.state.isSubmitOrder} >
                    <form onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">
                                    Tambah Data MS
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required">Periode Mulai Managed</label>
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
                                                <label className="required">Periode Selesai Managed</label>
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
                                    {/* <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahMS}>
                                        Simpan Data MS
                                    </CustomizedButtons> */}
                                    <Button className={classes.button1} onClick={this.handleSubmitTambahMS}>Simpan Data MS</Button>
                                </div>
                            </div>                                            
                        </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.isSubmitOrderMS} >
                <form onChange={this.handleChange} >
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
                                            <ServiceList add={this.addNewRow} delete={this.clickOnDelete} listService={listService} />
                                        </tbody>
                                        </table>
                                    </div>
                                    <div className="card-footer text-center">
                                        {/* <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahService}>
                                            Simpan Data Service
                                        </CustomizedButtons> */}
                                        <Button className={classes.button1} onClick={this.handleSubmitTambahService}>Simpan Data Services</Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.managedService && this.state.projectInstallation && this.state.isSubmitOrder} >
                    <form onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">
                                    Tambah Data PI-MS
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required">Tanggal Mulai Project</label>
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
                                                <label className="required">Periode Mulai Managed</label>
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
                                                <label className="required">Tanggal Selesai Project</label>
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
                                                <label className="required">Periode Selesai Managed</label>
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
                                    {/* <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahPIMS}>
                                        Simpan Data PI-MS
                                    </CustomizedButtons> */}
                                    <Button className={classes.button1} onClick={this.handleSubmitTambahPIMS}>Simpan Data PI-MS</Button>
                                </div>
                            </div>                                            
                        </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.finishSubmitOrder}>
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>{`Order Berhasil Ditambahkan`}</h2>
                        </div>
                        <div className="card-footer text-center">
                            {/* <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={() => this.handleAfterSubmit()} >
                                Kembali
                            </CustomizedButtons> */}
                            <Button className={classes.button1} onClick={() => this.handleAfterSubmit()}>Kembali</Button>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withRouter(CreateOrder);