import React from "react";
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

export default withRouter(LookUpdateMaintenance);