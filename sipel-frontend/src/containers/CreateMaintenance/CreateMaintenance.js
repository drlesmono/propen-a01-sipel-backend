import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import TableMaintenanceDetail from "../../components/Maintenance/mnTableDetail";
import Modal from "../../components/Modal";
import MaintenanceList from "../../components/Maintenance/maintenanceList";
import { withRouter } from "react-router-dom";
import * as moment from "moment";
import ReactNotification from "react-notifications-component";
import { store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import { Button } from "react-bootstrap";

class CreateMaintenance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrderMs: this.props.match.params.id,
            listMaintenance: [{ index: Math.random(), dateMn: ""}],
            orderMSTarget: null,
            actualStart: "",
            actualEnd: "",
            noPO: "",
            clientName: "",
            clientOrg: "",
            fullname: "",
            maintained: false,
            finishedSubmitSchedule: false,
        };
        this.handleLookDetail = this.handleLookDetail.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.clickOnDelete = this.clickOnDelete.bind(this);
        this.handleSubmitCreateMaintenance = this.handleSubmitCreateMaintenance.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
        this.handleAfterSubmit = this.handleAfterSubmit.bind(this);
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
        })
    }

    getDate(date) {
        let oldDate = new Date(date);
        const month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return oldDate.getDate() + " " + month[oldDate.getMonth()] + " " + oldDate.getFullYear();

    }

    handleChange = (e) => {
        if (["dateMn"].includes(e.target.name)) {
            let listMaintenance = [...this.state.listMaintenance]
            listMaintenance[e.target.dataset.id][e.target.name] = e.target.value;
        }
    }

    addNewRow = () => {
        this.setState((prevState) => ({
            listMaintenance: [...prevState.listMaintenance, { index: Math.random(), dateMn: "" }],
        }));
    }

    deleteRow = (index) => {
        this.setState({
            listMaintenance: this.state.listMaintenance.filter((s, sindex) => index !== sindex),
        });
    }

    clickOnDelete(record) {
        this.setState({
            listMaintenance: this.state.listMaintenance.filter(r => r !== record)
        });
    }

    async handleSubmitCreateMaintenance(event) {
        event.preventDefault();
        try {
            for (let i=0; i<this.state.listMaintenance.length;i++) {
                if(new Date(this.state.listMaintenance[i].dateMn) < new Date(this.state.actualStart)) {
                    let date = this.state.listMaintenance[i].dateMn;
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
                if(new Date(this.state.listMaintenance[i].dateMn) > new Date(this.state.actualEnd)) {
                    let date = this.state.listMaintenance[i].dateMn;
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
                if(new Date(this.state.listMaintenance[i].dateMn) === "" || new Date(this.state.listMaintenance[i].dateMn) === null) {
                    let date = this.state.listMaintenance[i].dateMn;
                    store.addNotification({
                        title: "Peringatan!",
                        message: `Anda wajib mengisi field Tanggal Maintenance`,
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
            }
            for (let i=0; i<this.state.listMaintenance.length;i++) {
                console.log(this.state.listMaintenance[i].dateMn);
                const data = {
                    dateMn: this.state.listMaintenance[i].dateMn,
                    maintained: this.state.maintained,
                };
                await APIConfig.post(`/produksi/maintenance/tambah/${this.state.orderMSTarget.idOrderMs}`, data);
                this.loadData();
                this.setState({ finishedSubmitSchedule: true });
            }
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleCancelSubmit = () => {
        this.props.history.push(`/produksi/maintenance`);
    }

    handleAfterSubmit = () => {
        this.props.history.push(`/produksi/maintenance`);
    }

    render() {
        let{ listMaintenance } = this.state;

        return (
            <div className={classes.container}>
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Buat Penjadwalan Maintenance</h1>
            <br></br>
            <div className="row" style={{ marginTop: 10 }}>
                <div className="col-sm-1"></div>
                <div className="col-sm-10">
                <ReactNotification />
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
                        <form onChange={this.handleChange} >
                        <div className="card-body">
                            <div className="col-sm-6">
                            <table className="table">
                            <thead>
                                <tr>
                                    <th className="required">Tanggal Maintenance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <MaintenanceList add={this.addNewRow} delete={this.clickOnDelete} listMaintenance={listMaintenance} />
                            </tbody>
                            </table>
                            </div>
                        </div>
                        <div className="card-footer text-right">
                            {/* <CustomizedButtons variant="contained" size="medium" color="#F86439" onClick={this.handleSubmitCreateMaintenance}>
                                Simpan
                            </CustomizedButtons> */}
                            <Button className={classes.button1} onClick={this.handleSubmitCreateMaintenance}>Simpan</Button>
                            {/* <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={() => this.handleCancelSubmit()}>
                                Batal
                            </CustomizedButtons> */}
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button2} onClick={() => this.handleCancelSubmit()}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>

            <Modal show={this.state.finishedSubmitSchedule}>
                    <div className="card">
                        <div className="card-body text-center">
                            <h2>{`Jadwal Maintenance Berhasil Dibuat`}</h2>
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
            </div>
        );
    }
}

export default withRouter(CreateMaintenance);