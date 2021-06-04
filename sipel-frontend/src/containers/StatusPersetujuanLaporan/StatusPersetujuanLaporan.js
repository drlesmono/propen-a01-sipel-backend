import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import { Form, Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";
import LaporanDetail from "../../components/Laporan/laporanUbahStatusForm";
import { store } from "react-notifications-component";
import ReactNotification from "react-notifications-component";
import authHeader from '../../services/auth-header';

const initState = {
    statusApproval: "",
    isReject: false,
    notes: null,
}

class StatusPersetujuanLaporan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [],
            reports: [],
            listIr: [],
            listMr: [],
            listPi: [],
            listMs: [],
            listMaintenance: [],
            reportsFiltered: [],
            isInstallationReport: false,
            isMrUploaded: false,
            reportTarget: null,
            orderTarget: null,
            maintenanceTarget: null,
            orderByPO: null,
            file: null,
            notes: null,
            reportNum: null,
            statusApproval: "",
            reportIRtarget: null,
            reportMRtarget: null,
            isChangeStatus: false,
            isReject: false,
            isApprove: false,
            finishedSubmitChangeStatus: false,
            isError: false,
            isCancelToVerif: false,
        };
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleSubmitChangeStatusIR = this.handleSubmitChangeStatusIR.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
        this.handleAfterChangeStatus = this.handleAfterChangeStatus.bind(this);
        this.onValueChangeApprove = this.onValueChangeApprove.bind(this);
        this.onValueChangeReject = this.onValueChangeReject.bind(this);
        this.handleSubmitChangeStatusMR = this.handleSubmitChangeStatusMR.bind(this);
        this.handleAfterError = this.handleAfterError.bind(this);
        this.cancelChange = this.cancelChange.bind(this);
        this.handleConfirmToCancel = this.handleConfirmToCancel.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersVerifiedReport", { headers: authHeader() });
            const reports = await APIConfig.get("/reportsIrMr", { headers: authHeader() });
            const listIr = await APIConfig.get("/reports/ir", { headers: authHeader() });
            const listMr = await APIConfig.get("/reports/mr", { headers: authHeader() });
            const listPi = await APIConfig.get("/orders/pi", { headers: authHeader() });
            const listMs = await APIConfig.get("/orders/ms", { headers: authHeader() });
            this.setState({ ordersVerified: orders.data, reports: reports.data, listIr: listIr.data, 
                            listMr: listMr.data, listPi: listPi.data, listMs: listMs.data});
        } catch (error) {
            this.setState({ isError: true });
            console.log(error);
        }
    }

    handleChangeField(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    getOrder(report){
        if(report.reportType === "installation"){
            const ir = this.getIr(report.idReport);
            if(ir !== null){
                const pi = ir.idOrderPi;
                return pi.idOrder;
            }
        }else{
            const mr = this.getMr(report.idReport);
            if(mr !== null){
                const maintenanceTarget = mr.idMaintenance;
                for(let i=0; i<this.state.listMs.length; i++){
                    if(this.state.listMs[i].listMaintenance !== null){
                        const listMaintenance = this.state.listMs[i].listMaintenance.filter(maintenance => 
                                                maintenance.idMaintenance === maintenanceTarget.idMaintenance);
                        if(listMaintenance.length !== 0){
                            const ms = this.state.listMs[i];
                            return ms.idOrder;
                        }
                    }
                }
            }
        }

        return null;
    }

    getListOrderFilter(){
        if(this.state.isInstallationReport){
            return this.state.ordersVerified.filter(order => order.projectInstallation === true);
        }else{
            return this.state.ordersVerified.filter(order => order.managedService === true);
        }
    }

    getPi(idOrder){
        let pi = this.state.listPi.filter(pi => pi.idOrder.idOrder === idOrder );
        if (pi.length !== 0) {
            return pi[0];
        }
        return null;
    }

    getMs(idOrder){
        let ms = this.state.listMs.filter(ms => ms.idOrder.idOrder === idOrder);
        console.log(ms);
        if (ms.length !== 0) {
            console.log(ms[0]);
            return ms[0];
        }
        return null;
    }

    getIr(idReport){
        let ir = this.state.listIr.filter(ir => ir.idReport.idReport === idReport);
        if (ir.length !== 0) {
            return ir[0];
        }
        return null;
    }

    getMr(idReport){
        let mr = this.state.listMr.filter(mr => mr.idReport.idReport === idReport);
        if (mr.length !== 0) {
            return mr[0];
        }
        return null;
    }

    getReportNum(report){
        if(report.reportType === "installation"){
            if(this.getIr(report.idReport) !== null){
                return this.getIr(report.idReport).irNum;
            }
        }else{
            if(this.getMr(report.idReport) !== null){
                return this.getMr(report.idReport).mrNum;
            }
        }
        return null;
    }

    getDate(value){
        let date = new Date(value);
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        return date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear();
    }

    getUrl(report){
        //const BASE_URL = "https://propen-a01-sipel.herokuapp.com/report/";
		const BASE_URL = "http://localhost:2020/report/";
        if(report.fileType === "application/pdf"){
            return BASE_URL+report.reportName+"/preview";
        }else{
            return BASE_URL+report.reportName;
        }
    }

    getNotes(report){
        if(report.reportType === "installation"){
            const ir = this.getIr(report.idReport);
            if(ir !== null){
                if(ir.notes !== null){
                    return ir.notes;
                }
            }
        }else{
            const mr = this.getMr(report.idReport);
            if(mr !== null){
                if(mr.notes !== null){
                    return mr.notes;
                }
            }
        }
        return "-";
    }

    getReportType(report){
        if(report.reportType === "installation"){
            return "Laporan Instalasi";
        }else{
            return "Laporan Maintenance";
        }
    }

    getStatus(report){
        if(report.statusApproval === "pending"){
            return "Pending";
        }
        if(report.statusApproval === "Setujui"){
            return "Disetujui";
        }
        if(report.statusApproval === "Tolak"){
            return "Ditolak";
        }
    }

    handleFilter(event){
        let newReportList = this.state.reports;
        const { value } = event.target;
        if( value !== "" ){
            newReportList = this.state.reports.filter(report => {
                return (report.reportName.toLowerCase().includes(value.toLowerCase()) || 
                this.getReportNum(report).toLowerCase().includes(value.toLowerCase()))
            });
            this.setState({ isFiltered : true });
        }else{
            this.setState({ isFiltered : false });
        }
        this.setState({ reportsFiltered : newReportList });
    }

    handleChangeStatus(report) {
        this.setState({ isChangeStatus: true });
        this.setState({
            reportIRtarget: this.getIr(report.idReport),
            reportMRtarget: this.getMr(report.idReport),
            orderTarget: this.getOrder(report),
            reportTarget: report,
        });
    }

    async handleSubmitChangeStatusIR(event) {
        event.preventDefault();
        try {
            if ((this.state.isReject && this.state.statusApproval === "Tolak" && this.state.notes === "")
            || (this.state.isReject && this.state.statusApproval === "Tolak" && this.state.notes === null)){
                store.addNotification({
                    title: "Peringatan!",
                    message: "Anda wajib mengisi field Catatan",
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
            const dataReport = {
                statusApproval: this.state.statusApproval,
            }
            const dataIr = {
                notes: this.state.notes,
            }
            await APIConfig.put(`/report/update/${this.state.reportTarget.idReport}`, dataReport);
            await APIConfig.put(`/update/notes/${this.state.reportIRtarget.idInstallationReport}`, dataIr);
            this.loadData();
            this.setState({ finishedSubmitChangeStatus: true });
        } catch(error) {
            this.setState({ isError: true });
            console.log(error);
        }
        this.setState({ isChangeStatus: false });
    }

    async handleSubmitChangeStatusMR(event) {
        event.preventDefault();
        try {
            if ((this.state.isReject && this.state.statusApproval === "Tolak" && this.state.notes === "")
            || (this.state.isReject && this.state.statusApproval === "Tolak" && this.state.notes === null)){
                store.addNotification({
                    title: "Peringatan!",
                    message: "Anda wajib mengisi field Catatan",
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
            const dataReport = {
                statusApproval: this.state.statusApproval,
            }
            const dataMr = {
                notes: this.state.notes,
            }
            await APIConfig.put(`/report/update/${this.state.reportTarget.idReport}`, dataReport);
            await APIConfig.put(`/update/mr/notes/${this.state.reportMRtarget.idMaintenanceReport}`, dataMr);
            this.loadData();
            this.setState({ finishedSubmitChangeStatus: true });
        } catch(error) {
            this.setState({ isError: true });
            console.log(error);
        }
        this.setState({ isChangeStatus: false });
    }

    handleAfterChangeStatus = () => {
        this.setState({ finishedSubmitChangeStatus: false, ...initState });
    }

    handleAfterError = () => {
        this.setState({ isError: false, ...initState });
    }

    handleCancelSubmit(event) {
        event.preventDefault();
        this.setState({ isChangeStatus: false, isCancelToVerif: false, ...initState });
    }

    onValueChangeApprove(event) {
        this.setState({
            statusApproval: event.target.value,
            isReject: false,
        });
    }

    onValueChangeReject(event) {
        this.setState({
            statusApproval: event.target.value,
            isReject: true,
        });
    }

    cancelChange(event) {
        event.preventDefault();
        this.setState({ isCancelToVerif: false });
    }

    handleConfirmToCancel(event) {
        event.preventDefault()
        this.setState({ isCancelToVerif: true });
    }

    render() {
        const { reports, reportsFiltered, reportTarget, isFiltered, reportNum, statusApproval, 
            reportIRtarget, reportMRtarget, orderTarget, isChangeStatus, notes, isReject, isApprove,
            finishedSubmitChangeStatus, isError, isCancelToVerif } = this.state;

        const tableHeaders = ['No', 'Nomor Laporan', 'Nama Laporan', 'Nomor PO', 'Perusahaan Pelanggan', 'Status', 'Tanggal Dibuat', 'Catatan', 'Aksi'];
                  
        let tableRows = [];

        if(reports.length !== 0){
            tableRows = isFiltered ? reportsFiltered.map((report) =>
                        [ this.getReportNum(report), report.reportName, this.getOrder(report).noPO, this.getOrder(report).clientOrg, 
                        this.getStatus(report), this.getDate(report.uploadedDate), this.getNotes(report), 
                        <div className="d-flex justify-content-center align-items-center">
                        <Button className={classes.button1} href={this.getUrl(report)} target = "_blank">&nbsp;Preview&nbsp;</Button>
                        <span>&nbsp;&nbsp;</span>
                        {this.getStatus(report) === "Pending" || this.getStatus(report) === "Ditolak" ? 
                        <>
                        <Button className={classes.button2} onClick={() => this.handleChangeStatus(report)}>Verifikasi</Button>
                        </> : <></> }</div>])
                        : reports.map((report) =>
                        [ this.getReportNum(report), report.reportName, this.getOrder(report).noPO, this.getOrder(report).clientOrg, 
                        this.getStatus(report), this.getDate(report.uploadedDate), this.getNotes(report), 
                        <div className="d-flex justify-content-left align-items-center">
                        <Button className={classes.button1} href={this.getUrl(report)} target = "_blank">&nbsp;Preview&nbsp;</Button>
                        <span>&nbsp;&nbsp;</span>
                        {this.getStatus(report) === "Pending" || this.getStatus(report) === "Ditolak" ? 
                        <>
                        <Button className={classes.button2} onClick={() => this.handleChangeStatus(report)}>Verifikasi</Button>
                        </> : <></> } </div>]);
        }

        return (
            <div className={classes.container}>
                <div><h1 className={classes.title}>Verifikasi Laporan</h1></div>
                <div className="d-flex justify-content-end" style={{padding: 5}}>
                    <div className={classes.search}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter}/></div>
                </div>
                <br></br>
                <div>{ reports.length !== 0 ? <CustomizedTables headers={tableHeaders} rows={tableRows}/> : <p className="text-center" style={{color: "red"}}>Belum terdapat laporan </p>}</div>

                <Modal show={isChangeStatus} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ubah Status Laporan</h3>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                    <div className="row" style={{ marginTop: 10 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-body">
                                    {this.state.reportIRtarget !== null ? 
                                    <>
                                    <ReactNotification />
                                    <LaporanDetail 
                                        reportNum={this.getReportNum(this.state.reportTarget)}
                                        reportName={this.state.reportTarget.reportName}
                                        noPO={this.state.orderTarget.noPO}
                                        clientOrg={this.state.orderTarget.clientOrg}
                                        statusApproval={this.state.reportTarget.statusApproval}
                                        uploadedDate={this.getDate(this.state.reportTarget.uploadedDate)}
                                    />
                                    <br></br>
                                    <form >
                                        <div className="d-flex justify-content-center">
                                        <div className="form-check"> 
                                            <div className="radio">
                                            <label className="form-check-label" style={{color: "black"}}>
                                            <input 
                                                type="radio"
                                                value="Setujui"
                                                checked={this.state.statusApproval === "Setujui"}
                                                onChange={this.onValueChangeApprove}
                                            />&nbsp;&nbsp;&nbsp;Setujui</label>
                                            </div>
                                        </div>
                                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <div className="form-check"> 
                                            <div className="radio">
                                            <label className="form-check-label" style={{color: "black"}}>
                                            <input 
                                                type="radio"
                                                value="Tolak"
                                                checked={this.state.statusApproval === "Tolak"}
                                                onChange={this.onValueChangeReject}
                                            />&nbsp;&nbsp;&nbsp;Tolak</label>
                                            </div>
                                        </div>
                                        </div>
                                        {this.state.isReject ? 
                                        <>
                                        <div className="form-group">
                                            <label className="required" style={{color: "black"}}>Catatan</label>
                                                <input 
                                                    type="text" 
                                                    name="notes" 
                                                    id="notes" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Catatan" 
                                                    value={notes} 
                                                    onChange={this.handleChange} />
                                        </div>
                                        </> : <></>}
                                        <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                        <div className="card-footer text-center">
                                            <Button className={classes.button2} onClick={this.handleSubmitChangeStatusIR}>Simpan</Button>
                                            <span>&nbsp;&nbsp;</span>
                                            <Button className={classes.button3} onClick={this.handleConfirmToCancel}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                        </div>
                                        </form>
                                    </> : 
                                    <>{this.state.reportMRtarget !== null ? 
                                    <>
                                    <ReactNotification />
                                    <LaporanDetail 
                                        reportNum={this.getReportNum(this.state.reportTarget)}
                                        reportName={this.state.reportTarget.reportName}
                                        noPO={this.state.orderTarget.noPO}
                                        clientOrg={this.state.orderTarget.clientOrg}
                                        statusApproval={this.state.reportTarget.statusApproval}
                                        uploadedDate={this.getDate(this.state.reportTarget.uploadedDate)}
                                    />
                                    <br></br>
                                    <form >
                                        <div className="d-flex justify-content-center">
                                        <div className="form-check"> 
                                            <div className="radio">
                                            <label className="form-check-label" style={{color: "black"}}>
                                            <input 
                                                type="radio"
                                                value="Setujui"
                                                checked={this.state.statusApproval === "Setujui"}
                                                onChange={this.onValueChangeApprove}
                                            />&nbsp;&nbsp;&nbsp;Setujui</label>
                                            </div>
                                        </div>
                                        <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                                        <div className="form-check"> 
                                            <div className="radio">
                                            <label className="form-check-label" style={{color: "black"}}>
                                            <input 
                                                type="radio"
                                                value="Tolak"
                                                checked={this.state.statusApproval === "Tolak"}
                                                onChange={this.onValueChangeReject}
                                            />&nbsp;&nbsp;&nbsp;Tolak</label>
                                            </div>
                                        </div>
                                        </div>
                                        {this.state.isReject ? 
                                        <>
                                        <div className="form-group">
                                            <label className="required" style={{color: "black"}}>Catatan</label>
                                                <input 
                                                    type="text" 
                                                    name="notes" 
                                                    id="notes" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Catatan" 
                                                    value={notes} 
                                                    onChange={this.handleChange} />
                                        </div>
                                        </> : <></>}
                                        <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                        <div className="card-footer text-center">
                                            <Button className={classes.button2} onClick={this.handleSubmitChangeStatusMR}>Simpan</Button>
                                            <span>&nbsp;&nbsp;</span>
                                        <Button className={classes.button3} onClick={this.handleConfirmToCancel}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                    </div>
                                        </form>
                                    </> : <></> }</>}
                                </div>
                            </div>
                        </div>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={isCancelToVerif} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;Anda yakin batal melakukan verifikasi laporan ?</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button2} onClick={this.handleCancelSubmit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ya&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                                <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button3} onClick={this.cancelChange}>&nbsp;&nbsp;Tidak&nbsp;&nbsp;</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={finishedSubmitChangeStatus} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                     <Modal.Header>
                        <div className="text-center">
                            <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Status Laporan Berhasil Diubah</h3>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="text-center">
                                <Button className={classes.button2} onClick={() => this.handleAfterChangeStatus()}>Kembali</Button>
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

export default StatusPersetujuanLaporan;