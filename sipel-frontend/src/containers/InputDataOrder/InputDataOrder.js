import React from "react";
import ServiceList from "../../components/Services/serviceList";
import Order from "../../components/Order/orderDetail";
import ProjectInstallation from "../../components/ProjectInstallation/piDetail";
import ManagedService from "../../components/ManagedService/msDetail";
import Service from "../../components/Services/serviceDetail";
import APIConfig from "../../APIConfig";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
import Modal from "../../components/Modal";
import classes from "./styles.module.css";
import { Form } from "react-bootstrap";

const initState = {
    noPO: "",
    noSPH: "",
    orderName: "",
    description: "",
    projectInstallation: false,
    managedService: false,
    startPI: "",
    deadline: "",
    actualStart: "",
    actualEnd: "",
    listService: [{ index: Math.random(), name: ""}],
    clientName: "",
    clientDiv: "",
    clientPIC: "",
    clientOrg: "",
    clientPhone: "",
    clientEmail: "",
    dateOrder: "",
    verified: false,
    isLoading:false,
    orderTarget: null,
    isSubmit: false,
    isEdit: false,
    isCreate: false,
    isUpload: false,
}

class InputDataOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrder: null,
            idOrderMs: null,
            idOrderPi: null,
            noPO: "",
            noSPH: "",
            orderName: "",
            description: "",
            projectInstallation: false,
            managedService: false,
            startPI: "",
            deadline:"",
            actualStart: "",
            actualEnd: "",
            listService: [{ index: Math.random(), name: ""}],
            clientName: "",
            clientDiv: "",
            clientPIC: "",
            clientOrg: "",
            clientPhone: "",
            clientEmail: "",
            dateOrder: "",
            verified: false,
            orders: [],
            isLoading:false,
            isCreate: false,
            isEdit: false,
            orderTarget: null,
            isSubmit: false,
            isSubmitPeriode: false,
            close: false,
            percentage: 0.0,
            finishLoad: false,
            orderFiltered: [],
            isFiltered: false,
            activated: false,
            isAdd: false,
            isShowDetail: false,
            ordersMS: [],
            isUpload: false,
            selectedFile: null,
            isEditableChild: false,
            child: {
                orderNameSubmit: "",
                noPOSubmit: "",
                noSPHSubmit: "",
                descriptionSubmit: "",
                isProjectInstallation: false,
                isManagedService: false,
                clientNameSubmit: "",
                clientDivSubmit: "",
                clientPICSubmit: "",
                clientOrgSubmit: "",
                clientPhoneSubmit: "",
                clientEmailSubmit: "",
                dateOrderSubmit: "",
                startPISubmit: "",
                deadlineSubmit: "",
                actualStartSubmit: "",
                actualEndSubmit: "",
                isSubmitOrder: false,
                isCreateChild: false,
                isSubmitOrderMS: false,
                isVerifiedSubmit: false,
            },
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleTambahOrder = this.handleTambahOrder.bind(this);
        this.handleEditOrder = this.handleEditOrder.bind(this);
        //this.handleDetailOrder = this.handleDetailOrder.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.addNewRow = this.addNewRow.bind(this);
        this.deleteRow = this.deleteRow.bind(this);
        this.handleReportSubmitPI = this.handleReportSubmitPI.bind(this);
        this.handleAfterSubmitOrder = this.handleAfterSubmitOrder.bind(this);
        this.handleSubmitTambahOrder = this.handleSubmitTambahOrder.bind(this);
        this.clickOnDelete = this.clickOnDelete.bind(this);
        this.handleSubmitTambahPI = this.handleSubmitTambahPI.bind(this);
        this.handleSubmitTambahMS = this.handleSubmitTambahMS.bind(this);
        this.handleSubmitTambahService = this.handleSubmitTambahService.bind(this);
        this.handleSubmitEditOrder = this.handleSubmitEditOrder.bind(this);
        this.handleReportSubmitMS = this.handleReportSubmitMS.bind(this);
        this.handleToService = this.handleToService.bind(this);
        //this.handleSubmitTambahPIMS = this.handleSubmitTambahPIMS.bind(this);
        this.handleClickUnggah = this.handleClickUnggah.bind(this);
        this.handleUploadDokumen = this.handleUploadDokumen.bind(this);
        this.handleSubmitEditPI = this.handleSubmitEditPI.bind(this);
    }
  
    handleChange = (e) => {
        if (["name"].includes(e.target.name)) {
            let listService = [...this.state.listService]
            listService[e.target.dataset.id][e.target.name] = e.target.value;
        }
        if (e.target.checked !== "projectInstallation" && e.target.checked !== "managedService" && !["name"].includes(e.target.name)) {
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    addNewRow = () => {
        this.setState((prevState) => ({
            listService: [...prevState.listService, { index: Math.random(), name: "" }],
        }));
    }

    deleteRow = (index) => {
        this.setState({
            listService: this.state.listService.filter((s, sindex) => index !== sindex),
        });
    }

    clickOnDelete(record) {
        this.setState({
            listService: this.state.listService.filter(r => r !== record)
        });
    }

    handleTambahOrder() {
        this.setState({ isCreate: true });
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({ isCreate: false, isEdit: false , isEditableChild: false, isShowDetail: false, ...initState });
    }

    componentDidMount() {
        this.loadData();
    }

    /* handleAfterLoad() {
        this.setState({ child: {idOrder: this.state.orders[this.state.orders.length - 1].idOrder}});
        console.log(this.state.child.idOrder);
    } */

    async loadData() {
        try {
            const listOrder  = await APIConfig.get("/orderList");
            const listOrderMS  = await APIConfig.get("/orderMS");
            this.setState({ orders: listOrder.data });
            this.setState({ ordersMS: listOrderMS.data });
            //console.log(this.state.ordersMS);
            //this.handleAfterLoad();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        //this.setState({ finishLoad: true });
    }

    async handleSubmitTambahOrder(event) {
        event.preventDefault();
        try {
            const data = {
                noPO: this.state.noPO,
                noSPH: this.state.noSPH,
                orderName: this.state.orderName,
                description: this.state.description,
                projectInstallation: this.state.projectInstallation,
                managedService: this.state.managedService,
                clientName: this.state.clientName,
                clientDiv: this.state.clientDiv,
                clientPIC: this.state.clientPIC,
                clientOrg: this.state.clientOrg,
                clientPhone: this.state.clientPhone,
                clientEmail: this.state.clientEmail,
                dateOrder: this.state.dateOrder,
            }
            await APIConfig.post("/order/tambah", data);
            this.handleAfterSubmitOrder(event);
            this.loadData();
        } catch (error) {
            alert("Order Gagal Disimpan. Coba Kembali!");
            console.log(error);
        }
        //this.handleAfterSubmitOrder(event);
        this.handleCancel(event);
    }

    async handleSubmitEditOrder(event) {
        event.preventDefault();
        try {
            const data = {
                noPO: this.state.noPO,
                noSPH: this.state.noSPH,
                orderName: this.state.orderName,
                description: this.state.description,
                projectInstallation: this.state.projectInstallation,
                managedService: this.state.managedService,
                clientName: this.state.clientName,
                clientDiv: this.state.clientDiv,
                clientPIC: this.state.clientPIC,
                clientOrg: this.state.clientOrg,
                clientPhone: this.state.clientPhone,
                clientEmail: this.state.clientEmail,
                dateOrder: this.state.dateOrder,
            }
            await APIConfig.put(`/order/ubah/${this.state.idOrder}`, data);
            this.loadData();
            this.setState({ isEditableChild: true });
        } catch (error) {
            alert("Order Gagal Diperbarui. Coba Kembali!");
            console.log(error);
        }
        this.handleAfterSubmitOrder(event);
        this.handleCancel(event);
    }

    handleAfterSubmitOrder(event) {
        event.preventDefault();
        this.setState({
            child: {
                isProjectInstallation: this.state.projectInstallation,
                isManagedService: this.state.managedService,
                isSubmitOrder: true,
                orderNameSubmit: this.state.orderName,
                noPOSubmit:this.state.noPO,
                noSPHSubmit: this.state.noSPH,
                descriptionSubmit: this.state.description,
                clientNameSubmit: this.state.clientName,
                clientDivSubmit: this.state.clientDiv,
                clientPICSubmit: this.state.clientPIC,
                clientOrgSubmit: this.state.clientOrg,
                clientPhoneSubmit: this.state.clientPhone,
                clientEmailSubmit: this.state.clientEmail,
                dateOrderSubmit: this.state.dateOrder,
                isCreateChild: true,
            }
        });
        //this.handleCancel(event);
    }

    async handleSubmitTambahPI(event) {
        event.preventDefault();
        try {
            const data = {
                startPI: this.state.startPI,
                deadline: this.state.deadline,
                percentage: this.state.percentage,
                close: this.state.close,
            }
            console.log(this.state.idOrder);
            await APIConfig.post(`/order/tambah/PI/${this.state.idOrder}`, data);
            this.loadData();
            this.handleReportSubmitPI(event);
            console.log(event);
        } catch (error) {
            alert("Data Project Installation gagal disimpan! Masukkan kembali tanggal mulai dan selesai project!");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async handleSubmitEditPI(event) {
        event.preventDefault();
        try {
            const data = {
                startPI: this.state.child.startPISubmit,
                deadline: this.state.child.deadlineSubmit,
                percentage: this.state.percentage,
                close: this.state.close,
            }
            console.log(this.state.idOrder);
            await APIConfig.post(`/order/ubah/PI/${this.state.idOrderPi}`, data);
            this.loadData();
            this.handleReportSubmitPI(event);
            console.log(event);
        } catch (error) {
            alert("Data Project Installation gagal disimpan! Masukkan kembali tanggal mulai dan selesai project!");
            console.log(error);
        }
        this.handleCancel(event);
    }

    async handleSubmitTambahMS(event) {
        event.preventDefault();
        try {
            const data = {
                actualStart: this.state.actualStart,
                actualEnd: this.state.actualEnd,
                activated: this.state.activated,
            };
            await APIConfig.post(`/order/tambah/MS/${this.state.idOrder}`, data);
            this.loadData();
            this.handleToService(event);
        } catch (error) {
            alert("Data Managed Service gagal disimpan! Masukkan kembali tanggal periode kontrak!");
            console.log(error);
        }
        this.handleCancel(event);
    }

    /* async handleEditTambahMS(event) {
        event.preventDefault();
        try {
            const data = {
                actualStart: this.state.actualStart,
                actualEnd: this.state.actualEnd,
                activated: this.state.activated,
            };
            await APIConfig.post(`/order/ubah/MS/${this.state.idOrder}`, data);
            this.loadData();
            this.handleToService(event);
        } catch (error) {
            alert("Data Managed Service gagal disimpan! Masukkan kembali tanggal periode kontrak!");
            console.log(error);
        }
        this.handleCancel(event);
    } */

    /* async handleSubmitTambahPIMS(event) {
        event.preventDefault();
        try {
            const dat = {
                startPI: this.state.startPI,
                deadline: this.state.deadline,
                percentage: this.state.percentage,
                close: this.state.close,
            }
            await APIConfig.post(`/order/tambah/PI/${this.state.idOrder}`, data);
            this.loadData();
            const data = {
                actualStart: this.state.actualStart,
                actualEnd: this.state.actualEnd,
                activated: this.state.activated,
            };
            await APIConfig.post(`/order/tambah/MS/${this.state.idOrder}`, data);
            this.loadData();
            this.handleToService(event);
        } catch (error) {
            alert("Data Project Installation dan Managed Service gagal disimpan! Masukkan kembali tanggal instalasi dan periode kontrak!");
            console.log(error);
        }
        this.handleCancel(event);
    } */

    handleToService(event){
        event.preventDefault();
        this.setState({ child: {isSubmitOrderMS: true}});
    }

    async handleSubmitTambahService(event) {
        event.preventDefault();
        try {
            for (let i=0; i<this.state.listService.length;i++) {
                const data = {
                    name: this.state.listService[i].name,
                };
                console.log(this.state.listService[i].name);
                await APIConfig.post(`/order/tambah/MS/${this.state.idOrderMs}/Service`, data);
                this.loadData();
            }
            this.handleReportSubmitMS(event);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    }

    /* async handleSubmitEditService(event) {
        event.preventDefault();
        try {
            for (let i=0; i<this.state.listService.length;i++) {
                const data = {
                    name: this.state.listService[i].name,
                };
                console.log(this.state.listService[i].name);
                await APIConfig.post(`/order/tambah/MS/${this.state.idOrderMs}/Service`, data);
                this.loadData();
            }
            this.handleReportSubmitMS(event);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
        this.handleCancel(event);
    } */

    async handleUploadDokumen(event) {
        event.preventDefault();
        try {
            const formData = {
                file: this.state.selectedFile,
            };
            await APIConfig.post(`order/${this.state.idOrder}/upload`, formData);
            this.loadData();
            this.setState({ isUpload: false });
            alert("File Uploaded Successfully");
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleReportSubmitPI(event) {
        event.preventDefault();
        alert("Data Order PI berhasil ditambahkan!")
        this.handleCancel(event);
    }

    handleReportSubmitMS(event) {
        event.preventDefault();
        alert("Data Order dan Service berhasil ditambahkan!")
        this.handleCancel(event);
    }

    checkTypeOrder(pi, ms){
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

    /* getIdOrder(){
        let newListOrder = this.state.orders;
        newListOrder = this.state.orders[this.state.orders.length - 1].idOrder;
        console.log(newListOrder);
        return newListOrder;
    } */

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

    handleEditOrder(order) {
        this.setState({
            isEdit: true,
            //isEditableChild: true,
            idOrder: order.idOrder,
            noPO: order.noPO,
            noSPH: order.noSPH,
            orderName: order.orderName,
            description: order.description,
            clientName: order.clientName,
            clientDiv: order.clientDiv,
            clientOrg: order.clientOrg,
            clientPIC: order.clientPIC,
            clientPhone: order.clientPhone,
            clientEmail: order.clientEmail,
            projectInstallation: order.projectInstallation,
            managedService: order.managedService,
            dateOrder: order.dateOrder,
        })
        if (order.projectInstallation) {
            this.setState({
                idOrderPi: order.idOrderPi.idOrderPi,
                child: {
                    startPISubmit: order.idOrderPi.startPI,
                    deadlineSubmit: order.idOrderPi.deadline,
                }
            });
        }
        if (order.managedService) {
            this.setState({
                idOrderMs: order.idOrderMs.idOrderMs,
                child: {
                    actualStartSubmit: order.idOrderMs.actualStart,
                    actualEndSubmit: order.idOrderMs.actualEnd,
                }
            })
        }
    }

    /* handleEditPI(pi) {
        this.setState({
            isEditableChild: true,
            idOrder: pi.idOrderPi,
            startPI:pi.startPI,
            deadline: pi.deadline,
            percentage: pi.percentage,
            close: pi.close,
        })
    }

    handleEditMS(ms) {
        this.setState({
            isEditableChild: true,
            idOrder: ms.idOrderPi,
            actualStart: ms.actualStart,
            actualEnd: ms.actualEnd,
            activated: ms.activated,
        })
    }
 */

    async lookUpDetail(order) {
        try {
            const orderItem  = await APIConfig.get(`/order/detail/${order.idOrder}`);
            this.setState({ orderTarget: orderItem.data });
            //console.log(this.state.orderTarget);
            //this.setState({ isShowDetail: true });
            this.handleDetail(this.state.orderTarget);
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleDetail(orderTarget) {
        console.log(this.state.orderTarget);
        let order = this.state.orderTarget;
        console.log(order);
        this.setState({ 
            isShowDetail: true,
            idOrder: order.idOrder,
            noPO: order.noPO,
            noSPH: order.noSPH,
            orderName: order.orderName,
            description: order.description,
            clientName: order.clientName,
            clientDiv: order.clientDiv,
            clientOrg: order.clientOrg,
            clientPIC: order.clientPIC,
            clientPhone: order.clientPhone,
            clientEmail: order.clientEmail,
            projectInstallation: order.projectInstallation,
            managedService: order.managedService,
            dateOrder: order.dateOrder,
        });
        if (order.projectInstallation) {
            this.setState({
                idOrderPi: order.idOrderPi.idOrderPi,
                startPI: order.idOrderPi.startPI,
                deadline: order.idOrderPi.deadline,
                percentage: order.idOrderPi.percentage,
                close: order.idOrderPi.close,
            })
        }
        if (order.managedService) {
            this.setState({
                idOrderMs: order.idOrderMs.idOrderMs,
                actualStart: order.idOrderMs.actualStart,
                actualEnd: order.idOrderMs.actualEnd
            })
        }
    }

    handleClickUnggah(order) {
        this.setState({ 
            isUpload: true,
            idOrder: order.idOrder });
    }

    onFileChange = (e) => {
        e.preventDefault();
        this.setState({ selectedFile: e.target.files[0]});
    }

    render() {
        const { 
            idOrder,
            noPO,
            noSPH,
            orderName,
            description,
            projectInstallation,
            managedService,
            startPI,
            deadline,
            actualStart,
            actualEnd,
            listServices,
            clientName,
            clientDiv,
            clientPIC,
            clientOrg,
            clientPhone,
            clientEmail,
            dateOrder,
            verified,
            orders,
            orderFiltered,
            ordersMS,
            orderTarget,
            isFiltered,
            child: {
                startPISubmit,
                deadlineSubmit,
                actualStartSubmit,
                actualEndSubmit,
            }
        } = this.state;

        let { listService } = this.state;
        const tableHeaders = [
            'No',
            'Id Order', 
            'Nomor PO', 
            'Nama Order', 
            'Nama Pelanggan', 
            'Perusahaan Pelanggan',
            'Jenis', 
            'Status', 
            'Ubah Order',
            'Lihat Detail',
            'Unggah Dokumen',
        ];
        
        const tableRows = isFiltered ? orderFiltered.map((order) =>
                        [order.idOrder, order.noPO, order.orderName, order.clientName, order.clientOrg,
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.checkStatusOrder(order.verified),
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => this.handleEditOrder(order)}>Ubah</CustomizedButtons>, 
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E"
                            onClick={() => this.lookUpDetail(order)}>Lihat</CustomizedButtons>,
                        <CustomizedButtons 
                            variant="contained" 
                            size="small" 
                            color="#FD693E" 
                            onClick={() => this.handleClickUnggah(order)}>Unggah</CustomizedButtons>])
                        : orders.map((order) => [order.idOrder, order.noPO, order.orderName, order.clientName, order.clientOrg,
                            this.checkTypeOrder(order.projectInstallation, order.managedService), 
                            this.checkStatusOrder(order.verified),
                            <CustomizedButtons 
                                variant="contained" 
                                size="small" 
                                color="#FD693E" 
                                onClick={() => this.handleEditOrder(order)}>Ubah</CustomizedButtons>,
                            <CustomizedButtons 
                                variant="contained" 
                                size="small" 
                                color="#FD693E"
                                onClick={() => this.lookUpDetail(order)}>Lihat</CustomizedButtons>,
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
                onClick={this.handleTambahOrder}>Tambah Order</CustomizedButtons>
            <br></br>
            <CustomizedTables headers={tableHeaders} rows={tableRows} />

            <Modal show={this.state.isCreate || this.state.isEdit} handleCloseModal={this.handleCancel}>
            <NotificationContainer />
                <form>
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">
                                {this.state.isCreate ? "Tambah Order" : `Ubah Data Order ${this.state.child.orderNameSubmit}`}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Nomor PO</label>
                                                <input 
                                                    type="text" 
                                                    name="noPO" 
                                                    id="noPO" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nomor PO" 
                                                    value={noPO} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Nama Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientName" 
                                                    id="clientName" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nama" 
                                                    value={clientName} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>No.Telp Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientPhone" 
                                                    id="clientPhone" 
                                                    className="form-control" 
                                                    placeholder="Masukkan No.Telp" 
                                                    value={clientPhone} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Nomor SPH</label>
                                                <input 
                                                    type="text"  
                                                    name="noSPH" 
                                                    id="noSPH" 
                                                    className="form-control" 
                                                    placeholder="Masukkan No.SPH" 
                                                    value={noSPH} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label>Divisi Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientDiv" 
                                                    id="clientDiv" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Divisi" 
                                                    value={clientDiv} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group ">
                                                <label className="required">Email Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientEmail" 
                                                    id="clientEmail" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Email" 
                                                    value={clientEmail} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Nama Order</label>
                                                <input 
                                                    type="text"  
                                                    name="orderName" 
                                                    id="orderName" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Nama Order" 
                                                    value={orderName} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">PIC Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientPIC" 
                                                    id="clientPIC" 
                                                    className="form-control" 
                                                    placeholder="Masukkan PIC" 
                                                    value={clientPIC} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <label className="required">Jenis Order</label>
                                            <div className="form-check">
                                                {this.state.isCreate ? 
                                                <input
                                                    type="checkbox" 
                                                    name="projectInstallation" 
                                                    id="projectInstallation" 
                                                    className="form-check-input" 
                                                    value={projectInstallation}
                                                    checked={projectInstallation} 
                                                    onChange={(e) => this.setState(prevState => ({
                                                        projectInstallation: !prevState.projectInstallation
                                                    }))} /> 
                                                : <input disabled
                                                type="checkbox" 
                                                name="projectInstallation" 
                                                id="projectInstallation" 
                                                className="form-check-input" 
                                                value={projectInstallation}
                                                checked={projectInstallation} 
                                                onChange={(e) => this.setState(prevState => ({
                                                    projectInstallation: !prevState.projectInstallation
                                                }))} />}
                                                <label className="form-check-label">Project Installation</label>
                                            </div>
                                            <div className="form-check">
                                                {this.state.isCreate ? 
                                                <input 
                                                    type="checkbox" 
                                                    name="managedService" 
                                                    id="managedService" 
                                                    className="form-check-input"
                                                    value={managedService}  
                                                    checked={managedService} 
                                                    onChange={(e) => this.setState(prev => ({
                                                        managedService: !prev.managedService
                                                    }))} />
                                                : <input disabled
                                                    type="checkbox" 
                                                    name="projectInstallation" 
                                                    id="projectInstallation" 
                                                    className="form-check-input" 
                                                    value={projectInstallation}
                                                    checked={projectInstallation} 
                                                    onChange={(e) => this.setState(prevState => ({
                                                        projectInstallation: !prevState.projectInstallation
                                                    }))} /> }
                                                <label className="form-check-label">Managed Services</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Deskripsi Order</label>
                                                <input 
                                                    type="text"  
                                                    name="description" 
                                                    id="description" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Deskripsi" 
                                                    value={description} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Perusahaan Pelanggan</label>
                                                <input 
                                                    type="text" 
                                                    name="clientOrg" 
                                                    id="clientOrg" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Perusahaan" 
                                                    value={clientOrg} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-4">
                                            <div className="form-group">
                                                <label className="required">Tanggal Masuk Order</label>
                                                <input 
                                                    type="date" 
                                                    name="dateOrder" 
                                                    id="dateOrder" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Order" 
                                                    value={dateOrder} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.state.isCreate ? this.handleSubmitTambahOrder : this.handleSubmitEditOrder}>
                                        Simpan Order
                                    </CustomizedButtons>
                                </div> 
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        
           <Modal show={this.state.child.isProjectInstallation && !this.state.child.isManagedService && this.state.child.isSubmitOrder} handleCloseModal={this.handleCancel}>
                    <NotificationContainer />
                    <form onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">
                                    {this.state.child.isCreateChild ? "Tambah Data PI" : `Ubah Data Order PI ${this.state.child.orderNameSubmit}`}
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label className="required">ID Order</label>
                                            {this.state.child.isCreateChild ? 
                                            <Form.Control as="select" size="md" name="idOrder" id="idOrder" onChange={this.handleChange}>
                                                {orders.map(order => <option value={order.idOrder}>{order.idOrder}</option>)}
                                            </Form.Control>
                                            : <Form.Control as="select" size="md" name="idOrder" id="idOrder" onChange={this.handleChange} disabled>
                                            {orders.map(order => <option value={order.idOrder}>{order.idOrder}</option>)}
                                            </Form.Control>
                                        }
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required">Tanggal Mulai Project</label>
                                                {this.state.child.isCreateChild ? 
                                                <input 
                                                    type="date" 
                                                    name="startPI" 
                                                    id="startPI" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Mulai" 
                                                    value={startPI} 
                                                    onChange={this.handleChange} />
                                                : <input 
                                                type="date" 
                                                name="startPISubmit" 
                                                id="startPISubmit" 
                                                className="form-control" 
                                                placeholder="Masukkan Tanggal Mulai" 
                                                value={this.state.child.startPISubmit} 
                                                onChange={this.handleChange} />}
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required">Tanggal Selesai Project</label>
                                                {this.state.child.isCreateChild ? 
                                                <input 
                                                    type="date" 
                                                    name="deadline" 
                                                    id="deadline" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Selesai" 
                                                    value={deadline} 
                                                    onChange={this.handleChange} />
                                                : <input 
                                                type="date" 
                                                name="deadline" 
                                                id="deadline" 
                                                className="form-control" 
                                                placeholder="Masukkan Tanggal Selesai" 
                                                value={this.state.child.deadlineSubmit} 
                                                onChange={this.handleChange} />}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahPI} >
                                        Simpan Data PI
                                    </CustomizedButtons>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>

            <Modal show={this.state.isEditableChild} handleCloseModal={this.handleCancel}>
                    <NotificationContainer />
                    <form onChange={this.handleChange} >
                        <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                        <div className="col-sm-10">
                            <div className="card">
                                <div className="card-header text-center">
                                    Ubah Data Order PI
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <label className="required">ID Order</label>
                                            <Form.Control as="select" size="md" name="idOrder" id="idOrder" onChange={this.handleChange} disabled>
                                            {orders.map(order => <option value={order.idOrder}>{order.idOrder}</option>)}
                                            </Form.Control>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required">Tanggal Mulai Project</label>
                                                <input 
                                                    type="date" 
                                                    name="startPISubmit" 
                                                    id="startPISubmit" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Mulai" 
                                                    value={this.state.child.startPISubmit} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                        <div className="col-sm-6">
                                            <div className="form-group">
                                                <label className="required">Tanggal Selesai Project</label>
                                                <input 
                                                    type="date" 
                                                    name="deadline" 
                                                    id="deadline" 
                                                    className="form-control" 
                                                    placeholder="Masukkan Tanggal Selesai" 
                                                    value={this.state.child.deadlineSubmit} 
                                                    onChange={this.handleChange} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-center">
                                    <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitEditPI} >
                                        Simpan Perubahan
                                    </CustomizedButtons>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </Modal>
        
            <Modal show={this.state.child.isManagedService && !this.state.child.isProjectInstallation && this.state.child.isSubmitOrder} handleCloseModal={this.handleCancel} >
                <NotificationContainer />
                <form onSubmit={this.handleSubmitTambahMS} onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header text-center">
                                {this.state.child.isCreateChild ? "Tambah Data MS" : `Ubah Data Nama Order MS ${this.state.child.orderNameSubmit}`}
                            </div>
                            <div className="card-body">
                            <div className="row">
                                <div className="col-sm-6">
                                    <label className="required">ID Order</label>
                                        <Form.Control as="select" size="md" name="idOrder" id="idOrder" onChange={this.handleChange}>
                                            {orders.map(order => <option value={order.idOrder}>{order.idOrder}</option>)}
                                        </Form.Control>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="required">Periode Mulai Managed</label>
                                            <input 
                                                type="date" 
                                                name="actualStart" 
                                                id="actualStart" 
                                                className="form-control" 
                                                placeholder="Masukkan Periode Mulai" 
                                                value={actualStart} 
                                                onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-sm-6">
                                        <div className="form-group">
                                            <label className="required">Periode Selesai Managed</label>
                                            <input 
                                                type="date" 
                                                name="actualEnd" 
                                                id="actualEnd" 
                                                className="form-control" 
                                                placeholder="Masukkan Periode Selesai" 
                                                value={actualEnd} 
                                                onChange={this.handleChange} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer text-center">
                                <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahMS}>
                                    Simpan Data MS
                                </CustomizedButtons>
                            </div>
                        </div>                                            
                    </div>
                    </div>
                </form>
            </Modal>

            <Modal show={this.state.child.isSubmitOrderMS} handleCloseModal={this.handleCancel}>
               <NotificationContainer />
                <form onSubmit={this.handleSubmitTambahService} onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                        <div className="col-sm-1"></div>
                            <div className="col-sm-10">
                                <div className="card">
                                    <div className="card-header text-center">Tambah Services</div>
                                    <div className="card-body">
                                        <div className="row">
                                        <div className="col-sm-6">
                                            <label className="required">ID Order</label>
                                            <Form.Control as="select" size="md" name="idOrderMs" id="idOrderMs" onChange={this.handleChange}>
                                                {ordersMS.map(orderMS => <option value={orderMS.idOrderMs}>{orderMS.idOrderMs}</option>)}
                                            </Form.Control>
                                        </div>
                                        </div>
                                        <table className="table">
                                        <thead>
                                            <tr>
                                                <th className="required">Nama Services</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <ServiceList add={this.addNewRow} delete={this.clickOnDelete} listService={listService} />
                                        </tbody>
                                        <tfoot>
                                            <tr><td colSpan="4">
                                                <button onClick={this.addNewRow} type="button" className="btn btn-primary text-center">
                                                    <i className="fa fa-plus-circle" aria-hidden="true"></i>
                                                </button>
                                            </td></tr>
                                        </tfoot>
                                        </table>
                                    </div>
                                    <div className="card-footer text-center">
                                        <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmitTambahService}>
                                            Simpan Data Service
                                        </CustomizedButtons>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </Modal>

            {/* <Modal show={this.state.isShowDetail} handleCloseModal={this.handleCancel} >
                <NotificationContainer />
                    <div className="row" style={{ marginTop: 5 }}>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header text-center">
                                Detail Order
                            </div>
                            <div className="card-body">
                                <Order
                                    key={this.state.idOrder}
                                    idOrder={this.state.idOrder}
                                    noPO={this.state.noPO}
                                    noSPH={this.state.noSPH}
                                    orderName={this.state.orderName}
                                    description={this.state.description}
                                    projectInstallation={this.state.projectInstallation}
                                    managedService={this.state.managedService}
                                    clientName={this.state.clientName}
                                    clientDiv={this.state.clientDiv}
                                    clientPIC={this.state.clientPIC}
                                    clientOrg={this.state.clientOrg}
                                    clientPhone={this.state.clientPhone}
                                    clientEmail={this.state.clientEmail}
                                    dateOrder={this.state.dateOrder}
                                    verified={this.state.verified}
                                />
                            </div> 
                                <div className="card-header text-center">
                                    Detail Project Installation
                                </div>
                                <div className="card-body">
                                    <ProjectInstallation 
                                        key={this.state.idOrderPi}
                                        idOrderPi={this.state.idOrderPi}
                                        startPI={this.state.startPI}
                                        deadline={this.state.deadline}
                                        percentage={this.state.percentage}
                                        close={this.state.close}
                                    />
                                </div>
                                 <div className="card-header text-center">
                                    Detail Managed Service
                                </div>
                                <div className="card-body">
                                    <ManagedService 
                                        key={this.state.idOrderMs}
                                        idOrderMs={this.state.idOrderMs}
                                        actualStart={this.state.actualStart}
                                        actualEnd={this.state.actualEnd}
                                    />
                                </div>
                            <div className="card-footer text-center">
                                <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleCancel}>
                                    Kembali
                                </CustomizedButtons>
                            </div>
                        </div>                                            
                    </div>
                    </div>
            </Modal> */} 

            <Modal show={this.state.isUpload} handleCloseModal={this.handleCancel} >
                <NotificationContainer />
                <form onSubmit={this.handleUploadDokumen} onChange={this.handleChange} >
                    <div className="row" style={{ marginTop: 20 }}>
                    <div className="col-sm-1"></div>
                    <div className="col-sm-10">
                        <div className="card">
                            <div className="card-header text-center">Unggah Dokumen</div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group files color">
                                                <label>Upload Your File</label>
                                                <input type="file" className="form-control" name="file" onChange={this.onFileChange}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            <div className="card-footer text-center">
                                <CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleUploadDokumen}>
                                    Unggah
                                </CustomizedButtons>
                            </div>
                        </div>                                            
                    </div>
                    </div>
                </form>
            </Modal>
            </div>      
                                
        );
    }
}      

export default InputDataOrder;