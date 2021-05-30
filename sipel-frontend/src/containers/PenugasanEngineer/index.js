import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import { Form, Button, Card, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";

class PenugasanEngineer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [],
            isEdit: false,
            orderTarget: null,
            engineers: [],
            picEngineerPi: null,
            picEngineerMs: null,
            servicesEngineer: [],
            isReport: false,
            orderFiltered: [],
            isFiltered: false,
            isError: false,
            isSuccess: false,
            isFailed: false,
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
        this.handleCloseNotif = this.handleCloseNotif.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    // Mengambil dan mengupdate data yang masuk
    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersVerified");
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
        let isPi = this.state.orderTarget.projectInstallation;
        let isMs = this.state.orderTarget.managedService;

            try {
                // Apabila order memiliki jenis project installation
                if(isPi === true){
                    const pi = this.getPi(this.state.orderTarget.idOrder);
                    const dataPi = {
                        idOrderPi: pi.idOrderPi,
                        idUserEng: this.state.picEngineerPi,
                        percentage: pi.percentage,
                        startPI: pi.startPI,
                        deadline: pi.deadline,
                        dateClosedPI: pi.dateClosedPI
                    }
                    await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/pi/${pi.idOrderPi}/updatePIC`, dataPi);
                }

                // Apabila order memiliki jenis managed service
                if(isMs === true){
                    const ms = this.getMs(this.state.orderTarget.idOrder);
                    const dataMs = {
                        idOrderMs: ms.idOrderMs,
                        idUserPic: this.state.picEngineerMs,
                        actualStart: ms.actualStart,
                        actualEnd: ms.actualEnd,
                        activated: ms.activated,
                        timeRemaining: ms.timeRemaining,
                        dateClosedMS: ms.dateClosedMS
                    }
                    await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/ms/${ms.idOrderMs}/updatePIC`, dataMs);
                    let listService = this.getListService(this.state.orderTarget);
                    
                    // Mengirim data service satu per satu
                    for(let i=0; i<this.state.servicesEngineer.length; i++){
                        let service = listService[i];
                        const dataService = {
                            idService: service.idService,
                            name: service.name,
                            idUser: this.state.servicesEngineer[i]
                        }
                        await APIConfig.put(`/order/${this.state.orderTarget.idOrder}/ms/${ms.idOrderMs}/service/${service.idService}/updateService`, dataService);
                    }
                }

                this.loadData();
            } catch (error) {
                console.log(error);
                return this.setState({isFailed: true, messageError: "Penugasan Engineer gagal disimpan"});
            }

        this.setState({isSuccess: true, isEdit: false});
    }

    // validasi form
    // jika valid, maka memanggil handleSubmit
    // jika tidak valid, maka memberikan notifikasi
    handleValidation(event){
        event.preventDefault();
        let isPi = this.state.orderTarget.projectInstallation;
        let isMs = this.state.orderTarget.managedService;

        if(isPi === true && isMs === false){
            if((this.state.picEngineerPi === null || this.state.picEngineerPi === "")){
                return this.setState({isFailed: true, messageError: "PIC Engineer Project Installation wajib diisi"});
            }
        }else if(isMs === true && isPi === false){
            for(let i=0; i<this.state.servicesEngineer.length; i++){
                if(this.state.servicesEngineer[i] === null || this.state.servicesEngineer[i] === ""){
                    return this.setState({isFailed: true, messageError: "Semua Engineer Service wajib diisi"});
                }
            }
            if((this.state.picEngineerMs === null || this.state.picEngineerMs === "")){
                return this.setState({isFailed: true, messageError: "PIC Engineer Managed Service wajib diisi"});
            }
        }else{
            if (isPi === true && (this.state.picEngineerPi === null || this.state.picEngineerPi === "")){
                return this.setState({isFailed: true, messageError: "PIC Engineer Project Installation wajib diisi"});
            }

            for(let i=0; i<this.state.servicesEngineer.length; i++){
                if(this.state.servicesEngineer[i] === null || this.state.servicesEngineer[i] === ""){
                    return this.setState({isFailed: true, messageError: "Semua Engineer Service wajib diisi"});
                }
            }

            if((this.state.picEngineerMs === null || this.state.picEngineerMs === "")){
                return this.setState({isFailed: true, messageError: "PIC Engineer Managed Service wajib diisi"});
            }
        }

        this.setState({isFailed: false, messageError: null});
        this.handleSubmit(event);
    }

    // Menampilkan report setelah berhasil menyimpan data
    handleReport(event){
        event.preventDefault();
        this.setState({isSuccess: false, isReport: true, isEdit:false});
    }

    // Mengecek tipe order berjenis project installation, managed service, atau keduanya
    checkTypeOrder(pi, ms){
        if(pi === true && ms === true){
            return "Project Installation, Managed Service";
        }else if(pi === true){
            return "Project Installation";
        }else if(ms === true){
            return "Managed Service";
        }
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

    // Mengambil order jenis managed services yang dipilih
    getMs(idOrder){
        let ms = this.state.listMs.filter(ms => ms.idOrder.idOrder === idOrder);

        if (ms.length !== 0) {
            console.log(ms[0]);
            return ms[0];
        }
        return null;
    }

    // Mengambil pic engineer dari order jenis project installation yang dipilih
    getPICPI(idOrder){
        let pi = this.getPi(idOrder);  

        if(pi !== null){
            let user = pi.idUserEng;
            if(user !== null){
                return user;
            }
        }
        return null
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
            return service.idUser.fullname;
        }
        return <p style={{color: "red"}}>Belum ditugaskan</p>;
    }
    
    // Menargetkan order yang dipilih untuk diubah pic engineer nya
    handleEdit(order) {
        this.setState({
            isEdit: true,
            orderTarget: order
        });

        if(order.projectInstallation === true){
            const picPi = this.getPICPI(order.idOrder);
            if(picPi !== null){
                this.setState({picEngineerPi: picPi.id});
            }
        }

        if(order.managedService === true){
            const picMs = this.getPICMS(order.idOrder);
            if(picMs !== null){
                const servicesEngineer = this.getListService(order).map(service => service.idUser.id);
                this.setState({
                    picEngineerMs: picMs.id, 
                    servicesEngineer: servicesEngineer
                });
            }
        }
    }

    // Menutup semua modal
    handleCancel(event) {
        event.preventDefault();

        this.setState({
            isEdit: false, 
            isReport: false, 
            isError: false, 
            isSuccess: false,
            isFailed: false,
            messageError: null
        });
        this.loadData();
    }

    // Mengubah data yang ditargetkan sesuai dengan isi form
    handleChangeField(event) {
        event.preventDefault();
        const { name, value } = event.target;
        const servicesEngineerNew = this.state.servicesEngineer;

        if( name.substring(0,16) === "servicesEngineer"){
            let index = Number(name.substring(16));
            servicesEngineerNew[index] = value;
            this.setState({ servicesEngineer: servicesEngineerNew});
        }else{
            this.setState({ [name]: value});
        }
    }

    // Mengambil list service dari order jenis managed service yang dipilih
    getListService(order){
        if(order.managedService === true){
            const ms = this.state.listMs.filter(ms => ms.idOrder.idOrder === order.idOrder);
            return ms[0].listService;
        }
        return null;
    }

    // Mengambil order yang dipilih
    getOrder(idOrder){
        const orders = this.state.ordersVerified;
        for(let i=0; i<=orders.length; i++){
            if(orders[i].idOrder === idOrder){
                return orders[i];
            }
        }
    }

    // Menyaring list order sesuai dengan data yang dimasukkan pada form search
    handleFilter(event){
        let newOrderList = this.state.ordersVerified;
        const { value } = event.target;
        if( value !== "" ){
            newOrderList = this.state.ordersVerified.filter(order => {
                return (order.orderName.toLowerCase().includes(value.toLowerCase()) ||
                order.noPO.toLowerCase().includes(value.toLowerCase()))
            });
            this.setState({ isFiltered : true });
        }else{
            this.setState({ isFiltered : false });
        }
        this.setState({ orderFiltered : newOrderList });
    }

    // Menutup notifikasi gagal
    handleCloseNotif(){
        this.setState({ isFailed: false, messageError: null });
    }

    render() {
        const { ordersVerified, isEdit, orderTarget, engineers, picEngineerPi, isFailed, messageError,
             picEngineerMs, servicesEngineer, isReport, isError, isSuccess, orderFiltered, isFiltered } = this.state;
        
        // Judul untuk setiap kolom di tabel daftar order
        const tableHeaders = ['No.', 'Nomor PO', 'Nama Order', 'Tipe', 'PIC PI', 'PIC MS', 'Aksi'];                  
        
        // Isi tabel daftar order yang disesuaikan dengan yang dicari
        const tableRows = isFiltered ? orderFiltered.map((order) =>
                        [ order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.getPICPI(order.idOrder) === null ? <p style={{color: "red", marginBottom: 0}}>Belum ditugaskan</p>  : this.getPICPI(order.idOrder).fullname, 
                        this.getPICMS(order.idOrder) === null ? <p style={{color: "red", marginBottom: 0}}>Belum ditugaskan</p> : this.getPICMS(order.idOrder).fullname,
                        <div className="d-flex justify-content-center"><Button className={classes.button1}
                        onClick={() => this.handleEdit(order)}>perbarui</Button></div>])
                        : ordersVerified.map((order) =>
                        [order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.checkTypeOrder(order.projectInstallation, order.managedService), 
                        this.getPICPI(order.idOrder) === null ? <p style={{color: "red", marginBottom: 0}}>Belum ditugaskan</p> : this.getPICPI(order.idOrder).fullname, 
                        this.getPICMS(order.idOrder) === null ? <p style={{color: "red", marginBottom: 0}}>Belum ditugaskan</p> : this.getPICMS(order.idOrder).fullname,
                        <div className="d-flex justify-content-center"><Button className={classes.button1}
                        onClick={() => this.handleEdit(order)}>perbarui</Button></div>]);
        
        // Judul untuk setiap kolom di tabel service
        const tableServiceHeaders = ['No.', 'Nama Service', 'Engineer'];
        let tableServiceRows;

        // Isi tabel service sesuai dengan order yang dipilih
        if(orderTarget !== null){
            let listServiceTarget = this.getListService(orderTarget);
            if( listServiceTarget !== null){
                tableServiceRows = listServiceTarget.map((service, index) =>[service.name, isReport ? this.getPICService(service) :
                                    <Form.Control as="select" size="sm" key={index} name={"servicesEngineer"+index} 
                                    value={servicesEngineer[index] === null ? "" : servicesEngineer[index]}
                                    onChange={this.handleChangeField}><option value="">Belum ditugaskan</option>
                                    {engineers.map(user =><option value={user.id}>{user.fullname}</option>)}
                                    </Form.Control>]);
            }
        }

        const title = isReport? "Penugasan Engineer" : "Form Penugasan Engineer";

        return (
            <div className={classes.container}>
                
                {/* Menampilkan daftar order */}
                <div><h1 className="text-center">Daftar Order</h1></div>
                <div className="d-flex justify-content-end" style={{padding: 5}}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter} className={classes.search}/></div>
                <div><CustomizedTables headers={tableHeaders} rows={tableRows}/></div>
                
                {/* Menampilkan modal berisi form penugasan engineer */}
                <Modal
                    show={isEdit || isReport}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Header closeButton onClick={this.handleCancel}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {title}
                        </Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                               { isFailed ? 
                               <Card body className={classes.card}>
                                   <div className="d-flex justify-content-between">
                                        <div>{messageError}</div>
                                        <Button size="sm" className="bg-transparent border border-0 border-transparent" onClick={this.handleCloseNotif}>x</Button>
                                    </div>
                                </Card>
                               : <></> }
                            <p>
                                {orderTarget !== null ?
                                <><Form>
                                    <Table borderless responsive="xl" size="sm">
                                        <tr>
                                            <td>Nomor PO</td>
                                            <td>: {orderTarget.noPO === null? "-" : orderTarget.noPO}</td>
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
                                            <td>Tipe</td>
                                            <td>: {this.checkTypeOrder(orderTarget.projectInstallation, orderTarget.managedService)}</td>
                                        </tr>
                                        { orderTarget.projectInstallation ?
                                            <><tr>
                                                <td style={{fontWeight: 'bold'}}>Project Installation</td>
                                            </tr>
                                            <tr>
                                                {isReport ?
                                                <><td>PIC Engineer</td>
                                                <td>: {this.getPICPI(orderTarget.idOrder) === null? <p style={{color: "red"}}>Belum ditugaskan</p> : this.getPICPI(orderTarget.idOrder).fullname}</td></> :
                                                <><td><p className="d-flex">PIC Engineer<p style={{color: "red"}}>*</p></p></td>
                                                <td><Form.Control as="select" size="sm" name="picEngineerPi" value={picEngineerPi === null ? "": picEngineerPi} onChange={this.handleChangeField}>
                                                        <option value="">Belum ditugaskan</option>
                                                        {engineers.map((user, index) => <option key={index} value={user.id}>{user.fullname}</option>)}
                                                    </Form.Control></td></>}
                                            </tr></>
                                        : <></>}
                                        { orderTarget.managedService ?
                                        <><tr>
                                            <td style={{fontWeight: 'bold'}}>Managed Service</td>
                                        </tr>
                                        <tr>
                                            {isReport ? 
                                            <td>Services</td> :
                                            <td><p className="d-flex">Services<p style={{color: "red"}}>*</p></p></td> }
                                            <td>
                                                <><CustomizedTables headers={tableServiceHeaders} rows={tableServiceRows}></CustomizedTables></>
                                            </td>
                                        </tr>
                                        <tr>
                                            {isReport ?
                                            <><td>PIC Engineer</td>
                                            <td>: {this.getPICMS(orderTarget.idOrder) === null ? <p style={{color: "red"}}>Belum ditugaskan</p> : this.getPICMS(orderTarget.idOrder).fullname}</td></> :
                                            <><td><p className="d-flex">PIC Engineer<p style={{color: "red"}}>*</p></p></td>
                                            <td><Form.Control as="select" size="sm" name="picEngineerMs" value={picEngineerMs === null ? "" : picEngineerMs} onChange={this.handleChangeField}>
                                                    <option value="">Belum ditugaskan</option>
                                                    {engineers.map(user =><option value={user.id}>{user.fullname}</option>)}
                                                </Form.Control></td></>}
                                        </tr></>
                                        : <></>}
                                        {isReport ? <></> :
                                        <tr>
                                            <td style={{color: "red"}}>*Wajib diisi</td>
                                            <td className="d-flex justify-content-end">
                                                <Button variant="primary" className={classes.button1} onClick={this.handleValidation}>
                                                    simpan
                                                </Button>
                                            </td>
                                        </tr>}
                                    </Table>
                                </Form></>
                                : <></> }
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
                            <div className="d-flex justify-content-center">Penugasan Engineer berhasil disimpan.</div><br></br>
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

export default PenugasanEngineer;