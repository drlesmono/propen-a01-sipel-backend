import React from "react";
import CustomizedTables from "../../components/Table";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import { withRouter } from "react-router-dom";

class PenjadwalanMaintenance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrderMs: "",
            ordersMS: [],
            orderFiltered: [],
            orders: [],
            ordersTerassign: [],
            ordMSTerassignFromOrdersList: [],
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
            const listOrderMS  = await APIConfig.get("/orderMS");
            const listOrder  = await APIConfig.get("/orderList");
            const listOrderTerassigned = await APIConfig.get("/orderMSassigned");
            const listOrdMSfromOrders = await APIConfig.get("/orderListIsMS");
            this.setState({ ordersMS: listOrderMS.data });
            this.setState({ orders: listOrder.data });
            this.setState({ ordersTerassign: listOrderTerassigned.data });
            this.setState({ ordMSTerassignFromOrdersList: listOrdMSfromOrders.data });
            console.log(this.state.ordersMS);
            console.log(this.state.orders);
            console.log(this.state.ordersTerassign);
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

    handleCreateSchedule = (order) => {
        this.props.history.push(`/produksi/maintenance/create/${order.idOrder}`);
    }

    handleLookSchedule = (order) => {
        this.props.history.push(`/produksi/maintenance/look-update/${order.idOrder}/${order.idOrderMs.idOrderMs}`);
    }

    render() {
        const {
            ordMSTerassignFromOrdersList,
        } = this.state;

        const tableHeaders = [
            'No','Id Managed Service','Nomor PO','Nama Pelanggan','Perusahaan Pelanggan',
            'Jenis Order','PIC Engineer','Buat Penjadwalan','Lihat Penjadwalan',
        ];

        const tableRows = ordMSTerassignFromOrdersList.map((order) => order.idOrderMs.idUserPic !== null ?
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
                        );

        return (
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Daftar Order</h1>
            <br></br>
            <CustomizedTables headers={tableHeaders} rows={tableRows} />
            </div>
        );
    }
}

export default withRouter(PenjadwalanMaintenance);