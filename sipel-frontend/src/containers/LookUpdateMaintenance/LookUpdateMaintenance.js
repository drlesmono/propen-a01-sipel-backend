/* import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import TableMaintenanceDetail from "../../components/Maintenance/mnTableDetail";
import { withRouter } from "react-router-dom";
import CustomizedTables from "../../components/Table";

class LookUpdateMaintenance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrder: this.props.match.params.id,
            idMs: this.props.match.params.idMs,
            orderTarget: null,
            idOrderMs: "",
            noPO: "",
            clientName: "",
            clientOrg: "",
            fullname: "",
            listMaintenanceTarget: [],
            dateMn: "",
        };
        this.handleLookDetail = this.handleLookDetail.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orderItem  = await APIConfig.get(`/order/detail/${this.state.idOrder}`);
            const listMaintenance = await APIConfig.get(`/produksi/maintenance/daftar/${this.state.idMs}`);
            this.setState({ orderTarget: orderItem.data });
            this.setState({ listMaintenanceTarget: listMaintenance.data });
            this.handleLookDetail();
            //console.log(this.state.orderTarget);
            //console.log(this.state.listMaintenanceTarget);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    } 

    handleLookDetail() {
        let order = this.state.orderTarget;
        this.setState({ 
            idOrderMs: order.idOrderMs.idOrderMs,
            noPO: order.noPO,
            clientName: order.clientName,
            clientOrg: order.clientOrg,
            fullname: order.idOrderMs.idUserPic.fullname,
        })
    }

    render() {
        let{ listMaintenanceTarget } = this.state;

        const tableHeaders = [
            'No','Tanggal Maintenance','Aksi',
        ];

        const tableRows = listMaintenanceTarget.map((maintenance) => [maintenance.dateMn,
                        <CustomizedButtons
                            variant="contained"
                            size="small"
                            color="#FD693E"
                            onClick={this.changeSchedule(maintenance)}>Ubah Jadwal</CustomizedButtons>]
                        );

        return (
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Lihat Penjadwalan Maintenance</h1>
            <br></br>
            <div className="row" style={{ marginTop: 10 }}>
                <div className="col-sm-1"></div>
                <div className="col-sm-10">
                    <div className="card">
                        <div className="card-body">
                            <TableMaintenanceDetail 
                                key={this.state.idOrder}
                                idOrderMs={this.state.idOrderMs}
                                noPO={this.state.noPO}
                                clientName={this.state.clientName}
                                clientOrg={this.state.clientOrg}
                                fullname={this.state.fullname}
                            />
                            <br></br>
                            <div className="col-sm-6">
                            <h3 className={classes.subtitle}>Daftar Jadwal Maintenance</h3>
                            <CustomizedTables headers={tableHeaders} rows={tableRows} />
                            </div>
                        </div>
                        <div className="card-footer text-right">
                            <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={() => this.handleBack}>
                                Kembali
                            </CustomizedButtons>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default withRouter(LookUpdateMaintenance); */

import React from "react";
import APIConfig from "../../APIConfig";
import classes from "./styles.module.css";
import TableMaintenanceDetail from "../../components/Maintenance/mnTableDetail";
import Modal from "../../components/Modal";
import { withRouter } from "react-router-dom";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Button } from "react-bootstrap";
import CustomizedTables from "../../components/Table";

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
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orderMSItem = await APIConfig.get(`/order/detail/MS/${this.state.idOrderMs}`);
            this.setState({ orderMSTarget: orderMSItem.data });
            this.handleLookDetail();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
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
            const maintenances = await APIConfig.get(`/produksi/maintenance/daftar/${this.state.orderMSTarget.idOrderMs}`);
            this.setState({ listMaintenance: maintenances.data });
        } catch(error) {
            alert("Oops terjadi masalah pada server");
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
            const maintenanceItem = await APIConfig.get(`/produksi/maintenance/detail/${idMaintenance}`);
            this.setState({ maintenanceTarget: maintenanceItem.data });
            this.handleToChangeMaintenance();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleToChangeMaintenance() {
        let mn = this.state.maintenanceTarget;
        this.setState({
            idMaintenance: mn.idMaintenance,
            dateMn: mn.dateMn,
            isChangeMaintenance: true,
        })
    }

    handleBack = () => {
        this.props.history.push(`/produksi/maintenance`);
    }

    handleCancelSubmit(event) {
        event.preventDefault();
        this.setState({ isChangeMaintenance: false });
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({ isChangeMaintenance: false, ...initState });
    }

    handleAfterSubmit = () => {
        this.props.history.push(`/produksi/maintenance/look-update/${this.state.idOrderMs}`);
        this.setState({ finishedSubmitSchedule: false });
    }

    handleAfterDelete = () => {
        this.props.history.push(`/produksi/maintenance/look-update/${this.state.idOrderMs}`);
        this.setState({ finishedDeleteMaintenance: false });
    }

    async handleSubmitChangeMaintenance(event) {
        event.preventDefault();
        try {
            if(new Date(this.state.dateMn) < new Date(this.state.actualStart)) {
                let date = this.state.dateMn;
                store.addNotification({
                    title: "Peringatan!",
                    message: `Tanggal Maintenance  ${date} tidak boleh lebih awal dari periode mulai`,
                    type: "warning",
                    container: "top-left",
                    insert: "top",
                    animationIn: ["animated", "fadeIn"],
                    animationOut: ["animated", "fadeout"],
                    dismiss: {
                        duration: 7000,
                        showIcon: true,
                    },
                    width: 600
                });
                return false;
            }
            if(new Date(this.state.dateMn) > new Date(this.state.actualEnd)) {
                let date = this.state.dateMn;
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
                    width: 600
                });
                return false;
            }
            const data = {
                dateMn: this.state.dateMn,
            };
            await APIConfig.put(`/produksi/maintenance/ubah/${this.state.idMaintenance}`, data);
            this.loadData();
            this.setState({ finishedSubmitSchedule: true });
        } catch(error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async deleteMaintenance(idMaintenance) {
        try {
            await APIConfig.delete(`/produksi/maintenance/delete/${idMaintenance}`);
            this.loadData();
            this.setState({ finishedDeleteMaintenance: true });
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    render() {
        const {
            dateMn,
        } = this.state;

        let{ listMaintenance } = this.state;

        const tableHeaders = [
            'No', 'Tanggal Maintenance', 'Ubah Jadwal', 'Hapus Jadwal'
        ];

        const tableRows = listMaintenance.map((maintenance) => [this.getDate(maintenance.dateMn),
            <Button className={classes.button1} onClick={() => this.changeMaintenance(maintenance.idMaintenance)}>&nbsp;Ubah&nbsp;</Button>, 
            <Button className={classes.button2} onClick={() => this.deleteMaintenance(maintenance.idMaintenance)}>Hapus</Button>
        ]);

        return (
            <div className="content">
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
                            <br></br>
                        </div>
                        <div className="card-body">
                            <CustomizedTables headers={tableHeaders} rows={tableRows} /><br></br>
                        </div>
                        <div className="card-footer text-right">
                            <Button className={classes.button1} onClick={() => this.handleBack()}>&nbsp;Kembali&nbsp;</Button>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={this.state.isChangeMaintenance} >
                <form onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center">Ubah Maintenance</div>
                                    <ReactNotification />
                                    <div className="card-body">
                                        {/* <ReactNotification /> */}
                                        <div className="row">
                                            <div className="col-sm-10">
                                            <div className="form-group">
                                                <label className="required">Tanggal Maintenance</label>
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
                                    </div>
                                    <div className="card-footer text-center">
                                        <Button className={classes.button1} onClick={this.handleSubmitChangeMaintenance}>Simpan</Button>
                                        <span>&nbsp;&nbsp;</span>
                                        <Button className={classes.button2} onClick={this.handleCancelSubmit}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                    </div>
                                </div>
                            </div>
                    </div>
                </form>
            </Modal>

            <Modal show={this.state.finishedSubmitSchedule}>
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>{`Jadwal Maintenance Berhasil Diubah`}</h2>
                        </div>
                        <div className="card-footer text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterSubmit()}>Kembali</Button>
                        </div>
                    </div>
            </Modal>

            <Modal show={this.state.finishedDeleteMaintenance}>
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>{`Jadwal Maintenance Berhasil Dihapus`}</h2>
                        </div>
                        <div className="card-footer text-center">
                            <Button className={classes.button1} onClick={() => this.handleAfterDelete()}>Kembali</Button>
                        </div>
                    </div>
            </Modal>
            
            </div>
        );
    }
}

export default withRouter(CreateMaintenance);