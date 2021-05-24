import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import Modal from "../../components/Modal";
import { withRouter } from "react-router-dom";

class ChangeOrderPIMS extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrder: this.props.match.params.id,
            idPi: this.props.match.params.idPi,
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
            startPI: "",
            deadline:"",
            close: false,
            percentage: 0.0,
            actualStart: "",
            actualEnd: "",
            activated: false,
            orderTarget: null,
            orderPITarget: null,
            orderMSTarget: null,
            finishSubmitOrder: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmitChangeOrderPIMS = this.handleSubmitChangeOrderPIMS.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
        this.handleAfterSubmit = this.handleAfterSubmit.bind(this);
        this.handleChangeOrder = this.handleChangeOrder.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orderItem  = await APIConfig.get(`/order/detail/${this.state.idOrder}`);
            const orderPIitem = await APIConfig.get(`/order/detail/PI/${this.state.idPi}`);
            const orderMSitem = await APIConfig.get(`/order/detail/MS/${this.state.idMs}`);
            this.setState({ orderTarget: orderItem.data });
            this.setState({ orderPITarget: orderPIitem.data });
            this.setState({ orderMSTarget: orderMSitem.data });
            console.log(this.state.orderTarget);
            console.log(this.state.orderPITarget);
            console.log(this.state.orderMSTarget);
            this.handleChangeOrder();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleChangeOrder() {
        let ord = this.state.orderTarget;
        let ordPI = this.state.orderPITarget;
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
            dateOrder: ord.dateOrder,
            startPI: ordPI.startPI,
            deadline: ordPI.deadline,
            close: ordPI.close,
            percentage: ordPI.percentage,
            actualStart: ordMS.actualStart,
            actualEnd: ordMS.actualEnd,
            activated: ordMS.activated,
        })
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleCancelSubmit = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`);
    }

    handleAfterSubmit = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`);
    }

    async handleSubmitChangeOrderPIMS(event) {
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
            }
            await APIConfig.put(`/order/ubah/${this.state.idOrder}`, data);
            await APIConfig.put(`/order/ubah/PI/${this.state.idPi}`, dataPI);
            await APIConfig.put(`/order/ubah/MS/${this.state.idMs}`, dataMS);
            this.loadData();
            this.setState({ finishSubmitOrder: true });
        } catch (error) {
            alert("Order Gagal Disimpan. Coba Kembali!");
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
            actualStart,
            actualEnd,
        } = this.state;

        return (
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Ubah Order</h1>
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
                                                <label className="form-check-label">Project Installation</label>
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
                                    </div>
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
                                    </div>
                                    <div className="row">
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
                                <div className="card-footer text-right">
                                    <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitChangeOrderPIMS}>
                                        Simpan
                                    </CustomizedButtons>
                                    <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={() => this.handleCancelSubmit()}>
                                        Batal
                                    </CustomizedButtons>
                                </div> 
                            </div>
                        </div>
                    </div>
                </form>

                <Modal show={this.state.finishSubmitOrder}>
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>{`Order Berhasil Diubah`}</h2>
                        </div>
                        <div className="card-footer text-center">
                            <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={() => this.handleAfterSubmit()} >
                                Kembali
                            </CustomizedButtons>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withRouter(ChangeOrderPIMS);