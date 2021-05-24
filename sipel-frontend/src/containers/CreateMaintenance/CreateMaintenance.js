import React from "react";
import APIConfig from "../../APIConfig";
import CustomizedButtons from "../../components/Button";
import classes from "./styles.module.css";
import TableMaintenanceDetail from "../../components/Maintenance/mnTableDetail";
import MaintenanceList from "../../components/Maintenance/maintenanceList";
import { withRouter } from "react-router-dom";

class CreateMaintenance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrder: this.props.match.params.id,
            listMaintenance: [{ index: Math.random(), dateMn: ""}],
            orderTarget: null,
            idOrderMs: "",
            noPO: "",
            clientName: "",
            clientOrg: "",
            fullname: "",
        };
        this.handleLookDetail = this.handleLookDetail.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.clickOnDelete = this.clickOnDelete.bind(this);
        this.handleSubmitCreateMaintenance = this.handleSubmitCreateMaintenance.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orderItem  = await APIConfig.get(`/order/detail/${this.state.idOrder}`);
            this.setState({ orderTarget: orderItem.data });
            this.handleLookDetail();
            //console.log(this.state.orderTarget);
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
                const data = {
                    dateMn: this.state.listMaintenance[i].dateMn,
                    maintained: true,
                };
                //console.log(this.state.listMaintenance[i].dateMn);
                await APIConfig.post(`/produksi/maintenance/tambah/${this.state.idOrderMs}`, data);
                this.loadData();
            }
            this.handleReportSubmitMS(event);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleCancelSubmit = () => {
        this.props.history.push(`/produksi/maintenance`);
    }

    render() {
        let{ listMaintenance } = this.state;

        return (
            <div className="content">
            <br></br>
            <h1 className={classes.title}>Buat Penjadwalan Maintenance</h1>
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
                            <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitCreateMaintenance}>
                                Simpan
                            </CustomizedButtons>
                            <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={() => this.handleCancelSubmit}>
                                Batal
                            </CustomizedButtons>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        );
    }
}

export default withRouter(CreateMaintenance);