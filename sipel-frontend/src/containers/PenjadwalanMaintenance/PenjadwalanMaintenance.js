import React from "react";
import CustomizedTables from "../../components/Table";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import { withRouter } from "react-router-dom";
import * as moment from "moment";
import { Button } from "react-bootstrap";

class PenjadwalanMaintenance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrderMs: "",
            //ordersMS: [],
            orderFiltered: [],
            //orders: [],
            ordersTerassign: [],
            //ordMSTerassignFromOrdersList: [],
            isFiltered: false,
            isAssigned: false,
        };
        this.handleCreateSchedule = this.handleCreateSchedule.bind(this);
        this.handleLookSchedule = this.handleLookSchedule.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            //const listOrderMS  = await APIConfig.get("/orderMS");
            //const listOrder  = await APIConfig.get("/orderList");
            const listOrderTerassigned = await APIConfig.get("/orderMSassigned");
            //const listOrdMSfromOrders = await APIConfig.get("/orderListIsMS");
            //this.setState({ ordersMS: listOrderMS.data });
            //this.setState({ orders: listOrder.data });
            this.setState({ ordersTerassign: listOrderTerassigned.data });
            //this.setState({ ordMSTerassignFromOrdersList: listOrdMSfromOrders.data });
            //console.log(this.state.ordersMS);
            //console.log(this.state.orders);
            //console.log(this.state.ordersTerassign);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
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

    render() {
        const {
            ordMSTerassignFromOrdersList,
            ordersTerassign
        } = this.state;

        const tableHeaders = [
            'No','Nomor PO','Nama Pelanggan','Perusahaan Pelanggan', 'Jenis Order', 
            'Periode Mulai', 'Periode Selesai', 'PIC Engineer','Buat Penjadwalan','Lihat Penjadwalan',
        ];

        /* const tableRows = ordMSTerassignFromOrdersList.map((order) => order.idOrderMs.idUserPic !== null ?
                        [order.idOrderMs.idOrderMs, order.noPO, order.clientName, order.clientOrg, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService),
                        order.idOrderMs.idUserPic.fullname,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => this.handleCreateSchedule(order)}>Buat Jadwal</CustomizedButtons>,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E"
                            onClick={() => this.handleLookSchedule(order)}>Lihat Jadwal</CustomizedButtons>
                        ] : []
                        ); */

        const tableRows = ordersTerassign.map((order) =>
                        [order.idOrder.noPO, order.idOrder.clientName, order.idOrder.clientOrg, 
                        this.checkTypeOrder(order.idOrder.projectInstallation, order.idOrder.managedService), 
                        this.getDate(order.actualStart), this.getDate(order.actualEnd), order.idUserPic.fullname,
                        <Button className={classes.button1} onClick={() => this.handleCreateSchedule(order.idOrderMs)}>Buat Jadwal&nbsp;</Button>,
                        <Button className={classes.button2} onClick={() => this.handleLookSchedule(order.idOrderMs)}>Lihat Jadwal</Button>
                        ]);

        return (
            <div className={classes.container}>
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Daftar Order</h1>
            <br></br>
            <CustomizedTables headers={tableHeaders} rows={tableRows} />
            </div>
            </div>
        );
    }
}

export default withRouter(PenjadwalanMaintenance);