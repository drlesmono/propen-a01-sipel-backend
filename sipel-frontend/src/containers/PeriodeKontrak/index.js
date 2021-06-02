import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
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
            messageError: null
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleReport = this.handleReport.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handleAddServices = this.handleAddServices.bind(this);
        this.handleChangeListService = this.handleChangeListService.bind(this);
        this.handleCloseNotif = this.handleCloseNotif.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    // Mengambil dan mengupdate data yang masuk
    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersVerified/ms");
            const engineers = await APIConfig.get("/engineers");
            const listPi = await APIConfig.get("/orders/pi");
            const listMs = await APIConfig.get("/orders/ms");
            this.setState({ ordersVerified: orders.data, engineers: engineers.data, listPi: listPi.data, listMs: listMs.data});
        } catch (error) {
            this.setState({ isError: true });
            console.log(error);
        }
    }

    // Mengirim data yang akan disimpan ke backend
    async handleSubmit(event) {
        event.preventDefault();
        let response;
        let order;
        let pi;
        let ms;
        let newOrder;
        let services;

        try {
            order = this.state.orderTarget;
            pi = order.projectInstallation === false ? null : this.getPi(order.idOrder).idOrderPi;
            ms = this.getMs(order.idOrder);
            
            // Apabila ingin perpanjang kontrak, maka mengirim data order
            if(this.state.isExtend){
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
                    idOrderMs: ms.idOrderMs
                }
                response = await APIConfig.put(`/order/${order.idOrder}/perpanjangKontrak`, dataOrder);
                newOrder = response.data.result;
                this.loadData();
            }
            
            const dataMs = {
                idOrderMs: this.state.isExtend ? null : ms.idOrderMs,
                idUserPic: this.state.picEngineerMs,
                actualStart: this.convertDateToString(this.state.actualStart),
                actualEnd: this.convertDateToString(this.state.actualEnd),
                activated: ms.activated,
                dateClosedMS: null
            }
            response = await APIConfig.put(`/order/${this.state.isExtend ? newOrder.idOrder : order.idOrder}/ms/updateKontrak`, dataMs);
            const newMsUpdated = response.data.result;
            
            // Apabila ingin perpanjang kontrak, maka mengirim data service satu per satu
            if(this.state.isExtend){
                let listServiceName = this.state.servicesEngineerName;
                let listService = this.state.servicesEngineer;
                services = new Array(listService.length);
                for(let i=0; i<listService.length; i++){
                    const dataService = {
                    name: listServiceName[i],
                    idUser: listService[i]
                    }
                    response = await APIConfig.post(`/order/${newOrder.idOrder}/ms/${newMsUpdated.idOrderMs}/createService`, dataService);
                    const service = response.data.result;
                    services[i] = service;
                    this.loadData();
                }
            }
            this.loadData();
        } catch (error) {
            console.log(error);
            return this.setState({isFailed: true, messageError: this.state.isExtend? "Perpanjangan periode kontrak gagal disimpan." : "Periode kontrak gagal disimpan."});
        }

        if(this.state.isExtend){
            this.setState({orderTarget: newOrder, services: services})
        }
        
        this.setState({isFailed: false, isValid: true, isSuccess: true, isExtend: false, isEdit: false, timeRemaining: this.getTimeRemaining(this.state.actualStart, this.state.actualEnd)});
    }

    // validasi form
    // jika valid, maka memanggil handleSubmit
    // jika tidak valid, maka memberikan notifikasi
    handleValidation(event){
        event.preventDefault();

        if(this.state.isExtend){
            let listServiceName = this.state.servicesEngineerName;
            let listService = this.state.servicesEngineer;
            for(let i=0; i<listService.length; i++){
                if(listServiceName[i] === null || listServiceName[i] === ""){
                    return this.setState({isFailed: true, messageError: "Semua service wajib diisi"});
                }
                if(listService[i] === null || listService[i] === ""){
                    return this.setState({isFailed: true, messageError: "Semua Engineer Service wajib diisi"});
                }
            }

            if((this.state.picEngineerMs === null || this.state.picEngineerMs === "")){
                return this.setState({isFailed: true, messageError: "PIC Engineer Managed Service wajib diisi"});
            }

            if(this.state.newNoPO === null || this.state.newNoPO === ""){
                return this.setState({isFailed: true, messageError: "Nomor PO baru wajib diisi"});
            }
        }

        if(new Date(this.state.actualEnd) < new Date(this.state.actualStart)){
            return this.setState({isFailed: true, messageError: "Periode mulai harus lebih awal dari periode akhir"});
        }else{
            this.setState({isFailed: false, messageError: null});
            this.handleSubmit(event);
        }
    }

    // Menampilkan report setelah berhasil menyimpan data
    handleReport(event){
        event.preventDefault();

        if(this.state.isExtend){
            this.setState({isReportExtend: true, isAdded: false});
        }else{
            this.setState({isReport: true});
        }

        this.setState({isSuccess: false, isFailed: false, isValid: true});
    }

    // Mengambil data dengan format "tanggal bulan(dalam huruf abjad) tahun"
    getDate(value){
        let date = new Date(value);
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

        return date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear();
    }

    // Kalkulasi waktu tersisa terhitung hari ini sampai periode berakhir
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
        
        // Jumlah tanggal februari berdasarkan tahun kabisat
        let february = (((endYear % 4 === 0) && (endYear % 100 !== 0)) || (endYear % 400 === 0)) ? 29 : 28;
        let daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        let startDateNotPassedInEndYear = ((endMonth < startMonth) || (endMonth === startMonth )) && (endDay < startDay);
        let years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);
        
        let months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;
        
        // (12 + ...) % 12 untuk memastikan index antara 0 sampai 11 sesuai dengan jumlah bulan
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

    // Mengubah data yang ditargetkan sesuai dengan isi form
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

    // Menargetkan order yang dipilih untuk diubah periode kontrak nya atau diperpanjang
    handleEdit(order, typeEdit) {
        let ms = this.getMs(order.idOrder);
        let actualStart = moment(new Date(ms.actualStart)).format("YYYY-MM-DD");
        let actualEnd = moment(new Date(ms.actualEnd)).format("YYYY-MM-DD");

        if(typeEdit === "perbarui"){
            this.setState({ isEdit: true , formValid: true});
        }else{
            this.setState({ isExtend: true });
        }

        this.setState({  
            orderTarget: order,
            actualStart: actualStart,
            actualEnd: actualEnd,
            totalServices: ms.listService.length,
            timeRemaining: this.getTimeRemaining(ms.actualStart, ms.actualEnd)  
        });
        
        if(ms.idUserPic !== null){
            let servicesEngineer = ms.listService.map(service => service.idUser.id);
            let servicesEngineerName = ms.listService.map(service => service.name);
            this.setState({
                picEngineerMs: ms.idUserPic.id, 
                servicesEngineer: servicesEngineer,
                servicesEngineerName: servicesEngineerName,
                services: ms.listService
            });
        }
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
            messageError: null
        });
        this.loadData();
    }

    // Mengambil order jenis managed services yang dipilih
    getMs(idOrder){
        let ms = this.state.listMs.filter(ms => ms.idOrder.idOrder === idOrder);

        if (ms.length !== 0) {
            return ms[0];
        }
        return null;
    }

    // Mengambil order jenis project installation yang dipilih
    getPi(idOrder){
        let pi = this.state.listPi.filter(pi => pi.idOrder.idOrder === idOrder );

        if (pi.length !== 0) {
            console.log(pi[0]);
            return pi[0];
        }
        return null;
    }

    // Mengambil pic engineer dari order jenis project installation yang dipilih
    getPICMS(idOrder){
        let ms = this.getMs(idOrder);
        
        if(ms !== null){
            let user = ms.idUserPic;
            if(user !== null){
                return user;
            }
        }
        return null;
    }

    // Mengambil nama lengkap dari engineer pada service yang dipilih
    getPICService(service){
        if(service.idUser !== null){
            console.log(service.idUser.fullname);
            return service.idUser.fullname;
        }
        return <p style={{color: "red"}}>Belum ditugaskan</p>;
    }

    // Mengubah tanggal sesuai format database
    convertDateToString(date){
        return date+"T17:00:00.000+00:00";
    }

    // Mengambil jumlah hari tersisa dengan format "jumlah tahun jumlah bulan jumlah hari"
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

    // Menyaring list order sesuai dengan data yang dimasukkan pada form search
    handleFilter(event){
        let newOrderList = this.state.ordersVerified;
        const { value } = event.target;

        if( value !== "" ){
            newOrderList = newOrderList.filter(order => {
                return (order.orderName.toLowerCase().includes(value.toLowerCase()) ||
                order.noPO.toLowerCase().includes(value.toLowerCase()))
            });
            this.setState({ isFiltered : true });
        }else{
            this.setState({ isFiltered : false });
        }
        this.setState({ orderFiltered : newOrderList });
    }

    // Menambah slot untuk service baru
    handleAddServices(){
        this.setState({isAdded: true});
        let initialTotal = this.state.listService.length;
        const totalServicesNew = initialTotal+1;

        this.setState({ totalServices: totalServicesNew });

        let servicesEngineer = this.state.servicesEngineer.concat(null);
        let servicesEngineerName = this.state.servicesEngineerName.concat(null);

        this.setState({serviceEngineer: servicesEngineer, servicesEngineerName: servicesEngineerName});
        
        let services = [...this.state.services, null];
        this.setState({services: services});
        this.loadData();
    }

    // Menambah row pada tabel service apabila ingin menambah service
    handleChangeListService(){
        this.handleAddServices();

        this.setState({listService: this.state.services.map((service, index) => 
            [<Form.Control type="text" size="sm" name={"serviceName"+index} 
            value={this.state.servicesEngineerName[index] === null ? service === null ? null : 
            service.name : this.state.servicesEngineerName[index]} 
            onChange={this.handleChangeField} placeholder="masukkan service"/>,
            <Form.Control as="select" size="sm" key={index} name={"servicesEngineer"+index} 
            value={this.state.servicesEngineer[index] === null ? "" : this.state.servicesEngineer[index]}
            onChange={this.handleChangeField}><option value="">Belum ditugaskan</option>
            {this.state.engineers.map(user =><option value={user.id}>{user.fullname}</option>)}
            </Form.Control>])});
    }

    // Menutup notifikasi gagal
    handleCloseNotif(){
        this.setState({ isFailed: false, messageError: null});
    }

    render() {
        const { ordersVerified, isEdit, isExtend, orderTarget, engineers, actualStart, actualEnd, picEngineerMs, isAdded, timeRemaining, isSuccess, isFailed, isError, messageError,
            servicesEngineer, servicesEngineerName, isReport, isReportExtend, orderFiltered, isFiltered, listService, services } = this.state;
        
        // Judul untuk setiap kolom di tabel daftar order
        const tableHeaders = ['No.', 'Nomor PO', 'Nama Order', 'Periode Mulai', 'Periode Berakhir', 'Waktu Tersisa', 'Aksi'];                  
        
        // Isi tabel daftar order yang disesuaikan dengan yang dicari
        const tableRows = isFiltered ? orderFiltered.map((order) =>
                        [order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.getDate(this.getMs(order.idOrder).actualStart), this.getDate(this.getMs(order.idOrder).actualEnd),
                        this.getTimeRemaining(this.getMs(order.idOrder).actualStart, this.getMs(order.idOrder).actualEnd),
                        <div className="justify-content-between"><Button className={classes.button1} onClick={() => this.handleEdit(order, "perbarui")}>perbarui</Button>
                        <Button className={classes.button2} onClick={() => this.handleEdit(order, "perpanjang")}>perpanjang</Button></div>])
                        : ordersVerified.map((order) =>
                        [order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.getDate(this.getMs(order.idOrder).actualStart), this.getDate(this.getMs(order.idOrder).actualEnd),
                        this.getTimeRemaining(this.getMs(order.idOrder).actualStart, this.getMs(order.idOrder).actualEnd),
                        <div className="justify-content-between"><Button className={classes.button1} onClick={() => this.handleEdit(order, "perbarui")}>perbarui</Button>
                        <Button className={classes.button2} onClick={() => this.handleEdit(order, "perpanjang")}>perpanjang</Button></div>])

        // Judul untuk setiap kolom di tabel service
        const tableServiceHeaders = ['No.', 'Nama Service', 'Engineer'];
        let tableServiceRows;

        // Isi tabel service sesuai dengan order yang dipilih
        if(orderTarget !== null){
            tableServiceRows = isExtend ?  
                            services.map((service, index) => 
                            [<Form.Control type="text" size="sm" name={"serviceName"+index} 
                            value={this.state.servicesEngineerName[index] === null ? service === null ? null : 
                            service.name : this.state.servicesEngineerName[index]} 
                            onChange={this.handleChangeField} placeholder="masukkan service"/>,
                            <Form.Control as="select" size="sm" key={index} name={"servicesEngineer"+index} 
                            value={this.state.servicesEngineer[index] === null ? "" : this.state.servicesEngineer[index]}
                            onChange={this.handleChangeField}><option value="">Belum ditugaskan</option>
                            {this.state.engineers.map(user =><option value={user.id}>{user.fullname}</option>)}
                            </Form.Control>])
                            : services.map((service) =>[service.name, this.getPICService(service)]);
        }

        const titleExtend = isReportExtend? "Perpanjangan Periode Kontrak" : "Form Perpanjangan Periode Kontrak";
        const title = isReport? "Rincian Periode Kontrak" : "Form Perbarui Periode Kontrak";

        return (
            <div className={classes.container}>
                
                {/* Menampilkan daftar order */}
                <div><h1 className="text-center">Daftar Order</h1></div>
                <div className="d-flex justify-content-end" style={{padding: 5}}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter} className={classes.search}/></div>
                <div><CustomizedTables headers={tableHeaders} rows={tableRows}/></div>
                
                {/* Menampilkan modal berisi form mengubah periode kontrak atau perpanjang periode kontrak */}
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
                                        {messageError}
                                        <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                    </div>
                                </Card>
                            : <></> }
                            <p>
                                { orderTarget !== null ?
                                <Form>
                                    <Table borderless responsive="xl" size="sm">
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
                                            {isExtend ? <td className="d-flex justify-content-end">
                                            <Button className={classes.button1} onClick={this.handleChangeListService}>
                                                + Tambah Services
                                                </Button></td>
                                                : <></>}
                                        </tr>
                                        <tr>
                                            {isExtend ? 
                                            <td><p className="d-flex">Services<p style={{color: "red"}}>*</p></p></td> 
                                            : <td>Services</td>}
                                            <td>
                                                <><CustomizedTables headers={tableServiceHeaders} rows={tableServiceRows}></CustomizedTables></>
                                            </td>
                                        </tr>
                                        <tr>
                                            {isExtend ?
                                            <><td><p className="d-flex">PIC Engineer<p style={{color: "red"}}>*</p></p></td>
                                            <td><Form.Control as="select" size="sm" name="picEngineerMs" value={picEngineerMs === null ? "" : picEngineerMs} onChange={this.handleChangeField}>
                                                    <option value="">Belum ditugaskan</option>
                                                    {engineers.map(user =><option value={user.id}>{user.fullname}</option>)}
                                                </Form.Control></td></>
                                            : <><td>PIC Engineer</td>
                                            <td>: {this.getPICMS(orderTarget.idOrder) === null? "Belum ditugaskan" : this.getPICMS(orderTarget.idOrder).fullname}</td></>}
                                        </tr>
                                        <tr>
                                            { isExtend ? <>
                                            <td><p className="d-flex">Nomor PO Baru<p style={{color: "red"}}>*</p></p></td>
                                            <td><Form.Control type="text" size="sm" name="newNoPO" onChange={this.handleChangeField} placeholder="masukkan nomor PO baru"/></td></> : <></> } 
                                        </tr>
                                        <tr>
                                            {isReport || isReportExtend ?
                                            <><td>Periode Mulai</td> 
                                            <td>: {this.getDate(actualStart)}</td></> :
                                            <><td><p className="d-flex">Periode Mulai<p style={{color: "red"}}>*</p></p></td>
                                            <td><Form.Control type="date" size="sm" name="actualStart" value={actualStart} onChange={this.handleChangeField}/></td></> }
                                        </tr>
                                        <tr>
                                            {isReport || isReportExtend  ? 
                                            <><td>Periode Berakhir</td>
                                            <td>: {this.getDate(actualEnd)}</td></> :
                                            <><td><p className="d-flex">Periode Berakhir<p style={{color: "red"}}>*</p></p></td>
                                            <td><Form.Control type="date" size="sm" name="actualEnd" value={actualEnd} onChange={this.handleChangeField}/></td></> }
                                        </tr>
                                        <tr>
                                            <td>Waktu Tersisa</td> 
                                            <td>: {timeRemaining}</td> 
                                        </tr>
                                        {isReport || isReportExtend ? <></> :
                                        <tr>
                                            <td style={{color: "red"}}>*Wajib diisi</td>
                                            <td className="d-flex justify-content-end">
                                                <Button className={classes.button1} onClick={this.handleValidation}>
                                                    simpan
                                                </Button>
                                            </td>
                                        </tr> }
                                    </Table>
                                </Form> : <></>}
                            </p>
                    </Modal.Body>
                </Modal>

                {/* Menampilkan modal berisi notifikasi ketika berhasil menyimpan data atau error */}
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