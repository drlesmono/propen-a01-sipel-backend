import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import { Form, Button, Card, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";

class LaporanInstalasiMaintenance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [],
            reports: [],
            maintenances: [],
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
            noPO: null,
            // reportName: null,
            file: null,
            notes: null,
            isValid: true,
            isPreview: false
        };
        // this.handlePreview = this.handlePreview.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleUpload = this.handleUpload.bind(this);
        this.handleMrUpload = this.handleMrUpload.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCloseNotif = this.handleCloseNotif.bind(this);
        this.handleCancelMrUpload = this.handleCancelMrUpload.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersVerifiedReport");
            const reports = await APIConfig.get("/reportsIrMr");
            const maintenances = await APIConfig.get("/maintenances");
            this.setState({ ordersVerified: orders.data, reports: reports.data, maintenances: maintenances.data});
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            // this.setState({ isError: true });
            console.log(error);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        try {   
            let response;
            let newReport;
            console.log(this.state.file);
            console.log(typeof(this.state.file));
            // const dataReport = {
            //     reportName: this.state.reportName,
            //     reportName: null,
            //     uploadedDate: null,
            //     statusApproval: "pending",
            //     signed: false,
            //     reportType: this.state.isInstallationReport ? "installation" : "maintenance",
            //     urlFile: this.state.file,
            //     fileType: null,
            //     size: null,
            //     idInstallationReport: null,
            //     idMaintenanceReport: null,
            //     isBast: null
            // }
            const dataReport = new FormData();
            dataReport.append("statusApproval", "pending");
            dataReport.append("signed", false)
            dataReport.append("reportType", this.state.isInstallationReport ? "installation" : "maintenance");
            dataReport.append("file", this.state.file);
            console.log(dataReport);
            response = await APIConfig.post(`/report/upload`, dataReport);
            newReport = response.data.result;
            this.loadData();
            if(this.state.isInstallationReport){
                const dataInstallationReport = {
                    idInstallationReport: newReport.idInstallationReport.idInstallationReport,
                    irNum: null,
                    notes: this.state.notes,
                    idOrderPi: this.state.orderTarget.idOrderPi.idOrderPi
                }
                await APIConfig.put(`/report/${newReport.idReport}/installation/${newReport.idInstallationReport.idInstallationReport}/update`, dataInstallationReport);
            }else{
                const dataMaintenanceReport = {
                    idMaintenanceReport: newReport.idMaintenanceReport.idMaintenanceReport,
                    mrNum: null,
                    notes: this.state.notes,
                    idMaintenance: this.state.maintenanceTarget
                }
                await APIConfig.put(`/report/${newReport.idReport}/maintenance/${newReport.idMaintenanceReport.idMaintenanceReport}/update`, dataMaintenanceReport);
            }
            this.setState({reportTarget: newReport});
        } catch (error) {
            console.log(error);
            return this.setState({isUpload: true, isMrUploaded: false, isFailed: true, isValid: true});
        }
        this.setState({isSuccess: true, isUpload: false, isMrUploaded:false});
    }

    async handleDelete(event){
        event.preventDefault();
        try{
            await APIConfig.delete(`/report/${this.state.reportTarget.idReport}/delete`);
        }catch (error){
            console.log(error);
            return this.setState({isFailed: true});
        }
        this.setState({isDeleteSuccess: true, isDelete: false});
    }

    // handlePreview(event){
    //     event.preventDefault();
    //     this.setState({isPreview: true, isSuccess: false, isFailed: false, isValid: true});
    // }

    handleChangeField(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleChangeFile(event){
        event.preventDefault();
        this.setState({[event.target.name]: event.target.files[0]});
    }

    getOrder(idOrderSpec, type){
        const orders = this.state.ordersVerified;
        for(let i=0; i<orders.length; i++){
            if(type === "installation" && orders.projectInstallation === true){
                if(orders[i].idOrderPi.idOrderPi === idOrderSpec){
                    return orders[i];
                }
            }

            if(type === "maintenance" && orders.managedService === true){
                if(orders[i].idOrderMs.idOrderMs === idOrderSpec){
                    return orders[i];
                }
            }
        }
        return null;
    }

    getReportNum(report){
        if(report.reportType === "installation"){
            return report.idInstallationReport.irNum;
        }else{
            return report.idMaintenanceReport.mrNum;
        }
    }

    handleUpload(type){
        if(type === "instalasi"){
            this.setState({isInstallationReport: true});
        }
        this.setState({isUpload: true});
    }

    handleMrUpload(){
        let maintenances = this.state.maintenances;
        maintenances = maintenances.filter(maintenance => maintenance.idMaintenance.idOrderMs.idOrderMs === this.orderTarget.idOrderMs.idOrderMs);
        this.setState({listMaintenance: maintenances, isUpload: false, isInstallationReport: false, isMrUploaded: true});
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
            noPO: null,
            // reportName: null,
            file: null,
            notes: null,
            isValid: true,
            isPreview: false
        });
        this.loadData();
    }

    handleCloseNotif(){
        this.setState({ isFailed: false, isValid: true});
    }

    handleConfirmDelete(report){
        this.setState({reportTarget: report, isDelete: true});
    }

    handleCancelMrUpload(){
        this.setState({isMrUploaded: false, isUpload: true});
    }

    render() {
        const { ordersVerified, reports, isMrUploaded, isInstallationReport, isUpload, isSuccess, isDelete, isDeleteSuccess, isFailed, isError,
                listMaintenance, reportTarget, orderTarget } = this.state;
        const tableHeaders = ['No.', 'Nomor Laporan', 'Nama Laporan', 'Nomor PO', 'Perusahaan', 'Tanggal dibuat', 'Aksi'];                  
        const tableRows = reports.map((report) =>
                        [ report.reportType === "installation" ? report.idInstallationReport.irNum : report.idMaintenanceReport.mrNum, 
                        report.reportName, report.reportType === "installation" ? this.getOrder(report.idInstallationReport.idOrderPi.idOrderPi, report.reportType).noPO : 
                        this.getOrder(report.idMaintenanceReport.idOrderMs.idOrderMs, report.reportType).clientOrg, this.getDate(report.uploadedDate), 
                        <div className="d-flex justify-content-center"><Button className={classes.button2}
                        onClick={() => this.handleConfirmDelete(report)}>hapus</Button><Button className={classes.button4}
                        onClick={() => this.handlePreview(report)}>lihat</Button></div>])

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
                <div><CustomizedTables headers={tableHeaders} rows={tableRows}/></div>
                <Modal
                    show={isUpload || isMrUploaded}
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
                                        <div>Laporan {isInstallationReport ? "Instalasi" : "Maintenance"} Gagal disimpan</div>
                                        <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                    </div>
                                </Card>
                               : <></> }
                            <p>
                                <Form>
                                    <Table borderless responsive="xl" size="sm">
                                        <tr>
                                            <td className="d-flex"><p>Nomor PO</p><p style={{color: "red"}}>*</p></td>
                                            <td><Form.Control as="select" size="sm" name="noPO" onChange={this.handleChangeField}>
                                                    <option value='' style={{color: 'gray'}}>Pilih Nomor PO</option>
                                                    {ordersVerified.map((order) => <option value={order.idOrder}>{order.noPO}</option>)}
                                                </Form.Control></td>
                                        </tr>
                                        {/* <tr>
                                            <td className="d-flex"><p>Nama Laporan</p><p style={{color: "red"}}>*</p></td>
                                            <td><Form.Control type="text" size="sm" name="reportName" onChange={this.handleChangeField} placeholder="Masukkan nama laporan"/></td>
                                        </tr> */}
                                        <tr>
                                            <td className="d-flex"><p>Laporan</p><p style={{color: "red"}}>*</p></td>
                                            <td><Form.File name="file" onChange={this.handleChangeFile}/></td>
                                        </tr>
                                        <tr>
                                            <td>Catatan</td>
                                            <td><Form.Control type="text" size="sm" name="notes" className={classes.notes} onChange={this.handleChangeField} placeholder="Tambahkan catatan..."/></td>
                                        </tr>
                                        <tr>
                                            <td style={{color: "red"}}>*Wajib diisi</td>
                                            <td className="d-flex justify-content-end">
                                                {isInstallationReport ?
                                                    <Button variant="primary" className={classes.button1} onClick={this.handleSubmit}>
                                                        simpan
                                                    </Button> :
                                                    <Button variant="primary" className={classes.button1} onClick={this.handleMrUpload}>
                                                        unggah
                                                    </Button>
                                                }
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
                                "Form Pemilihan Maintenance"
                            </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <tr>
                            <td className="d-flex"><p>Maintenance</p><p style={{color: "red"}}>*</p></td>
                            <td><Form.Control as="select" size="sm" name="maintenanceTarget" onChange={this.handleChangeField}>
                                <option value='' style={{color: 'gray'}}>Pilih Tanggal Maintenance</option>
                                {listMaintenance.map((maintenance) => <option value={maintenance.idMaintenance}>{this.getDate(maintenance.dateMn)}</option>)}
                            </Form.Control></td>
                        </tr>
                            <tr>
                                <td style={{color: "red"}}>*Wajib diisi</td>
                                <td className="d-flex justify-content-end">
                                <Button variant="primary" className={classes.button1} onClick={this.handleSubmit}>
                                    simpan
                                </Button>
                                </td>
                            </tr>
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
                                        <div>Laporan Gagal dihapus</div>
                                        <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                    </div>
                                </Card>
                               : <></> }
                        <div>Apakah Anda yakin menghapus laporan dengan nomor {reportTarget === null? "" : this.getReportNum(reportTarget)} ?</div>
                        <Button variant="primary" className={classes.button3} onClick={this.handleCancel}>
                                Batal
                        </Button>
                        <Button variant="primary" className={classes.button1} onClick={() => this.handleDelete()}>
                                Hapus
                        </Button>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={isSuccess || isError}
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
                                <><div className="d-flex justify-content-center">Laporan dengan nomor {reportTarget.reportType === "installation" ? reportTarget.idInstallationReport.irNum : reportTarget.idMaintenanceReport.mrNum} berhasil dihapus.</div><br></br></> :
                                <><div className="d-flex justify-content-center">Laporan {isInstallationReport ? "Instalasi" : "Maintenace"} {reportTarget.reportName} pada order {orderTarget.noPO} berhasil disimpan.</div><br></br></>
                            }
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" className={classes.button1} href={reportTarget.urlFile}>
                                    Kembali
                                </Button>
                            </div>
                        </> :
                        <>
                        <div className="d-flex justify-content-center">Oops terjadi masalah pada server</div><br></br>
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