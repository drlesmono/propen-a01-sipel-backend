import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import CustomizedTables from "../../components/Table";
import classes from "./styles.module.css";
import { withRouter } from "react-router-dom";

class InputDataOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
        };
        this.handleTambahOrder = this.handleTambahOrder.bind(this);
        this.handleLookUpDetail = this.handleLookUpDetail.bind(this);
        this.handleClickUnggah = this.handleClickUnggah.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const listOrder  = await APIConfig.get("/orderList");
            this.setState({ orders: listOrder.data });
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

    checkStatusOrder(verif){
        if(verif === true){
            return "Verified";
        }else {
            return "Not Verified";
        }
    }

    handleTambahOrder = () => {
        this.props.history.push(`/order/create`);
    }

    handleLookUpDetail = (order) => {
        this.props.history.push(`/order/detail/${order.idOrder}`);
    }

    handleClickUnggah = (order) => {
        this.props.history.push(`/order/unggah/${order.idOrder}`);
    }

    render() {
        const { orders } = this.state;

        const tableHeaders = [
            'No', 
            'Nomor PO', 
            'Nama Order', 
            'Nama Pelanggan', 
            'Perusahaan Pelanggan',
            'Jenis', 
            'Status', 
            'Lihat Detail',
            'Unggah Dokumen',
        ];

        const tableRows = orders.map((order) => [order.noPO, order.orderName, order.clientName, order.clientOrg,
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.checkStatusOrder(order.verified),
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E"
                            onClick={() => this.handleLookUpDetail(order)}>Lihat</CustomizedButtons>,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => this.handleClickUnggah(order)}>Unggah</CustomizedButtons>]);

        return (
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Daftar Order</h1>
            <br></br>
            <CustomizedButtons
                variant="contained"
                size="medium"
                color="#FD693E"
                onClick={() => this.handleTambahOrder()}>+ Tambah Order</CustomizedButtons>
            <br></br>
            <CustomizedTables headers={tableHeaders} rows={tableRows} />
            </div>
        );
    }
}

export default withRouter(InputDataOrder);