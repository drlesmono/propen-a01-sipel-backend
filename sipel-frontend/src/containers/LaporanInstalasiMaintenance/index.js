import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import { Form, Button, Card, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";
import authHeader from '../../services/auth-header';
import UserService from "../../services/user.service";
import axios from 'axios';

class LaporanInstalasiMaintenance extends Component {
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
            isUpload: false,
            isDelete: false,
            isSuccess: false,
            isDeleteSuccess: false,
            isFailed: false,
            isError: false,
            reportTarget: null,
            orderTarget: null,
            maintenanceTarget: null,
            orderByPO: null,
            file: null,
            notes: null,
            isValid: true,
            messageError: null,
            reportNum: null
        };
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleMrUpload = this.handleMrUpload.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCloseNotif = this.handleCloseNotif.bind(this);
        this.handleCancelMrUpload = this.handleCancelMrUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleValidationMrUpload = this.handleValidationMrUpload.bind(this);
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
            // alert("Oops terjadi masalah pada server");
            this.setState({ isError: true, messageError: "Oops terjadi masalah pada server" });
            console.log(error);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {   
            let response;
            let newReport;

            const dataReport = new FormData();
            dataReport.append("statusApproval", "pending");
            dataReport.append("signed", false)
            dataReport.append("reportType", this.state.isInstallationReport ? "installation" : "maintenance");
            dataReport.append("file", this.state.file);
            console.log(dataReport);
            response = await APIConfig.post(`/report/upload`, dataReport, { headers: authHeader() });
            newReport = response.data.result;

            if(this.state.isInstallationReport){
                const dataInstallationReport = {
                    idInstallationReport: null,
                    irNum: null,
                    notes: this.state.notes,
                    idOrderPi: this.getPi(parseInt(this.state.orderByPO, 10)).idOrderPi
                }
                await APIConfig.post(`/report/${newReport.idReport}/installation/upload`, dataInstallationReport, { headers: authHeader() });
            }else{
                const dataMaintenanceReport = {
                    idMaintenanceReport: null,
                    mrNum: null,
                    notes: this.state.notes,
                    idMaintenance: parseInt(this.state.maintenanceTarget, 10)
                }
                console.log(dataMaintenanceReport);
                await APIConfig.post(`/report/${newReport.idReport}/maintenance/upload`, dataMaintenanceReport, { headers: authHeader() });
            }
            
            this.setState({reportTarget: newReport});
            this.loadData();
        } catch (error) {
            console.log(error);
            return this.setState({isUpload: false, isMrUploaded:false, isInstallationReport: false, isError: true, messageError: "Oops terjadi masalah pada server"});
        }
        this.setState({isSuccess: true, isUpload: false, isMrUploaded:false, isInstallationReport: false});
        this.loadData();
    }

    handleValidation(event){
        event.preventDefault();
        if(this.state.orderByPO === null || this.state.orderByPO === ""){
            return this.setState({isFailed: true, messageError: "Nomor PO wajib diisi"});
        }

        if(this.state.file === null || this.state.file === ""){
            return this.setState({isFailed: true, messageError: "File wajib diisi"});
        }

        this.setState({isFailed: false, messageError: null});
        if(this.state.isInstallationReport === false){
            return this.handleMrUpload(event);
        }
        this.handleSubmit(event);
    }

    handleValidationMrUpload(event){
        event.preventDefault();
        if(this.state.maintenanceTarget === null || this.state.maintenanceTarget === ""){
            return this.setState({isFailed: true, messageError: "Tanggal maintenance wajib diisi"});
        }
        this.handleSubmit(event);
    }

    async handleDelete(event){
        event.preventDefault();
        try{
            await APIConfig.delete(`/report/${this.state.reportTarget.idReport}/delete`, { headers: authHeader() });
        }catch (error){
            console.log(error);
            return this.setState({isFailed: true, messageError: "Laporan gagal dihapus"});
        }
        this.loadData();
        return this.setState({isDeleteSuccess: true, isDelete: false});
    }

    handleChangeField(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleChangeFile(event){
        event.preventDefault();
        this.setState({[event.target.name]: event.target.files[0]});
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

    handleUpload(type){
        if(type === "instalasi"){
            this.setState({isInstallationReport: true});
        }
        this.setState({isUpload: true});
    }

    handleMrUpload(event){
        event.preventDefault();
        const ms = this.getMs(parseInt(this.state.orderByPO, 10));
        this.setState({listMaintenance: ms.listMaintenance, isUpload: false, isInstallationReport: false, isMrUploaded: true});
    }

    getDate(value){
        let date = new Date(value);
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        return date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear();
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({
            listMaintenance: [],
            isInstallationReport: false,
            isMrUploaded: false,
            isUpload: false,
            isDelete: false,
            isSuccess: false,
            isDeleteSuccess: false,
            isFailed: false,
            isError: false,
            reportTarget: null,
            orderTarget: null,
            maintenanceTarget: null,
            orderByPO: null,
            file: null,
            notes: null,
            isValid: true,
            messageError: null,
            isFiltered: false,
            reportNum: null
        });
        this.loadData();
    }

    handleCloseNotif(){
        this.setState({ isFailed: false });
    }

    handleConfirmDelete(report){
        const reportNum = this.getReportNum(report);
        this.setState({reportNum: reportNum, reportTarget: report, isDelete: true, orderTarget: this.getOrder(report)});
    }

    handleCancelMrUpload(){
        this.setState({isMrUploaded: false, isUpload: true});
    }

    getUrl(report){
        
        if(report.fileType === "application/pdf"){
            return report.urlFile+"/preview";

        }else{
            return report.urlFile;
            
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


    render() {
        const { reports, reportsFiltered, isMrUploaded, isInstallationReport, isUpload, isSuccess, isDelete, isDeleteSuccess, isFailed, isError,
                listMaintenance, reportTarget, messageError, isFiltered, reportNum } = this.state;
        const tableHeaders = ['No.', 'Nomor Laporan', 'Nama Laporan', 'Nomor PO', 'Perusahaan', 'Tanggal dibuat', 'Catatan', 'Aksi'];                  
        let tableRows = [];

        if(reports.length !== 0){
            tableRows = isFiltered ? reportsFiltered.map((report) =>
                        [ this.getReportNum(report), report.reportName, this.getOrder(report).noPO, this.getOrder(report).clientOrg, 
                        this.getDate(report.uploadedDate), this.getNotes(report), 
                        <div className="d-flex justify-content-center"><Button className={classes.button2}
                        onClick={() => this.handleConfirmDelete(report)}>hapus</Button>
                        <Button className={classes.button4} href={this.getUrl(report)} target = "_blank">lihat</Button></div>])
                        : reports.map((report) =>
                        [ this.getReportNum(report), report.reportName, this.getOrder(report).noPO, this.getOrder(report).clientOrg, 
                        this.getDate(report.uploadedDate), this.getNotes(report), 
                        <div className="d-flex justify-content-center"><Button className={classes.button2}
                        onClick={() => this.handleConfirmDelete(report)}>hapus</Button>
                        <Button className={classes.button4} href={this.getUrl(report)} target = "_blank">lihat</Button></div>]);
        }

        return (
            <div className={classes.container}>
                <div><h1 className="text-center">Daftar Laporan</h1></div>
                <div className="d-flex justify-content-between" style={{padding: 5}}>
                    <div className={classes.containerButtonUpload}>
                        <Button size="sm" className={[classes.button1, classes.buttonUpload].join(" ")} onClick={() => this.handleUpload("instalasi")}>Unggah Laporan Instalasi</Button>
                        <Button size="sm" className={[classes.button5, classes.buttonUpload].join(" ")} onClick={() => this.handleUpload("maintenance")}>Unggah Laporan Maintenance</Button>
                    </div>
                    <div className={classes.search}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter}/></div>
                </div>
                <div>{ reports.length !== 0 ? <CustomizedTables headers={tableHeaders} rows={tableRows}/> : <p className="text-center" style={{color: "red"}}>Belum terdapat laporan </p>}</div>
                <Modal
                    show={isUpload}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Header closeButton onClick={this.handleCancel}>
                        {isUpload ?
                            <Modal.Title id="contained-modal-title-vcenter">
                                {isInstallationReport ? "Form Unggah Laporan Instalasi" : "Form Unggah Laporan Maintenance"}
                            </Modal.Title>
                        : <></>}
                    </Modal.Header>
                        <Modal.Body>
                               { isFailed ? 
                               <Card body className={classes.card}>
                                   <div className="d-flex justify-content-between">
                                        <div>{messageError}</div>
                                        <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                    </div>
                                </Card>
                               : <></> }
                            <p>
                                <Form>
                                    <Table borderless responsive="xl" size="sm">
                                        <tr>
                                            <td><p className="d-flex">Nomor PO<p style={{color: "red"}}>*</p></p></td>
                                            <td><Form.Control as="select" size="sm" name="orderByPO" onChange={this.handleChangeField}>
                                                    <option value='' style={{color: 'gray'}}>Pilih Nomor PO</option>
                                                    {this.getListOrderFilter().map((order) => <option value={order.idOrder}>{order.noPO}</option>)}
                                                </Form.Control></td>
                                        </tr>
                                        <tr>
                                            <td><p className="d-flex">Laporan <p style={{color: "red"}}>*</p></p></td>
                                            <td><Form.File name="file" onChange={this.handleChangeFile}/></td>
                                        </tr>
                                        <tr>
                                            <td>Catatan</td>
                                            <td><Form.Control type="text" size="sm" name="notes" className={classes.notes} onChange={this.handleChangeField} placeholder="Tambahkan catatan..."/></td>
                                        </tr>
                                        <tr>
                                            <td style={{color: "red"}}>*Wajib diisi</td>
                                            <td className="d-flex justify-content-end">
                                                    <Button variant="primary" className={classes.button1} onClick={this.handleValidation}>
                                                        {isInstallationReport ? "simpan" : "unggah"}
                                                    </Button>
                                            </td>
                                        </tr>
                                    </Table>
                                </Form>
                            </p>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={isMrUploaded}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                     <Modal.Header closeButton onClick={this.handleCancelMrUpload}>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Form Pemilihan Maintenance
                            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { isFailed ? 
                            <Card body className={classes.card}>
                                <div className="d-flex justify-content-between">
                                    <div>{messageError}</div>
                                     <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                </div>
                            </Card>
                        : <></> }
                        <Form>
                            <Table borderless responsive="xl" size="sm">
                                <tr>
                                    <td><p className="d-flex">Maintenance<p style={{color: "red"}}>*</p></p></td>
                                    <td><Form.Control as="select" size="sm" name="maintenanceTarget" onChange={this.handleChangeField}>
                                        <option value='' style={{color: 'gray'}}>Pilih Tanggal Maintenance</option>
                                        {listMaintenance.map((maintenance) => <option value={maintenance.idMaintenance}>{this.getDate(maintenance.dateMn)}</option>)}
                                    </Form.Control></td>
                                </tr>
                                <tr>
                                    <td style={{color: "red"}}>*Wajib diisi</td>
                                    <td className="d-flex justify-content-end">
                                    <Button variant="primary" className={classes.button1} onClick={this.handleValidationMrUpload}>
                                        simpan
                                    </Button>
                                    </td>
                                </tr>
                            </Table>
                        </Form>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={isDelete}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                     <Modal.Header closeButton onClick={this.handleCancel}>
                    </Modal.Header>
                    <Modal.Body>
                        { isFailed ? 
                               <Card body className={classes.card}>
                                   <div className="d-flex justify-content-between">
                                        <div>{messageError}</div>
                                        <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                    </div>
                                </Card>
                               : <></> }
                        <div>Apakah Anda yakin menghapus laporan dengan nomor {reportNum === null? "" : reportNum} ?</div>
                        <div className="d-flex justify-content-center">
                            <Button className={classes.button3} onClick={this.handleCancel}>
                                    Batal
                            </Button>
                            <Button className={classes.button1} onClick={this.handleDelete}>
                                    Hapus
                            </Button>
                        </div>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={isSuccess || isDeleteSuccess || isError}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                     <Modal.Header closeButton onClick={this.handleCancel}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Notification
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {isSuccess || isDeleteSuccess ?
                        <>
                            {isDeleteSuccess ? 
                                <><div className="d-flex justify-content-center">Laporan dengan nomor {reportNum} berhasil dihapus.</div><br></br>
                                <div className="d-flex justify-content-center">
                                <Button variant="primary" className={classes.button1} onClick={this.handleCancel}>
                                    Kembali
                                </Button></div></>  
                                :<><div className="d-flex justify-content-center">Laporan {reportTarget.reportType === "installation" ? "Instalasi" : "Maintenace"} {reportTarget.reportName} pada order {this.getOrder(reportTarget) === null ? "" : this.getOrder(reportTarget).noPO} berhasil disimpan.</div><br></br>
                                <div className="d-flex justify-content-center">
                                <Button variant="primary" className={classes.button1} href={this.getUrl(reportTarget)} target="_blank">
                                    lihat
                                </Button></div></>
                            }
                        </> :
                        <>
                        <div className="d-flex justify-content-center">{messageError}</div><br></br>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" className={classes.button1} onClick={this.handleCancel}>
                                Kembali
                            </Button>
                        </div>
                        </>}
                    </Modal.Body>
                </Modal>
        </div>
        );
    }
}

export default LaporanInstalasiMaintenance;