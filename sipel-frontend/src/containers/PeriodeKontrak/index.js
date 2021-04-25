import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
import Modal from "../../components/Modal";
import { Form } from "react-bootstrap";

class PeriodeKontrak extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [ 
            ],
            isLoading: false,
            isEdit: false,
            isExtend: false,
            orderTarget: null,
            users: [],
            picEngineerMs: null,
            servicesEngineer: [],
            isReport: false,
            orderFiltered: [],
            isFiltered: false,
            currentDateTime: Date(),
            timeRemaining: "",
            button: "1"
        };
        // this.handleEdit = this.handleEdit.bind(this);
        // this.handleCancel = this.handleCancel.bind(this);
        // this.handleChangeField = this.handleChangeField.bind(this);
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handleReport = this.handleReport.bind(this);
        // this.handleFilter = this.handleFilter.bind(this);
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersByTimeRemaining");
            const users = await APIConfig.get("/users");
            this.setState({ ordersVerified: orders.data, users: users.data});
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    getDate(value){
        const valueSplit = value.split("T");
        const date = valueSplit[0].split("-");
        const newDate = date[2]+"/"+date[1]+"/"+date[0];
        return newDate;
    }

    // getTimeRemaining(actualStart, timeRemaining){
        // const current = this.state.currentDateTime;
        // let gapYear;
        // let gapMonth;
        // let gapDate;
        // let start = actualStart.split("/");
        // let date1 = new Date(actualStart);
        // console.log(date1);
        // let start = moment(actualStart);
        // const current = moment(this.state.currentDateTime);
        // let diff = start.diff(current);
        // let diffDuration = moment.duration(diff);
        // console.log(start, curret, diff, diffDuration);
        // return (diffDuration.asMilliseconds(), diffDuration.days(), diffDuration.months(), diffDuration.years());
        // if(timeRemaining !== null){
        //     if(timeRemaining === 0){
        //         return "Habis";
        //     }
        // }else{
        //     gapYear = Number(current.getFullYear()) - Number(start[2]); 
        //     gapMonth = Number(current.getMonth()) - Number(start[1]));
        //     gapDate = Number(current.getDate() - Number(start[0]));          
        //     if(gapYear > 0){
        //         return "Belum mulai";
        //     }else if(gapMonth > 0){
        //         return "Belum mulai";
        //     }else if(gapDate > 0){
        //         return "Belum mulai";
        //     }
        // }
        
        // gapYear = Number(current.getFullYear()) - Number(start[2]); 
        // gapMonth = Number(current.getMonth()) - Number(start[1]));
        // gapDate = Number(current.getDate() - Number(start[0]));
        // if(gapYear > 0){
        //     if(gapYear>0){
        //         if(gapMonth>0){
        //             return gapYear+" tahun "+gapMonth+" bulan ";
        //         }
        //     }
        // }
    // }

    getTimeRemaining(actualStart, actualEnd){
        const startDate = new Date(actualStart);
        const endDate = new Date(actualEnd);
        let currentDate = this.state.currentDateTime;

        if ( startDate > currentDate) {
            console.log(startDate > currentDateTime);
            return "Belum mulai";
        } else if ( currentDate > endDate ){
            console.log( currentDate > endDate );
            return "Habis";
        }
        
        var startYear = currentDate.getFullYear();
        var startMonth = currentDate.getMonth();
        var startDay = currentDate.getDate();
        
        var endYear = endDate.getFullYear();
        var endMonth = endDate.getMonth();
        var endDay = endDate.getDate();
        
        // We calculate February based on end year as it might be a leep year which might influence the number of days.
        var february = (endYear % 4 == 0 && endYear % 100 != 0) || endYear % 400 == 0 ? 29 : 28;
        var daysOfMonth = [31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        var startDateNotPassedInEndYear = (endMonth < startMonth) || endMonth == startMonth && endDay < startDay;
        var years = endYear - startYear - (startDateNotPassedInEndYear ? 1 : 0);
        
        var months = (12 + endMonth - startMonth - (endDay < startDay ? 1 : 0)) % 12;
        
        // (12 + ...) % 12 makes sure index is always between 0 and 11
        var days = startDay <= endDay ? endDay - startDay : daysOfMonth[(12 + endMonth - 1) % 12] - startDay + endDay;
        
        let timeRemaining = "";
        if(years === 0){
            if(months === 0){
                timeRemaing = days+" hari";
            }else{
                if(days === 0){
                    timeRemaing = months+" bulan";
                }
                timeRemaing = months+" bulan "+days+" hari";
            }
        }else{
            if(months === 0){
                timeRemaing = years+" tahun "+days+" hari";
            }else{
                if(days === 0){
                    timeRemaing = years+" tahun "+months+" bulan";
                }
                timeRemaing = years+" tahun "+months+" bulan "+days+" hari";
            }
        }

        this.setState({ timeRemaining: timeRemaining});
        return timeRemaing;
    }

    handleChangeField(event) {
        const { name, value } = event.target;
        console.log(name, value);
        const servicesEngineerNew = this.state.servicesEngineer;
        if( name.substring(0,16) === "servicesEngineer"){
            let index = Number(name.substring(16));
            servicesEngineerNew[index] = value;
            this.setState({ servicesEngineer: servicesEngineerNew});
        }else{
            this.setState({ [name]: value});
        }
    }

    handleEdit(order, typeEdit) {
        if(typeEdit === "perbarui"){
            this.setState({ isEdit: true, orderTarget: order });
        }else{
            this.setState({ isExtend: true, orderTarget: order });
        }
        
        if(order.idOrderMs.idUserPic !== null){
            let servicesEngineer = order.idOrderMs.listService.map(service => service.idUser.id);
            this.setState({
                picEngineerMs: order.idOrderMs.idUserPic.id, 
                servicesEngineer: servicesEngineer
            });
        }
    }

    render() {
        const { ordersVerified, isEdit, orderTarget, users, timeRemaining,
             picEngineerMs, servicesEngineer, isReport, isNotif, orderFiltered, isFiltered } = this.state;
        const tableHeaders = ['No.', 'Id Order', 'Nomor PO', 'Nama Order', 'Periode Mulai', 'Periode Berakhir', 'Waktu Tersisa', 'Aksi'];                  
        const tableRows = isFiltered ? orderFiltered.map((order) =>
                        [order.idOrder, order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.getDate(order.idOrderMs.actualStart), this.getDate(order.idOrderMs.actualEnd),
                        this.getTimeRemaining(order.idOrderMs.actualStart, order.idOrderMs.actualEnd),
                        <Form.Control as="select" size="lg" name="button" value={ timeRemaining === "Habis" ? "2" : "1" }
                        onChange={this.handleChangeField}>
                            <option value="1"><CustomizedButtons variant="contained" size="small" color="#FD693E"
                                    onClick={() => this.handleEdit(order, "perbarui")}>perbarui</CustomizedButtons></option>
                            <option value="2"><CustomizedButtons variant="contained" size="small" color="#FD693E"
                                    onClick={() => this.handleEdit(order, "perpanjang")}>perpanjang</CustomizedButtons></option>
                        </Form.Control>])
                        : ordersVerified.map((order) =>
                        [order.idOrder, order.noPO === null ? "-" : order.noPO, order.orderName, 
                        this.getDate(order.idOrderMs.actualStart), this.getDate(order.idOrderMs.actualEnd),
                        this.getTimeRemaining(order.idOrderMs.actualStart, order.idOrderMs.actualEnd),
                        <Form.Control as="select" size="lg" name="button" value={ timeRemaining === "Habis" ? "2" : "1" }
                        onChange={this.handleChangeField}>
                            <option value="1"><CustomizedButtons variant="contained" size="small" color="#FD693E"
                                    onClick={() => this.handleEdit(order, "perbarui")}>perbarui</CustomizedButtons></option>
                            <option value="2"><CustomizedButtons variant="contained" size="small" color="#FD693E"
                                    onClick={() => this.handleEdit(order, "perpanjang")}>perpanjang</CustomizedButtons></option>
                        </Form.Control>])
        const tableServiceHeaders = ['No.', 'Nama Service', 'Engineer'];
        let tableServiceRows;

        if(orderTarget !== null){
            tableServiceRows = orderTarget.idOrderMs.listService.map((service, index) =>
                                [service.name, isReport ? this.getPICService(service) :
                                <Form.Control as="select" size="lg" key={index} name={"servicesEngineer"+index} 
                                value={servicesEngineer[index] === null ? users[0].id : servicesEngineer[index]}
                                onChange={this.handleChangeField}>
                                {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                </Form.Control>]);
        }

        return (
            <div style={{justifyContent: "space-around"}}>
                <div>
                    {/* <tr> */}
                        <div><h1>Daftar Order</h1></div>
                        <div><Form.Control type="text" placeholder="Cari..." onChange={this.handleFilter} id="search"/></div>
                    {/* </tr> */}
                </div>
                <div style={{width: 1300}}><CustomizedTables headers={tableHeaders} rows={tableRows}/></div>
                {/* <Modal show={isNotif} style={{modal : {zIndex: 900}}}>
                    {notification}
                    <a href="#" class="close" onClick={()=>this.handleCloseNotif}>x</a>
                    {console.log(isEdit, isReport, isNotif)}
                </Modal> */}
                <Modal show={isEdit || isReport} style={{modal : {zIndex: 200}}}>
                    <div style={{ justifyContent: "end"}}><a href="#" class="close" onClick={this.handleCancel}>x</a></div>
                    <h3 id='titleform' >Form Penugasan Engineer</h3>
                    {console.log(isEdit, isReport, isNotif)}
                    {orderTarget !== null ?
                        <Form>
                            <table>
                                <tr>
                                    <td>Id Order</td>
                                    <td>: {orderTarget.idOrder}</td>
                                </tr>
                                <tr>
                                    <td>Nomor PO</td>
                                    <td>: {orderTarget.noPO}</td>
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
                                </tr>
                                <tr>
                                    <td>Services</td>
                                    <td>
                                        <><CustomizedTables headers={tableServiceHeaders} rows={tableServiceRows}></CustomizedTables></>
                                    </td>
                                </tr>
                                <tr>
                                    <td>PIC Engineer</td>
                                    {isReport ?
                                        <td>: {this.getPICMS(orderTarget.idOrder)}</td> :
                                    <td><Form.Control as="select" size="lg" name="picEngineerMs" value={picEngineerMs === null ? users[0].id : picEngineerMs} onChange={this.handleChangeField}>
                                            {/* {listServiceEngineerNew.map(user =><option value={user[1]}>{user[2]}</option>)} */}
                                            {users.map(user =><option value={user.id}>{user.fullname}</option>)}
                                        </Form.Control></td>}
                                </tr>
                            </table>
                            <div style={{alignItems:'right'}}><CustomizedButtons variant="contained" size="medium" color="#FD693E" onClick={this.handleSubmit}>
                                simpan
                            </CustomizedButtons></div>
                        </Form>
                    : <></> }
                </Modal>
        </div>
        );
    }
}

export default PeriodeKontrak;