import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
// import CustomizedButtons from "../../components/Button";
// import CustomizedModal from "../../components/Modal";
import { Form, Button, Card, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";
import moment from "moment";

class PeriodeKontrak extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [],
            isLoading: false,
            isEdit: false,
            isExtend: false,
            orderTarget: null,
            orderTargetUpdated: null,
            users: [],
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
            isValid: true
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReport = this.handleReport.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleAddServices = this.handleAddServices.bind(this);
        this.handleCloseNotif = this.handleCloseNotif.bind(this);
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    async loadData() {
        try {
            const orders = await APIConfig.get("/orders/ms");
            const users = await APIConfig.get("/users");
            this.setState({ ordersVerified: orders.data, users: users.data});
        } catch (error) {
            // alert("Oops terjadi masalah pada server");
            this.setState({ isError: true });
            console.log(error);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        if(this.state.isExtend){
            if(this.state.newNoPO !== null){
                if(this.state.newNoPO !== ""){
                    let newOrder;
                    let services;
                    if(new Date(this.state.actualEnd) > new Date(this.state.actualStart)){
                        try {   
                            let response;
                            const order = this.state.orderTarget;
                            const pi = order.idOrderPi === null ? null : order.idOrderPi.idOrderPi;
                            const ms = order.idOrderMs.idOrderMs;
                            const dataOrder = {
                                idOrder: order.idOrder,
                                orderName: order.orderName,
                                clientName: order.clientName,
                                clientOrg: order.clientOrg,
                                clientDiv: order.clientDiv,
                                clientPIC: order.clientPIC,
                                clientEmail: order.clientEmail,
                                clientPhone: order.clientPhone,
                                dateOrder: order.dateOrder,
                                noPO: this.state.newNoPO,
                                noSPH: order.noSPH,
                                description: order.description,
                                verified: order.verified,
                                projectInstallation: order.projectInstallation,
                                managedService: order.managedService,
                                idOrderPi: pi,
                                idOrderMs: ms
                            }
                            response = await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/perpanjangKontrak`, dataOrder);
                            newOrder = response.data.result;
                            this.loadData();  

                            const newMs = newOrder.idOrderMs;
                            const dataMs = {
                                idOrderMs: newMs.idOrderMs,
                                idUserPic: this.state.picEngineerMs,
                                actualStart: this.convertDateToString(this.state.actualStart),
                                actualEnd: this.convertDateToString(this.state.actualEnd),
                                activated: newMs.activated,
                                dateClosedMS: newMs.dateClosedMS
                            }
                            response = await APIConfig.put(`/order/${newOrder.idOrder}/ms/${newMs.idOrderMs}/updateKontrak`, dataMs);
                            const newMsUpdated = response.data.result;
                            
                            let listServiceName = this.state.servicesEngineerName;
                            let listService = this.state.servicesEngineer;
                            services = new Array(listService.length);
                            for(let i=0; i<listService.length; i++){
                                const dataService = {
                                    name: listServiceName[i],
                                    idUser: listService[i]
                                }
                                response = await APIConfig.post(`/order/${newOrder.idOrder}/ms/${newMsUpdated.idOrderMs}/service`, dataService);
                                const service = response.data.result;
                                services[i] = service;
                                this.loadData();
                            }
                            this.loadData();
                        } catch (error) {
                            console.log(error);
                            return this.setState({isFailed: true, isValid: true});
                        }
                        return this.setState({isFailed: false, isValid: true, isSuccess: true, isExtend: false, orderTarget: newOrder, services: services, timeRemaining: this.getTimeRemaining(this.state.actualStart, this.state.actualEnd)});
                    }else{
                        return this.setState({isFailed: true, isValid: false});
                    }
                }else{
                    return this.setState({isFailed: true, isValid: false});
                }
            }else{
                return this.setState({isFailed: true, isValid: false});
            }
        }else{
                if(new Date(this.state.actualEnd) > new Date(this.state.actualStart)){
                    try {   
                        const ms = this.state.orderTarget.idOrderMs;
                        const dataMs = {
                            idOrderMs: ms.idOrderMs,
                            idUserPic: this.state.picEngineerMs,
                            actualStart: this.convertDateToString(this.state.actualStart),
                            actualEnd: this.convertDateToString(this.state.actualEnd),
                            activated: ms.activated,
                            dateClosedMS: ms.dateClosedMS
                        }
                        const newMs = await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/ms/${ms.idOrderMs}/updateKontrak`, dataMs);
                        this.loadData();
                    } catch (error) {
                        console.log(error);
                        return this.setState({isFailed: true, isValid: true});
                    }
                    return this.setState({isFailed: false,  isValid: true, isSuccess: true, isEdit: false, timeRemaining: this.getTimeRemaining(this.state.actualStart, this.state.actualEnd)});
                }else{
                    return this.setState({isFailed: true, isValid: false});
                }
        } 
    }

    handleReport(event){
        event.preventDefault();
        if(this.state.isExtend){
            this.setState({isReportExtend: true, isAdded: false});
        }else{
            this.setState({isReport: true});
        }

        this.setState({isSuccess: false, isFailed: false, isValid: true});
    }

    getDate(value){
        let date = new Date(value);
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        return date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear();
    }

    getTimeRemaining(actualStart, actualEnd){
        const startDate = new Date(actualStart);
        const endDate = new Date(actualEnd);
        let currentDate = this.state.currentDateTime;

        if ( startDate > currentDate) {
            return "Belum mulai";
        } else if ( currentDate > endDate ){
            return "Habis";
        }
        
        let startYear = currentDate.getFullYear();
        let startMonth = currentDate.getMonth();
        let startDay = currentDate.getDate();
        
        let endYear = endDate.getFullYear();
        let endMonth = endDate.getMonth();
        let endDay = endDate.getDate();
        
        // We calculate February based on end year as it might be a leep year which might influence the number of days.
        let february = (((endYear % 4 === 0) && (endYear % 100 !== 0)) || (endYear % 400 === 0)) ? 29 : 28;
        let daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        let startDateNotPassedInEndYear = ((endMonth < startMonth) || (endMonth === startMonth )) && (endDay < startDay);
        let years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);
        
        let months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;
        
        // (12 + ...) % 12 makes sure index is always between 0 and 11
        let days = startDay <= endDay ? endDay - startDay : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay;

        let timeRemaining = "";
        if(years === 0){
            if(months === 0){
                timeRemaining = days+" hari";
            }else{
                if(days === 0){
                    timeRemaining = months+" bulan";
                }
                timeRemaining = months+" bulan "+days+" hari";
            }
        }else{
            if(months === 0){
                if(days === 0){
                    timeRemaining = years+" tahun";
                }
                timeRemaining = years+" tahun "+days+" hari";
            }else{
                if(days === 0){
                    timeRemaining = years+" tahun "+months+" bulan";
                }
                timeRemaining = years+" tahun "+months+" bulan "+days+" hari";
            }
        }

        return timeRemaining;
    }

    handleChangeField(event) {
        const { name, value } = event.target;
        const servicesEngineerNew = this.state.servicesEngineer;
        const servicesEngineerNameNew = this.state.servicesEngineerName;

        if( name.substring(0,16) === "servicesEngineer"){
            let index = Number(name.substring(16));
            servicesEngineerNew[index] = value;
            this.setState({ servicesEngineer: servicesEngineerNew});
        }else if( name.substring(0,11) === "serviceName" ){
            let index = Number(name.substring(11));
            servicesEngineerNameNew[index] = value;
            this.setState({ servicesEngineerName: servicesEngineerNameNew});
        }else{
            this.setState({ [name]: value });
        }
    }

    handleEdit(order, typeEdit) {
        let actualStart = moment(new Date(order.idOrderMs.actualStart)).format("YYYY-MM-DD");
        let actualEnd = moment(new Date(order.idOrderMs.actualEnd)).format("YYYY-MM-DD");
        if(typeEdit === "perbarui"){
            this.setState({ isEdit: true , formValid: true});
        }else{
            this.setState({ isExtend: true });
        }

        this.setState({  
            orderTarget: order,
            actualStart: actualStart,
            actualEnd: actualEnd,
            totalServices: order.idOrderMs.listService.length,
            timeRemaining: this.getTimeRemaining(order.idOrderMs.actualStart, order.idOrderMs.actualEnd)  
        });
        
        if(order.idOrderMs.idUserPic !== null){
            let servicesEngineer = order.idOrderMs.listService.map(service => service.idUser.id);
            let servicesEngineerName = order.idOrderMs.listService.map(service => service.name);
            this.setState({
                picEngineerMs: order.idOrderMs.idUserPic.id, 
                servicesEngineer: servicesEngineer,
                servicesEngineerName: servicesEngineerName,
                services: order.idOrderMs.listService
            });
        }
    }

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
            isValid: true
        });
        this.loadData();
    }

    getPICMS(idOrder){
        let orderTarget = this.state.ordersVerified.filter(
            order => order.idOrder === idOrder
        );
        let ms = orderTarget.map(order => {return order.idOrderMs});
    
        if(orderTarget !== null && ms[0] !== null){
            let user = orderTarget.map(order => order.idOrderMs.idUserPic);
            if(user !== null){
                let pic = orderTarget.map(order => order.idOrderMs.idUserPic.fullname);
                return pic;
            }
        }
        return "Belum ditugaskan";
    }

    getPICService(service){
        if(service.idUser !== null) return service.idUser.fullname;
        return "Belum ditugaskan";
    }

    convertDateToString(date){
        return date+"T17:00:00.000+00:00";
    }

    getDaysMonthsYears(date){
        const dateSplit = date.split(" ");
        if(date.includes("tahun")){
            if(date.includes("bulan")){
                if(date.includes("hari")) return [dateSplit[0], dateSplit[2], dateSplit[4]];
                return [0, dateSplit[2], dateSplit[4]];
            }
            if(date.includes("hari")) return [dateSplit[0], 0, dateSplit[4]];
            return [0, 0, dateSplit[4]];
        }else{
            if(date.includes("bulan")){
                if(date.includes("hari")) return [dateSplit[0], dateSplit[2], 0];
                return [0, dateSplit[2], 0];
            }
            return [dateSplit[0], 0, 0];
        }
    }

    handleFilter(event){
        let newOrderList = this.state.ordersVerified;
        const { value } = event.target;
        if( value !== "" ){
            newOrderList = newOrderList.filter(order => {
                return order.orderName.toLowerCase().includes(value.toLowerCase())
            });
            this.setState({ isFiltered : true });
        }else{
            this.setState({ isFiltered : false });
        }
        this.setState({ orderFiltered : newOrderList });
    }

    handleAddServices(listService){
        this.setState({isAdded: true});
        let servicesEngineer = [...this.state.servicesEngineer];
        let initialTotal = listService.length;
        const totalServicesNew = initialTotal+1;
        this.setState({ totalServices: totalServicesNew });
        servicesEngineer = servicesEngineer.concat(null);
        this.setState({serviceEngineer: servicesEngineer});
        this.setState({listService: [...this.state.listService, [<Form.Control type="text" size="sm" name={"serviceName"+initialTotal} 
        placeholder="masukkan nama service" onChange={this.handleChangeField}/>, 
        <Form.Control as="select" size="sm" key={initialTotal} name={"servicesEngineer"+initialTotal} 
        value={this.state.servicesEngineer[initialTotal] === null ? this.state.users[0].id : this.state.servicesEngineer[initialTotal]}
        onChange={this.handleChangeField}>{this.state.users.map(user =><option value={user.id}>{user.fullname}</option>)}
        </Form.Control>]]});
    }

    handleCloseNotif(){
        this.setState({ isFailed: false, isValid: true });
    }

    render() {
        const { ordersVerified, isEdit, isExtend, orderTarget, users, actualStart, actualEnd, picEngineerMs, isAdded, timeRemaining, isSuccess, isFailed, isError, isValid, newNoPO,
            servicesEngineer, servicesEngineerName, isReport, isReportExtend, orderFiltered, isFiltered, listService, services } = this.state;
        const tableHeaders = ['No.', 'Id Order', 'Nomor PO', 'Nama Order', 'Periode Mulai', 'Periode Berakhir', 'Waktu Tersisa', 'Aksi'];                  
        
        const tableRows = isFiltered ? orderFiltered.map((order) =>
                        [order.idOrder, order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.getDate(order.idOrderMs.actualStart), this.getDate(order.idOrderMs.actualEnd),
                        this.getTimeRemaining(order.idOrderMs.actualStart, order.idOrderMs.actualEnd),
                        <div className="justify-content-between"><Button className={classes.button1} onClick={() => this.handleEdit(order, "perbarui")}>perbarui</Button>
                        <Button className={classes.button2} onClick={() => this.handleEdit(order, "perpanjang")}>perpanjang</Button></div>])
                        : ordersVerified.map((order) =>
                        [order.idOrder, order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.getDate(order.idOrderMs.actualStart), this.getDate(order.idOrderMs.actualEnd),
                        this.getTimeRemaining(order.idOrderMs.actualStart, order.idOrderMs.actualEnd),
                        <div className="justify-content-between"><Button className={classes.button1} onClick={() => this.handleEdit(order, "perbarui")}>perbarui</Button>
                        <Button className={classes.button2} onClick={() => this.handleEdit(order, "perpanjang")}>perpanjang</Button></div>])
 
        const tableServiceHeaders = ['No.', 'Nama Service', 'Engineer'];
        let tableServiceRows;

        if(orderTarget !== null){
                tableServiceRows = isAdded ? listService : services.map((service, index) =>
                                    [isExtend? <Form.Control type="text" size="sm" name={"serviceName"+index} value={servicesEngineerName[index] === null ? 
                                    service.name : servicesEngineerName[index]} onChange={this.handleChangeField} placeholder={service.name}/>
                                    : service.name, (isReport || isEdit || isReportExtend ) ? this.getPICService(service) :
                                    <Form.Control as="select" size="sm" key={index} name={"servicesEngineer"+index} 
                                    value={servicesEngineer[index] === null ? users[0].id : servicesEngineer[index]}
                                    onChange={this.handleChangeField}>
                                    {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                </Form.Control>]);
        }

        const titleExtend = isReportExtend? "Perpanjangan Periode Kontrak" : "Form Perpanjangan Periode Kontrak";
        const title = isReport? "Rincian Periode Kontrak" : "Form Perbarui Periode Kontrak";

        return (
            <div>
                <div><h1 className="text-center">Daftar Order</h1></div>
                <div className="d-flex justify-content-end" style={{padding: 5}}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter} className={classes.search}/></div>
                <div><CustomizedTables headers={tableHeaders} rows={tableRows}/></div>
                <Modal
                    show={isEdit || isReport || isExtend || isReportExtend}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Header closeButton onClick={this.handleCancel}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {isEdit? title : titleExtend}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                            { isFailed ? 
                               <Card body className={classes.card}>
                                   <div className="d-flex justify-content-between">
                                        {isEdit?
                                            <div>{isValid? "Periode Kontrak" : "Periode mulai harus lebih awal dari periode akhir"} Gagal disimpan.</div> :
                                            isValid ?
                                                <div>Perpanjangan Periode Kontrak Gagal disimpan.</div> :
                                                <div>{newNoPO === null || newNoPO === ""? "Nomor PO wajib diisi" : "Periode mulai harus lebih awal dari periode akhir"}</div>
                                        }
                                        <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                    </div>
                                </Card>
                            : <></> }
                            <p>
                                { orderTarget !== null ?
                                <Form>
                                    <Table borderless responsive="xl" size="sm">
                                        <tr>
                                            <td>Id Order</td>
                                            <td>: {orderTarget.idOrder}</td>
                                        </tr>
                                        <tr>
                                            <td>Nomor PO</td>
                                            <td>: {orderTarget.noPO === null ? "-" : orderTarget.noPO}</td>
                                        </tr>
                                        <tr>
                                            <td>Nama Order</td>
                                            <td>: {orderTarget.orderName}</td>
                                        </tr>
                                        <tr>
                                            <td>Perusahaan</td>
                                            <td>: {orderTarget.clientOrg}</td>
                                        </tr>
                                        <tr>
                                            <td style={{fontWeight: 'bold'}}>Managed Service</td>
                                            {isExtend ? <td className="d-flex justify-content-end w-auto">
                                            <Button className={classes.button1} onClick={() => this.handleAddServices(tableServiceRows)}>
                                                + Tambah Services
                                                </Button></td>
                                                : <></>}
                                        </tr>
                                        <tr>
                                            <td>Services</td>
                                            <td>
                                                <><CustomizedTables headers={tableServiceHeaders} rows={tableServiceRows}></CustomizedTables></>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>PIC Engineer</td>
                                            {isExtend ?
                                            <td><Form.Control as="select" size="sm" name="picEngineerMs" value={picEngineerMs === null ? users[0].id : picEngineerMs} onChange={this.handleChangeField}>
                                                    {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                                </Form.Control></td>
                                            : <td>: {this.getPICMS(orderTarget.idOrder)}</td>}
                                        </tr>
                                        <tr>
                                            { isExtend ? <>
                                            <td>Nomor PO Baru</td>
                                            <td><Form.Control type="text" size="sm" name="newNoPO" onChange={this.handleChangeField} placeholder="masukkan nomor PO baru"/></td></> : <></> } 
                                        </tr>
                                        <tr>
                                            <td>Periode Mulai</td>
                                            {isReport || isReportExtend ? 
                                            <td>: {this.getDate(actualStart)}</td> :
                                            <td><Form.Control type="date" size="sm" name="actualStart" value={actualStart} onChange={this.handleChangeField}/></td> }
                                        </tr>
                                        <tr>
                                            <td>Periode Berakhir</td>
                                            {isReport || isReportExtend  ? 
                                            <td>: {this.getDate(actualEnd)}</td> :
                                            <td><Form.Control type="date" size="sm" name="actualEnd" value={actualEnd} onChange={this.handleChangeField}/></td> }
                                        </tr>
                                        <tr>
                                            <td>Waktu Tersisa</td> 
                                            <td>: {timeRemaining}</td> 
                                        </tr>
                                        {isReport || isReportExtend ? <></> :
                                        <tr>
                                            <td></td>
                                            <td className="d-flex justify-content-end">
                                                <Button className={classes.button1} onClick={this.handleSubmit}>
                                                    simpan
                                                </Button>
                                            </td>
                                        </tr> }
                                    </Table>
                                </Form> : <></>}
                            </p>
                    </Modal.Body>
                </Modal>
                <Modal
                    show={isSuccess || isError}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                     <Modal.Header closeButton onClick={this.handleCancel}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Notification
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {isSuccess?
                        <>
                            <div className="d-flex justify-content-center">{isEdit? "Periode Kontrak" : "Perpanjangan Periode Kontrak"} berhasil disimpan.</div><br></br>
                            <div className="d-flex justify-content-center">
                                <Button variant="primary" className={classes.button1} onClick={this.handleReport}>
                                    Kembali
                                </Button>
                            </div>
                        </> :
                        <>
                        <div className="d-flex justify-content-center">Oops terjadi masalah pada server</div><br></br>
                        <div className="d-flex justify-content-center">
                            <Button variant="primary" className={classes.button1} onClick={this.handleCancel}>
                                Kembali
                            </Button>
                        </div>
                        </>}
                    </Modal.Body>
                </Modal>
        </div>
        );
    }
}

export default PeriodeKontrak;