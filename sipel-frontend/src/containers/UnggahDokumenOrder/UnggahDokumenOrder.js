import React from "react";
import { withRouter } from "react-router-dom";
import OrderDetailForUnggah from "../../components/Order/orderDetailForUnggah";
import APIConfig from "../../APIConfig";
import classes from "./styles.module.css";
import { Form, Button, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import { store } from "react-notifications-component";
import ReactNotification from "react-notifications-component";
import Modal from "react-bootstrap/Modal";
import authHeader from '../../services/auth-header';

class UnggahDokumenOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            idOrder: this.props.match.params.id,
            orderTarget: null,
            noPO: "",
            orderName: "",
            clientName: "",
            clientOrg: "",
            projectInstallation: false,
            managedService: false,
            file: null,
            verified: false,
            isFinishedUpload: false,
            isError: false,
            isCancel: false,
        };
        this.handleLookDetail = this.handleLookDetail.bind(this);
        this.checkTypeOrder = this.checkTypeOrder.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.checkStatusOrder = this.checkStatusOrder.bind(this);
        this.handleSubmitDocument = this.handleSubmitDocument.bind(this);
        this.handleCancelSubmit = this.handleCancelSubmit.bind(this);
        this.handleAfterUnggahDokumen = this.handleAfterUnggahDokumen.bind(this);
        this.handleConfirmCancel = this.handleConfirmCancel.bind(this);
        this.handleBack = this.handleBack.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orderItem  = await APIConfig.get(`/order/detail/${this.state.idOrder}`, { headers: authHeader() });
            this.setState({ orderTarget: orderItem.data });
            this.handleLookDetail();
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleLookDetail() {
        let order = this.state.orderTarget;
        this.setState({
            noPO: order.noPO,
            orderName: order.orderName,
            clientName: order.clientName,
            clientOrg: order.clientOrg,
            projectInstallation: order.projectInstallation,
            managedService: order.managedService,
            verified: order.verified,
        });
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

    checkStatusOrder(verif) {
        if(verif === true){
            return "Verified";
        }else {
            return "Not Verified";
        }
    }

    handleChangeFile(event){
        event.preventDefault();
        this.setState({[event.target.name]: event.target.files[0]});
    }

    async handleSubmitDocument(event) {
        event.preventDefault();
        if(this.state.file === null || this.state.file === ""){
            store.addNotification({
                title: "Peringatan!",
                message: "Anda wajib memasukkan file yang akan diunggah",
                type: "warning",
                container: "top-left",
                insert: "top",
                animationIn: ["animated", "fadeIn"],
                animationOut: ["animated", "fadeout"],
                dismiss: {
                    duration: 7000,
                    showIcon: true,
                },
                width: 500
            });
            return false;
        }
        try {
            let response;
            let newDocument;

            const dataDocument = new FormData();
            dataDocument.append("file", this.state.file);
            console.log(dataDocument);
            response = await APIConfig.post(`/order/${this.state.orderTarget.idOrder}/document/upload`, dataDocument, { headers: authHeader() });
            newDocument = response.data.result;
            this.loadData();
            this.setState({ isFinishedUpload: true });
        } catch(error) {
            this.setState({ isError: true });
            console.log(error);
        }
    }

    handleCancelSubmit = () => {
        this.props.history.push(`/order/order`);
    }

    handleConfirmCancel(){
        this.setState({ isCancel: true });
    }

    handleBack() {
        this.setState({ isCancel: false });
    }

    handleAfterUnggahDokumen = () => {
        this.props.history.push(`/order/detail/${this.state.idOrder}`, { headers: authHeader() });
    }

    handleAfterError = () => {
        this.setState({ isError: false });
        this.props.history.push(`/order/order`, { headers: authHeader() });
    }

    render() {
        const {
            isFinishedUpload,
            isError,
            isCancel
        } = this.state;
        
        return(
            <div className={classes.container}>
            <br></br>
            <h1 className={classes.title}>Unggah Dokumen Order</h1>
            <br></br>
            <div className="row" style={{ marginTop: 10 }}>
                <div className="col-sm-1"></div>
                <div className="col-sm-10">
                    <div className="card">
                        <div className="card-body">
                            <OrderDetailForUnggah 
                                noPO={this.state.noPO}
                                orderName={this.state.orderName}
                                jenis={this.checkTypeOrder(this.state.projectInstallation, this.state.managedService)}
                                clientName={this.state.clientName}
                                clientOrg={this.state.clientOrg}
                                status={this.checkStatusOrder(this.state.verified)}
                            />
                            <br></br>
                            <Form>
                            <Table borderless responsive="xl" size="md">
                                <ReactNotification />
                                <tr>
                                    <td><h5 className="d-flex justify-content-center" style={{color: "black"}}>Dokumen Order <p style={{color: "red"}}>&nbsp;&nbsp;*</p></h5></td>
                                </tr>
                                <tr>
                                    <td className="d-flex justify-content-center">
                                        <Form.File name="file" onChange={this.handleChangeFile}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td><div className={classes.requiredFill} style={{color: "red"}}>* Wajib diisi</div></td>
                                </tr>
                                <tr>
                                    <td className="d-flex justify-content-center">
                                    <Button className={classes.button2} onClick={this.handleSubmitDocument}>Simpan</Button>
                                        <span>&nbsp;&nbsp;</span>
                                    <Button className={classes.button3} onClick={() => this.handleConfirmCancel()}>&nbsp;&nbsp;Batal&nbsp;&nbsp;</Button>
                                    </td>
                                </tr>
                            </Table>
                        </Form>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isFinishedUpload} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header>
                    <div className="text-center">
                        <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Dokumen Order Berhasil Diunggah</h4>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <Button className={classes.button2} onClick={() => this.handleAfterUnggahDokumen()}>Kembali</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={isError} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                <Modal.Header>
                    <div className="text-center">
                        <h4>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Oops terjadi masalah pada server!
                        <br></br>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Harap coba beberapa saat lagi</h4>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <div className="text-center">
                        <Button className={classes.button2} onClick={() => this.handleAfterError()}>Kembali</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal show={isCancel} dialogClassName="modal-90w" aria-labelledby="contained-modal-title-vcenter">
                    <Modal.Header>
                        <div className="text-center">
                            <h4>&nbsp;&nbsp;&nbsp;&nbsp;Anda yakin batal mengunggah dokumen ?</h4>
                        </div>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="text-center">
                            <Button className={classes.button2} onClick={() => this.handleCancelSubmit()}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Ya&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Button>
                            <span>&nbsp;&nbsp;</span>
                            <Button className={classes.button3} onClick={() => this.handleBack()}>&nbsp;&nbsp;Tidak&nbsp;&nbsp;</Button>
                        </div>
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default withRouter(UnggahDokumenOrder);