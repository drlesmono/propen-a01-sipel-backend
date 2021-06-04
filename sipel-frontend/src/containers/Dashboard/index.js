import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import { Form, Button, Card, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";
import moment from "moment";
import BarChart from "../../components/BarChart";
import DoughnutChart from "../../components/DoughnutChart";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [],
            isLoading: false,
            isEdit: false,
            isExtend: false,
            orderTarget: null,
            orderTargetUpdated: null,
            engineers: [],
            picEngineerMs: null,
            servicesEngineer: [],
            servicesEngineerName: [],
            isReport: false,
            isReportExtend: false,
            orderFiltered: [],
            isFiltered: false,
            currentDateTime: new Date(),
            actualStart: null,
            actualEnd: null,
            totalServices: 0,
            listService: [],
            services: [],
            isAdded: false,
            newNoPO: null,
            timeRemaining: null,
            isFailed: false,
            isError: false,
            isSuccess: false,
            listPi: [],
            listMs: [],
            messageError: null,
            listNamaBulanPi: [],
            listNamaBulanMs: [],
            piBelumSelesai: 0,
            MsBelumSelesai: 0,
            tepatWaktuTelat: [],
            piMasuk: [],
            piSelesai: [],
            msMasuk: [],
            msSelesai: [],
            setPeriodChart2: false,
            startMonth2: "01_2021",
            endMonth2: "12_2021",
            setPeriodChart3: false,
            startMonth3: "01_2021",
            endMonth3: "12_2021",
            setPeriodChart4: false,
            startMonth4: "01_2021",
            endMonth4: "12_2021",
        };
        
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
       
        this.handleAfterSetPeriod = this.handleAfterSetPeriod.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    // Mengambil dan mengupdate data yang masuk
    async loadData() {
        try {
	    console.log("kok kesini")
            const piBelumSelesai = await APIConfig.get("orders/pi/belumSelesai");
            const msBelumSelesai = await APIConfig.get("orders/ms/belumSelesai");
            const tepatWaktuTelat = await APIConfig.get(`orders/pi/tepatWaktuTelat/${this.state.startMonth2}/${this.state.endMonth2}`);
            const listNamaBulanPi = await APIConfig.get(`/orders/pi/namaBulan/${this.state.startMonth3}/${this.state.endMonth3}`);
            const piMasuk = await APIConfig.get(`/orders/pi/masuk/${this.state.startMonth3}/${this.state.endMonth3}`);
            const piSelesai = await APIConfig.get(`/orders/pi/selesai/${this.state.startMonth3}/${this.state.endMonth3}`);
            const listNamaBulanMs = await APIConfig.get(`/orders/ms/namaBulan/${this.state.startMonth4}/${this.state.endMonth4}`);
            const msMasuk = await APIConfig.get(`/orders/ms/masuk/${this.state.startMonth4}/${this.state.endMonth4}`);
            const msSelesai = await APIConfig.get(`/orders/ms/selesai/${this.state.startMonth4}/${this.state.endMonth4}`);
            console.log(this.state.startMonth4);
            // console.log(listPi);
            this.setState({
                piBelumSelesai: piBelumSelesai.data, msBelumSelesai: msBelumSelesai.data,
                tepatWaktuTelat: tepatWaktuTelat.data,
                listNamaBulanPi: listNamaBulanPi.data, piMasuk: piMasuk.data, piSelesai: piSelesai.data,
                listNamaBulanMs: listNamaBulanMs.data, msMasuk: msMasuk.data, msSelesai: msSelesai.data,
            });
        } catch (error) {
            this.setState({ isError: true });
            console.log(error);
        }
    }

    

    // Mengubah data yang ditargetkan sesuai dengan isi form
    handleChangeField(event) {
        const { name, value } = event.target;
        
        this.setState({ [name]: value });
        console.log(this.state.startMonth4);
    }

    
    // Memunculkan modal Set Period untuk Chart 2
    handleSetPeriodChart2(event){
        this.setState({setPeriodChart2: true})
    }

    // Memunculkan modal Set Period untuk Chart 3
    handleSetPeriodChart3(event){
        this.setState({setPeriodChart3: true})
    }

    // Memunculkan modal Set Period untuk Chart 4
    handleSetPeriodChart4(event){
        this.setState({setPeriodChart4: true})
    }

    handleAfterSetPeriod(event){
	console.log("masuk ke sini");
        console.log(this.state.startMonth4);
        this.setState({
            setPeriodChart2: false,
            setPeriodChart3: false,
            setPeriodChart4: false
        });
        this.loadData();
    }

    // Menutup semua modal
    handleCancel(event) {
        event.preventDefault();

        this.setState({
            isEdit: false,
            isReport: false,
            isExtend: false,
            isReportExtend: false,
            totalServices: 0,
            isAdded: false,
            timeRemaining: null,
            serviceEngineer: [],
            listService: [],
            services: [],
            orderTarget: null,
            orderTargetUpdated: null,
            picEngineerMs: null,
            newNoPO: null,
            actualStart: null,
            actualEnd: null,
            isFailed: false,
            isSuccess: false,
            isError: false,
            messageError: null,
            setPeriodChart2: false,
            startMonth2: null,
            endMonth2: null,
            setPeriodChart3: false,
            startMonth3: null,
            endMonth3: null,
            setPeriodChart4: false,
            startMonth4: null,
            endMonth4: null,
        });
        this.loadData();
    }

    render() {
        const {
            ordersVerified,
            isEdit,
            isExtend,
            orderTarget,
            engineers,
            actualStart,
            actualEnd,
            picEngineerMs,
            isAdded,
            timeRemaining,
            isSuccess,
            isFailed,
            isError,
            messageError,
            servicesEngineer,
            servicesEngineerName,
            isReport,
            isReportExtend,
            orderFiltered,
            isFiltered,
            listService,
            services,
            piBelumSelesaiMsBelumSelesai,
            tepatWaktuTelat,
            piMasuk,
            piSelesai,
            listNamaBulanPi,
            lisNamaBulanMs,
            msMasuk,
            msSelesai,
            setPeriodChart2,
            startMonth2,
            endMonth2,
            setPeriodChart3,
            startMonth3,
            endMonth3,
            setPeriodChart4,
            startMonth4,
            endMonth4
        } = this.state;


    

        return (
            <>
                <div className={classes.container}>
                    <div><h1 className="text-center">Dashboard</h1></div>
                    <Table>
                        <tr>
                            <td>
                                <div><h1 className="text-center">Jumlah Project Installation dan Managed Services yang Belum Selesai</h1> </div>
                                <Table>
                                    <tr>
                                        <td><h1>{this.state.piBelumSelesai}</h1></td>
                                        <td><h1>{this.state.msBelumSelesai}</h1></td>
                                    </tr>
                                    <tr>
                                        <td><h3>Project Installation</h3></td>
                                        <td><h3>Managed Services</h3></td>
                                    </tr>
                                </Table>
                            </td>
                            <td>
                                <div><h1 className="text-center">Persentase Penyelesaian Tepat Waktu</h1></div>
                                <DoughnutChart data={this.state.tepatWaktuTelat}></DoughnutChart>
                                <Button
                                    className={classes.button2}
                                    onClick={() => this.handleSetPeriodChart2()}
                                >
                                    Set Period
                                </Button>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div><h1 className="text-center">Jumlah Project Installation yang Masuk dan Selesai</h1></div>
                                <BarChart namaBulan={this.state.listNamaBulanPi} masuk={this.state.piMasuk} selesai={this.state.piSelesai}></BarChart>
                                <Button
                                    className={classes.button2}
                                    onClick={() => this.handleSetPeriodChart3()}
                                >
                                    Set Period
                                </Button>
                            </td>
                            <td>
                                <div><h1 className="text-center">Jumlah Managed Services yang Masuk dan Selesai</h1></div>
                                <BarChart namaBulan={this.state.listNamaBulanMs} masuk={this.state.msMasuk} selesai={this.state.msSelesai}></BarChart>
                                <Button
                                    className={classes.button2}
                                    onClick={() => this.handleSetPeriodChart4()}
                                >
                                    Set Period
                                </Button>
                            </td>
                        </tr>
                    </Table>
                    <Modal
                        show={setPeriodChart2}
                        dialogClassName="modal-90w"
                        aria-labelledby="contained-modal-title-vcenter"
                    >
                        <Modal.Header closeButton onClick={this.handleCancel}>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Set Period
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Table borderless responsive="xl" size="sm">

                                    <tr>
                                        <td>
                                            <p>Start Month<p style={{color: "red"}}>*</p></p>
                                        </td>
                                        <td><Form.Control type="text" size="sm" name="startMonth2" className={classes.notes} onChange={this.handleChangeField} placeholder="e.g.: 01_2021"/></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>End Month<p style={{color: "red"}}>*</p></p>
                                        </td>
                                        <td><Form.Control type="text" size="sm" name="endMonth2" className={classes.notes} onChange={this.handleChangeField} placeholder="e.g.: 12_2021"/></td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "red"}}>*Wajib diisi</td>
					<td style={{color: "red"}}>Format: bulan_tahun</td>
                                        <td className="d-flex justify-content-end">
                                            <Button variant="primary" className={classes.button1} onClick={this.handleAfterSetPeriod}>
                                                Simpan
                                            </Button>
                                        </td>
                                    </tr>
                                </Table>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    <Modal
                        show={setPeriodChart3}
                        dialogClassName="modal-90w"
                        aria-labelledby="contained-modal-title-vcenter"
                    >
                        <Modal.Header closeButton onClick={this.handleCancel}>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Set Period
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Table borderless responsive="xl" size="sm">

                                    <tr>
                                        <td>
                                            <p>Start Month<p style={{color: "red"}}>*</p></p>
                                        </td>
                                        <td><Form.Control type="text" size="sm" name="startMonth3" className={classes.notes} onChange={this.handleChangeField} placeholder="e.g.: 01_2021"/></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>End Month<p style={{color: "red"}}>*</p></p>
                                        </td>
                                        <td><Form.Control type="text" size="sm" name="endMonth3" className={classes.notes} onChange={this.handleChangeField} placeholder="e.g.: 12_2021"/></td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "red"}}>*Wajib diisi</td>
					<td style={{color: "red"}}>Format: bulan_tahun</td>
                                        <td className="d-flex justify-content-end">
                                            <Button variant="primary" className={classes.button1} onClick={this.handleAfterSetPeriod}>
                                                Simpan
                                            </Button>
                                        </td>
                                    </tr>
                                </Table>
                            </Form>
                        </Modal.Body>
                    </Modal>
                    <Modal
                        show={setPeriodChart4}
                        dialogClassName="modal-90w"
                        aria-labelledby="contained-modal-title-vcenter"
                    >
                        <Modal.Header closeButton onClick={this.handleCancel}>
                            <Modal.Title id="contained-modal-title-vcenter">
                                Set Period
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Table borderless responsive="xl" size="sm">

                                    <tr>
                                        <td>
                                            <p>Start Month<p style={{color: "red"}}>*</p></p>
                                        </td>
                                        <td><Form.Control type="text" size="sm" name="startMonth4" className={classes.notes} onChange={this.handleChangeField} placeholder="e.g.: 01_2021"/></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <p>End Month<p style={{color: "red"}}>*</p></p>
                                        </td>
                                        <td><Form.Control type="text" size="sm" name="endMonth4" className={classes.notes} onChange={this.handleChangeField} placeholder="e.g.: 12_2021"/></td>
                                    </tr>
                                    <tr>
                                        <td style={{color: "red"}}>*Wajib diisi</td>
					<td style={{color: "red"}}>Format: bulan_tahun</td>
                                        <td className="d-flex justify-content-end">
                                            <Button variant="primary" className={classes.button1} onClick={this.handleAfterSetPeriod}>
                                                Simpan
                                            </Button>
                                        </td>
                                    </tr>
                                </Table>
                            </Form>
                        </Modal.Body>
                    </Modal>
                </div>
            </>

        );
    }
}

export default Dashboard;
