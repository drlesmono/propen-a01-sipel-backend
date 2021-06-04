import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
import Modal from "../../components/Modal";
import {Form, Card, Table} from "react-bootstrap";
import { Input, FormControlLabel } from "@material-ui/core";
import './style.css';
import authHeader from '../../services/auth-header';


class Bast extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bast: {
                //"bast":{"idBast":1,"bastNum":"001/LMD-BAST/020/04/2021","dateHandover":"2021-04-21T17:00:00.000+00:00","startPeriod":null,"endPeriod":null},
                //"order":{"idOrder":1,"orderName":"Proyek Installasi - proyek Ebesha Pacil","clientName":"Kamila Kaffah","clientOrg":"PT. Pacil","clientDiv":"HRGA","clientPIC":"PIC","clientEmail":"kamila@pacil.id","clientPhone":"0888303031","dateOrder":"2021-04-01T16:13:09.000+00:00","noPO":"PO/2021/04/0001","noSPH":null,"description":"Order Proyek Instalasi eBesha","hibernateLazyInitializer":{},"managedService":false,"verified":false,"projectInstallation":true},
                //"engineer":{"id":"2","username":"hannaj","password":"$2a$10$s095279is4QwurSScfHPFOnRLHSzvcibI5bZtbA25s3cmIu5/EvfS","nip":"1906020002","fullname":"Hanna Jannatunnaiim","surname":"Hanna","email":"hanna@lmd.co.id"}
                },
            report: {},
            pi:{},
            mn:{},
            laporanList:[],
            orderList:[],
            bastList:[],
            piList:[],
            mnList:[],
            dateHandover: null,
            isOption: true,
            isToCreate: false,
            isLoading: false,
            isEdit: false,
            isMn: null,
            idPi: null,
            idMn: null,
            endPeriod: null,
            startPeriod: null,
            isPopup: false,
            isError:true,
            errorMsg: "Seluruh field pada form ini harus terisi sebelum disubmit. Mohon melengkapi data sebelum membuat preview BAST.",
        };

        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const laporan = await APIConfig.get("/laporan", { headers: authHeader() });
            const order = await APIConfig.get("/laporan/order", { headers: authHeader() });
            const bast = await APIConfig.get("/laporan/bast", { headers: authHeader() });
            const pi = await APIConfig.get("/laporan/pi", { headers: authHeader() });
            const mn = await APIConfig.get("/laporan/mn", { headers: authHeader() });
            this.setState({ laporanList: laporan.data,
                orderList: order.data,
                bastList: bast.data,
                piList: pi.data,
                mnList: mn.data});

        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    async handleCreatePi(){
        try {
            const Pi = (await APIConfig.get("/laporan/bast/create/pi", { headers: authHeader() })).data;
            const list = APIConfig.get("/laporan/pi", { headers: authHeader() }).data;
            this.loadData()
            //console.log(Pi);
            this.setState({
                listPi: list,
                report: Pi.report,
                bast: Pi.bastPi,
                isOption: false,
                isToCreate: true,
                isMaintenance: false});

        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    async handleCreateMn(){
        try {
            const Mn = (await APIConfig.get("/laporan/bast/create/mn", { headers: authHeader() })).data;
            this.loadData();
            //console.log(Mn.maintenanceList);
            this.setState({
                listMn: Mn.maintenanceList,
                report: Mn.report,
                bast: Mn.bastMn,
                isOption: false,
                isToCreate: true,
                isMaintenance: true});

        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleEdit(laporan){
        this.setState({
            isEdit: true,
            laporanTarget:laporan});
    }

    handleCancel(event){
        event.preventDefault();
        this.setState({isEdit: false, isPopup:false});
    }

    handleChangeField(event) {
        const { name, value } = event.target;
        console.log(name, value);
        var score;
        var count = 0

        if(name === "idMaintenance" && value !== ''){
            var score = this.state.dateHandover === null || this.state.startPeriod === null ||this.state.endPeriod===null
            count++;
            this.setState({mn: value})
            this.setState({isError:score})
        }
        if(name === "idOrderPi" && value !== ''){
            this.setState({pi: value})
            this.setState({isError:false})
        }
        if(name === "dateHandover" && value !== ''){
            this.setState({dateHandover: value})
            count++;
            //console.log(this.state.dateHandover);
        }
        if(name === "startPeriod" && value !== ''){
            var score = this.state.dateHandover === null || this.state.idMaintenance === null ||this.state.endPeriod===null
            count++;
            this.setState({startPeriod: value})
            this.setState({isError:score})
        }
        if(name === "endPeriod" && value !== ''){
            var score = this.state.dateHandover === null || this.state.startPeriod === null ||this.state.idMaintenance===null
            count++;
            this.setState({endPeriod: value})
            this.setState({isError:score})
        }


        if(this.state.mn !== null){
            var score = this.state.dateHandover === null || this.state.startPeriod === null ||this.state.endPeriod===null
            if(score === false){this.setState({isError:false})}
        } else{
            {this.setState({isError:false})}
        }
        console.log(this.state.isError)

    }

    handleSubmit(event){
        let test = this.state.endPeriod;
        if(test === null){
            try{
                let bastPi = {
                    idReport: null,
                    idBast: this.state.bast.idBast,
                    bastNum: this.state.bast.bastNum,
                    dateHandover: this.state.dateHandover,
                    idMaintenance: null,
                    idOrderPi: this.state.pi,
                    startPeriod: null,
                    endPeriod: null,
                };
                this.setState({isPopup: true,
                    isToCreate: false,
                })
                if(this.state.isError === true){
                    alert(this.state.errorMsg);
                    this.setState({isOption:true, isToCreate:false, isPopup: false
                    })
                } if(this.state.isError === false){
                    let res = APIConfig.post(`/laporan/create-bast/pi`, bastPi, { headers: authHeader() })
                    this.setState({isPopup: true,
                    })
                    this.loadData();
                }

            }catch (error) {
                alert("Oops terjadi masalah pada server");
                console.log(error);
            }
        }
        else{
            try{
                const dataMn = {
                    idReport: null,
                    idBast: this.state.bast.idBast,
                    bastNum: this.state.bast.bastNum,
                    dateHandover: this.state.dateHandover,
                    idMaintenance: this.state.mn,
                    idOrderPi: null,
                    startPeriod: this.state.startPeriod,
                    endPeriod: this.state.endPeriod,
                };
                if(this.state.isError === true){
                    alert(this.state.errorMsg);
                    this.setState({isOption:true, isToCreate:false, isPopup: false
                    })
                }
                if(this.state.isError === false){
                    let res = APIConfig.post(`/laporan/create-bast/mn`, dataMn, { headers: authHeader() });
                    this.setState({isPopup: true,
                    })
                    this.loadData();
                    console.log(this.state.bast.idOrderPi);
                }

            }catch (error) {
                alert("Oops terjadi masalah pada server");
                console.log(error);
            }
        }

    }

    render() {
        let {isOption, isToCreate, isMaintenance, isPopup} = this.state;

        let piList = this.state.piList;
        let mnList = this.state.mnList;

        const pi = this.state.pi;
        const mn = this.state.mn;

        return(
            <div>
                {isOption === true && isToCreate === false && isPopup === false?
                <div id="buttonoption">
                    <Card id="option">
                        <h3 id="titleGenerate" >Generate BAST</h3>
                        <CustomizedButtons variant="contained" size="small" color="#FD693E" onClick={() => this.handleCreatePi()}>Proyek Installasi</CustomizedButtons>
                        <CustomizedButtons variant="contained" size="small" color="#FD693E" onClick={() => this.handleCreateMn()}>Maintenance</CustomizedButtons>
                    </Card>

                </div>
                : <div></div>
            }
            {isToCreate === true && isOption === false && isMaintenance === true ?
                <div>
                    <Card >
                        <Form>
                            <table id="card-table">
                                <tr>
                                    <td colSpan={2}><h4 id="titleGenerate" >Create BAST Maintenance</h4></td>
                                </tr>
                                <tr>
                                    <td><h5>Maintenance :</h5></td>
                                    <td><Form.Control as="select"  name="idMaintenance"
                                                      onChange={this.handleChangeField} placeholder="Maintenance" title="Maintenance">
                                        <option value=''>-Pilih Maintenance-</option>
                                        {mnList.map((mn, index) => <option key={index} value={mn.idMaintenance}> Maintenance of {mn.dateMn.toString().substr(0,10)} (ID:{mn.idMaintenance}) </option>)}
                                    </Form.Control>
                                    </td>
                                </tr>
                                <tr>
                                    <td><br></br></td>
                                    <td><br></br></td>
                                </tr>
                                <tr>
                                    <td><h5>Tanggal Penyerahan:</h5></td>
                                    <td><Input type="date" name="dateHandover" onChange={this.handleChangeField}></Input></td>
                                </tr>
                                <tr>
                                    <td><br></br></td>
                                    <td><br></br></td>
                                </tr>
                                <tr>
                                    <td><h5>Periode Awal Maintenance:</h5></td>
                                    <td><Input type="date" name="startPeriod" onChange={this.handleChangeField}> </Input></td>
                                </tr>
                                <tr>
                                    <td><br></br></td>
                                    <td><br></br></td>
                                </tr>
                                <tr>
                                    <td><h5>Periode Akhir Maintenance:</h5></td>
                                    <td><Input type="date" name="endPeriod" onChange={this.handleChangeField}></Input></td>
                                </tr>
                                <tr>
                                    <td><br></br></td>
                                    <td><br></br></td>
                                </tr>
                                <tr>
                                    <td colSpan={2}>
                                        <CustomizedButtons variant="contained" size="small" color="#FD693E" onClick={() => this.handleSubmit()}>Create Preview BAST</CustomizedButtons>
                                    </td>
                                </tr>
                            </table>
                        </Form>
                    </Card>

                </div>
                :
                <div></div>
            }
                {isToCreate === true && isOption === false && isMaintenance === false && isPopup === false?
                    <div>
                        <Card id="option2">
                            <Form>
                                <table id="card-table2">
                                    <tr>
                                        <td colSpan={2}><h4 id="titleGenerate" >Create BAST Project Installation</h4></td>
                                    </tr>
                                    <tr>
                                        <td><h5>Proyek Installasi:</h5></td>
                                        <td>

                                            <Form.Control as="select" size="lg" name="idOrderPi"
                                                          onChange={this.handleChangeField}>
                                                <option value=''>-Pilih Proyek Installasi-</option>
                                                {piList.map((pi, index) => <option key={index} value={pi.idOrderPi}>Proyek Installasi - {pi.idOrderPi}</option>)}
                                            </Form.Control>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><br></br></td>
                                        <td><br></br></td>
                                    </tr>
                                    <tr>
                                        <td><h5>Tanggal Penyerahan:</h5></td>
                                        <td><Input type="date" name="dateHandover" onChange={this.handleChangeField}></Input></td>
                                    </tr>
                                    <tr>
                                        <td colSpan={2}>
                                            <CustomizedButtons variant="contained" size="small" color="#FD693E" onClick={() => this.handleSubmit()}>Create Preview BAST</CustomizedButtons>
                                        </td>
                                    </tr>
                                </table>

                            </Form>
                        </Card>

                    </div>
                    :
                    <div> </div>
                }
                {isPopup === true?
                    <div id="preview">
                        <Modal show={isPopup} handleCloseModal={this.handleCancel}>
                            <h2 style={{ marginTop: 0, marginBottom: 0}}><b>Preview BAST untuk order telah berhasil dibuat.</b></h2>
                            <a onClick={(event)=>this.handleClose(event)} href={"/laporan/admin"}><h6 id="highlighted3"> &#8810; Kembali ke Daftar Laporan</h6></a>
                        </Modal>
                    </div>
                    :
                    <div>
                    </div>}

            </div>
        );
    }

}

export default Bast;