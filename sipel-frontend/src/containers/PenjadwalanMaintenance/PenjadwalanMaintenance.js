import React from "react";
import CustomizedTables from "../../components/Table";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";

class PenjadwalanMaintenance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrderMs: "",
            ordersMS: [],
            datemn: "",
            listMaintenance: [{ index: Math.random(), datemn: ""}],
            orderFiltered: [],
            orders: [],
            ordersTerassign: [],
            ordMSTerassignFromOrdersList: [],
            isFiltered: false,
            isAssigned: false,
        };
        this.handleFilter = this.handleFilter.bind(this);
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

    handleFilter(event) {
        let newOrderList = this.state.orders;
        const { value } = event.target;
        if(value !== "") {
            newOrderList = this.state.orders.filter(order => {
                return order.orderName.toLowerCase().includes(value.toLowerCase())
            });
            this.setState({ isFiltered: true });
        } else {
            this.setState({ isFiltered: false });
        }
        this.setState({ orderFiltered: newOrderList });
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

    /* getNoPO(idMs) {
        console.log(idMs);
        console.log(this.state.orders)
        const orderTarget = this.state.orders.filter(order => order.idOrderMs.idOrderMs === idMs);
        console.log(orderTarget);
        const noPOnya = orderTarget.map(order => order.noPO);
        return noPOnya;
    }

    getClientName(idMs) {
        let orderTarget = this.state.orders.filter(order => order.idOrderMs.idOrderMs === idMs);
        let clientNamenya = orderTarget.map(order => order.clientName);
        return clientNamenya;
    }

    getClientOrg(idMs) {
        let orderTarget = this.state.orders.filter(order => order.idOrderMs.idOrderMs === idMs);
        let clientOrgnya = orderTarget.map(order => order.clientOrg);
        return clientOrgnya;
    }

    getManagedService(idMs) {
        let orderTarget = this.state.orders.filter(order => order.idOrderMs.idOrderMs === idMs);
        let managedServiceOrd = orderTarget.map(order => order.managedService);
        return managedServiceOrd;
    }

    getProjectInstallation(idMs) {
        let orderTarget = this.state.orders.filter(order => order.idOrderMs.idOrderMs === idMs);
        let projectInstallationOrd = orderTarget.map(order => order.projectInstallation);
        return projectInstallationOrd;
    } */

    render() {
        const {
            datemn,
            ordersMS,
            orders,
            isFiltered,
            orderFiltered,
            ordMSTerassignFromOrdersList,
            ordersTerassign,
        } = this.state;

        let{ listMaintenance } = this.state;

        const tableHeaders = [
            'No',
            'Id Managed Service',
            'Nomor PO',
            'Nama Pelanggan',
            'Perusahaan Pelanggan',
            'Jenis Order',
            'PIC Engineer',
            'Buat Penjadwalan',
            'Lihat Penjadwalan',
        ];

        /* const tableRows = isFiltered ? orderFiltered.map((order) => order.timeRemaining !== 0 && order.idUserPic !== null ?
                        [order.idOrderMs, this.getNoPO(order.idOrderMs), this.getClientName(order.idOrderMs), this.getClientOrg(order.idOrderMs), 
                        this.checkTypeOrder(this.getProjectInstallation(order.idOrderMs), this.getManagedService(order.idOrderMs)),
                        order.idUserPic.fullname,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => this.handleMakeSchedule(order)}>Buat Jadwal</CustomizedButtons>,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E"
                            onClick={() => this.handleLookSchedule(order)}>Lihat Jadwal</CustomizedButtons>
                        ]
                        : [])
                        : ordersMS.map((order) => order.timeRemaining !== 0 && order.idUserPic !== null ?
                        [order.idOrderMs, this.getNoPO(order.idOrderMs), this.getClientName(order.idOrderMs), this.getClientOrg(order.idOrderMs), 
                        this.checkTypeOrder(this.getProjectInstallation(order.idOrderMs), this.getManagedService(order.idOrderMs)),
                        order.idUserPic.fullname,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => this.handleMakeSchedule(order)}>Buat Jadwal</CustomizedButtons>,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E"
                            onClick={() => this.handleLookSchedule(order)}>Lihat Jadwal</CustomizedButtons>
                        ]
                        : []
                        ); */

        /* const tableRows = isFiltered ? orderFiltered.map((order) => order.managedService ?
                        [order.idOrderMs.idOrderMs, order.noPO, order.clientName, order.clientOrg, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService),
                        order.idOrderMs.idUserPic.fullname,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => this.handleMakeSchedule(order)}>Buat Jadwal</CustomizedButtons>,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E"
                            onClick={() => this.handleLookSchedule(order)}>Lihat Jadwal</CustomizedButtons>
                        ] : []
                       )
                        : orders.map((order) => order.managedService ? order.idOrderMs.idUserPic !== null ?
                        [order.idOrderMs.idOrderMs, order.noPO, order.clientName, order.clientOrg, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService),
                        order.idOrderMs.idUserPic.fullname,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => this.handleMakeSchedule(order)}>Buat Jadwal</CustomizedButtons>,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E"
                            onClick={() => this.handleLookSchedule(order)}>Lihat Jadwal</CustomizedButtons>
                        ] : [] : []
                        ); */

        const tableRows = ordMSTerassignFromOrdersList.map((order) => order.idOrderMs.idUserPic !== null ?
                        [order.idOrderMs.idOrderMs, order.noPO, order.clientName, order.clientOrg, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService),
                        order.idOrderMs.idUserPic.fullname,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => {this.props.history.push("/produksi/maintenance/create")}}>Buat Jadwal</CustomizedButtons>,
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

export default PenjadwalanMaintenance;