import React from "react";
import APIConfig from "../../APIConfig";
import classes from "./styles.module.css";
import TableMaintenanceDetail from "../../components/Maintenance/mnTableDetail";
import { withRouter } from "react-router-dom";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Button } from "react-bootstrap";
import CustomizedTables from "../../components/Table";
import Modal from "react-bootstrap/Modal";
import moment from "moment";
import authHeader from '../../services/auth-header';

const initState = {
    dateMn: "",
}

class CreateMaintenance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrderMs: this.props.match.params.id,
            listMaintenance: [],
            maintenanceTarget: null,
            dateMn: "",
            idMaintenance: "",
            orderMSTarget: null,
            actualStart: "",
            actualEnd: "",
            noPO: "",
            clientName: "",
            clientOrg: "",
            fullname: "",
            maintained: false,
            isChangeMaintenance: false,
            finishedSubmitSchedule: false,
            finishedDeleteMaintenance: false,
            isCancelToChange: false,
            scheduleToDelete: null,
            isDeleteSchedule: false,
            isError: false,
        };
        this.handleLookDetail = this.handleLookDetail.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
        this.handleLookMaintenance = this.handleLookMaintenance.bind(this);
        this.handleToChangeMaintenance = this.handleToChangeMaintenance.bind(this);
        this.changeMaintenance = this.changeMaintenance.bind(this);
        this.handleBack = this.handleBack.bind(this);
        this.handleSubmitChangeMaintenance = this.handleSubmitChangeMaintenance.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleAfterSubmit = this.handleAfterSubmit.bind(this);
        this.deleteMaintenance = this.deleteMaintenance.bind(this);
        this.handleAfterDelete = this.handleAfterDelete.bind(this);
        this.cancelChange = this.cancelChange.bind(this);
        this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
        this.handleConfirmDeleteMaintenance = this.handleConfirmDeleteMaintenance.bind(this);
        this.handleCancelToDelete = this.handleCancelToDelete.bind(this);
        this.handleAfterError = this.handleAfterError.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orderMSItem = await APIConfig.get(`/order/detail/MS/${this.state.idOrderMs}`, { headers: authHeader() });
            this.setState({ orderMSTarget: orderMSItem.data });
            this.handleLookDetail();
        } catch (error) {
            this.setState({ isError: true });
            console.log(error);
        }
    } 

    handleLookDetail() {
        let orderMS = this.state.orderMSTarget;
        this.setState({ 
            actualStart: orderMS.actualStart,
            actualEnd: orderMS.actualEnd,
            noPO: orderMS.idOrder.noPO,
            clientName: orderMS.idOrder.clientName,
            clientOrg: orderMS.idOrder.clientOrg,
            fullname: orderMS.idUserPic.fullname,
        });
        this.handleLookMaintenance();
    }

    async handleLookMaintenance() {
        try {
            const maintenances = await APIConfig.get(`/produksi/maintenance/daftar/${this.state.orderMSTarget.idOrderMs}`, { headers: authHeader() });
            this.setState({ listMaintenance: maintenances.data });
        } catch(error) {
            this.setState({ isError: true });
            console.log(error);
        }
    }

    getDate(date) {
        let oldDate = new Date(date);
        const month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return oldDate.getDate() + " " + month[oldDate.getMonth()] + " " + oldDate.getFullYear();

    }

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    async changeMaintenance(idMaintenance) {
        try {
            const maintenanceItem = await APIConfig.get(`/produksi/maintenance/detail/${idMaintenance}`, { headers: authHeader() });
            this.setState({ maintenanceTarget: maintenanceItem.data });
            this.handleToChangeMaintenance();
        } catch (error) {
            this.setState({ isError: true });
            console.log(error);
        }
    }

    handleToChangeMaintenance() {
        let mn = this.state.maintenanceTarget;
        this.setState({
            idMaintenance: mn.idMaintenance,
            dateMn: moment(new Date(mn.dateMn)).format("YYYY-MM-DD"),
            isChangeMaintenance: true,
        })
    }

    handleBack = () => {
        this.props.history.push(`/produksi/maintenance`);
    }

    handleCancelSubmit(event) {
        event.preventDefault();
        this.setState({ isChangeMaintenance: false, isCancelToChange: false, });
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({ isChangeMaintenance: false, ...initState });
    }

    handleAfterSubmit = () => {
        this.props.history.push(`/produksi/maintenance/look-update/${this.state.idOrderMs}`, { headers: authHeader() });
        this.setState({ finishedSubmitSchedule: false });
    }

    handleAfterDelete = () => {
        this.props.history.push(`/produksi/maintenance/look-update/${this.state.idOrderMs}`, { headers: authHeader() });
        this.setState({ finishedDeleteMaintenance: false });
    }

    async handleSubmitChangeMaintenance(event) {
        event.preventDefault();
        try {
            if(new Date(this.state.dateMn) < new Date(this.state.actualStart)) {
                let date = this.getDate(this.state.dateMn);
                store.addNotification({
                    title: "Peringatan!",
                    message: `Tanggal Maintenance  ${date} tidak boleh dilakukan sebelum periode mulai`,
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
            if(new Date(this.state.dateMn) > new Date(this.state.actualEnd)) {
                let date = this.getDate(this.state.dateMn);
                store.addNotification({
                    title: "Peringatan!",
                    message: `Tanggal Maintenance  ${date} tidak boleh dilakukan setelah periode selesai`,
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
            };
            if(this.state.dateMn.length === 0) {
                store.addNotification({
                    title: "Peringatan!",
                    message: `Anda wajib megisi field Tanggal Maintenance`,
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
            };
            const data = {
                dateMn: this.state.dateMn,
            };
            await APIConfig.put(`/produksi/maintenance/ubah/${this.state.idMaintenance}`, data, { headers: authHeader() });
            this.loadData();
            this.setState({ finishedSubmitSchedule: true });
        } catch(error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async deleteMaintenance(idMaintenance) {
        this.setState({ isDeleteSchedule: false });
        try {
            await APIConfig.delete(`/produksi/maintenance/delete/${idMaintenance}`, { headers: authHeader() });
            this.loadData();
            this.setState({ finishedDeleteMaintenance: true });
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleConfirmDeleteMaintenance(maintenance) {
        this.setState({ scheduleToDelete: maintenance, isDeleteSchedule: true });
    }

    handleCancelToDelete(event) {
        event.preventDefault();
        this.setState({ isDeleteSchedule: false });
    }

    cancelChange(event) {
        event.preventDefault();
        this.setState({ isCancelToChange: false });
    }

    handleConfirmCancel(event) {
        event.preventDefault();
        this.setState({ isCancelToChange: true });
    }

    handleAfterError = () => {
        this.setState({ isError: false });
        this.props.history.push(`/produksi/maintenance`);
    }

    render() {
        const {
            dateMn,
            isCancelToChange,
            isDeleteSchedule,
            isError
        } = this.state;

        let{ listMaintenance } = this.state;

        const tableHeaders = [
            'No', 'Tanggal Maintenance', 'Aksi'
        ];

        const tableRows = listMaintenance.map((maintenance) => [this.getDate(maintenance.dateMn),
            <div className="d-flex justify-content-center align-items-center">
            <Button className={classes.button1} onClick={() => this.changeMaintenance(maintenance.idMaintenance)}>&nbsp;Ubah&nbsp;</Button>
            <span>&nbsp;&nbsp;</span>
            <Button className={classes.button2} onClick={() => this.handleConfirmDeleteMaintenance(maintenance)}>Hapus</Button>
            </div>
        ]);

        return (
            <div className={classes.container}>
            <br></br>
            <h1 className={classes.title}>Lihat Penjadwalan Maintenance</h1>
            <br></br>
            <div className="row" style={{ marginTop: 10 }}>
                <div className="col-sm-1"></div>
                <div className="col-sm-10">
                {/* <ReactNotification /> */}
                    <div className="card">
                        <div className="card-body">
                            <TableMaintenanceDetail 
                                key={this.state.idOrder}
                                idOrderMs={this.state.idOrderMs}
                                noPO={this.state.noPO}
                                clientName={this.state.clientName}
                                clientOrg={this.state.clientOrg}
                                fullname={this.state.fullname}
                                periodeMulai={this.getDate(this.state.actualStart)}
                                periodeSelesai={this.getDate(this.state.actualEnd)}
                            />
                        </div>
                        <div className="card-body">
                        <div className="row">
                            <div className="col-sm-6">
                                <div className="form-group">
                                    <h3 className={classes.subtitle} style={{color: "black"}}>Daftar Jadwal Maintenance</h3>
                                </div>
                            </div>
                            </div>
                            <CustomizedTables headers={tableHeaders} rows={tableRows} /><br></br>
                        </div>
                        <div className="card-footer text-right">
                            <Button className={classes.button1} onClick={() => this.handleBack()}>&nbsp;Kembali&nbsp;</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={this.state.isChangeMaintenance} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                <form onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center"><h5 style={{color: "black"}}>Ubah Maintenance</h5></div>
                                    <ReactNotification />
                                    <div className="card-body">
                                        {/* <ReactNotification /> */}
                                        <div className="row">
                                            <div className="col-sm-10">
                                            <div className="form-group">
                                                <label className="required" style={{color: "black"}}>Tanggal Maintenance</label>
                                                <input 
                                                    type="date" 
                                                    name="dateMn" 
                                                    id="dateMn" 
                                                    className="form-control" 
                                                    placeholder="Masukkan tanggal Maintenance" 
                                                    value={dateMn} 
                                                    onChange={this.handleChange} />
                                            </div>
                                            </div>
                                        </div>
                                        <div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div>
                                    </div>
                                    <div className="card-footer text-center">
                                        <Button className={classes.button1} onClick={this.handleSubmitChangeMaintenance}>Simpan</Button>
                                        <span>&nbsp;&nbsp;</span>
                                        <Button className={classes.button2} onClick={this.handleConfirmCancel}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                    </div>
                                </div>
                            </div>
                    </div>
                </form>
            </Modal>

            <Modal show={isCancelToChange} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header>
                    <div className="text-center">
                        <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Anda yakin batal mengubah jadwal ?</h4>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <Button className={classes.button1} onClick={this.handleCancelSubmit}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ya&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                        <Button className={classes.button2} onClick={this.cancelChange}>&nbsp;&nbsp;Tidak&nbsp;&nbsp;</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={this.state.finishedSubmitSchedule} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                     <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jadwal Maintenance Berhasil Diubah</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="text-center">
                                <Button className={classes.button1} onClick={() => this.handleAfterSubmit()}>Kembali</Button>
                            </div>
                    </Modal.Body>
                </Modal>

                <Modal show={isDeleteSchedule} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Anda yakin akan menghapus jadwal ?</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button1} onClick={() => this.deleteMaintenance(this.state.scheduleToDelete.idMaintenance)}>&nbsp;&nbsp;Hapus&nbsp;&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button2} onClick={this.handleCancelToDelete}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                        </div>
                    </Modal.Body>
                </Modal>

                <Modal show={this.state.finishedDeleteMaintenance} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                     <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Jadwal Maintenance Berhasil Dihapus</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                            <div className="text-center">
                                <Button className={classes.button1} onClick={() => this.handleAfterDelete()}>Kembali</Button>
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

export default withRouter(CreateMaintenance);