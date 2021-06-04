import React from "react";
import CustomizedTables from "../../components/Table";
import APIConfig from "../../APIConfig";
import classes from "./styles.module.css";
import { withRouter } from "react-router-dom";
import * as moment from "moment";
import { Button, Form } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import authHeader from '../../services/auth-header';

class PenjadwalanMaintenance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrderMs: "",
            orderFiltered: [],
            ordersTerassign: [],
            isFiltered: false,
            isAssigned: false,
            ordersTerassignFiltered: [],
            isError: false,
        };
        this.handleCreateSchedule = this.handleCreateSchedule.bind(this);
        this.handleLookSchedule = this.handleLookSchedule.bind(this);
        this.handleAfterError = this.handleAfterError.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const listOrderTerassigned = await APIConfig.get("/orderMSassigned", { headers: authHeader() });
            this.setState({ ordersTerassign: listOrderTerassigned.data });
        } catch (error) {
            this.setState({ isError: true });
            //alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    checkTypeOrder(pi, ms) {
        if(pi === true && ms === true){
            return "Project Installation, Managed Service";
        }else if(pi === true){
            return "Project Installation";
        }else if(ms === true){
            return "Managed Service";
        }
    }

    getDate(date) {
        let oldDate = new Date(date);
        const month = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                        "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return oldDate.getDate() + " " + month[oldDate.getMonth()] + " " + oldDate.getFullYear();

    }

    handleCreateSchedule = (idOrderMs) => {
        this.props.history.push(`/produksi/maintenance/create/${idOrderMs}`);
    }

    handleLookSchedule = (idOrderMs) => {
        this.props.history.push(`/produksi/maintenance/look-update/${idOrderMs}`);
    }

    handleFilter(event){
        let newOrdersAssigned = this.state.ordersTerassign;
        const { value } = event.target;
        if( value !== "" ){
            newOrdersAssigned = this.state.ordersTerassign.filter(order => {
                return (order.idOrder.noPO.toLowerCase().includes(value.toLowerCase()) || 
                order.idOrder.clientName.toLowerCase().includes(value.toLowerCase()) ||
                order.idOrder.clientOrg.toLowerCase().includes(value.toLowerCase()) ||
                this.getDate(order.actualStart).toLowerCase().includes(value.toLowerCase()) ||
                this.getDate(order.actualEnd).toLowerCase().includes(value.toLowerCase()) ||
                order.idUserPic.fullname.toLowerCase().includes(value.toLowerCase()))
            });
            this.setState({ isFiltered : true });
        }else{
            this.setState({ isFiltered : false });
        }
        this.setState({ ordersTerassignFiltered : newOrdersAssigned });
    }

    handleAfterError = () => {
        this.setState({ isError: false });
    }

    render() {
        const {
            ordersTerassign,
            isFiltered,
            ordersTerassignFiltered,
            isError
        } = this.state;

        const tableHeaders = [
            'No','Nomor PO','Nama Pelanggan','Perusahaan Pelanggan', 'Jenis Order', 
            'Periode Mulai', 'Periode Selesai', 'PIC Engineer','Aksi'
        ];

        const tableRows = isFiltered ? ordersTerassignFiltered.map((order) =>
                        [order.idOrder.noPO, order.idOrder.clientName, order.idOrder.clientOrg, 
                        this.checkTypeOrder(order.idOrder.projectInstallation, order.idOrder.managedService), 
                        this.getDate(order.actualStart), this.getDate(order.actualEnd), order.idUserPic.fullname,
                        <div className="d-flex justify-content-center align-items-center">
                        <Button className={classes.button1} onClick={() => this.handleCreateSchedule(order.idOrderMs)}>Buat Jadwal&nbsp;</Button>
                        <span>&nbsp;&nbsp;</span>
                        <Button className={classes.button2} onClick={() => this.handleLookSchedule(order.idOrderMs)}>Lihat Jadwal</Button>
                        </div>])
                        : ordersTerassign.map((order) =>
                        [order.idOrder.noPO, order.idOrder.clientName, order.idOrder.clientOrg, 
                        this.checkTypeOrder(order.idOrder.projectInstallation, order.idOrder.managedService), 
                        this.getDate(order.actualStart), this.getDate(order.actualEnd), order.idUserPic.fullname,
                        <div className="d-flex justify-content-center align-items-center">
                        <Button className={classes.button1} onClick={() => this.handleCreateSchedule(order.idOrderMs)}>Buat Jadwal&nbsp;</Button>
                        <span>&nbsp;&nbsp;</span>
                        <Button className={classes.button2} onClick={() => this.handleLookSchedule(order.idOrderMs)}>Lihat Jadwal</Button>
                        </div>
                        ]);

        return (
            <div className={classes.container}>
            <br></br>
            <h1 className={classes.title}>Daftar Order</h1>
            <div className="d-flex justify-content-end" style={{padding: 5}}>
                <div className={classes.search}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter}/></div>
            </div>
            <br></br>
            <CustomizedTables headers={tableHeaders} rows={tableRows} />

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

export default withRouter(PenjadwalanMaintenance);