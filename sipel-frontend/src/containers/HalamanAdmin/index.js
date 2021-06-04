import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import { Form, Button, Card, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";
import authHeader from '../../services/auth-header';
import axios from 'axios';

class HalamanAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            userTarget: null,
            usersFiltered: [],
            users: [],
            userFiltered: [],
            isFiltered: false,
            isError: false,
            isSuccess: false,
            isFailed: false,
            usernameTarget: "",
            role_name: "",
            messageError: null,
            isDelete: false,
            isConfirmDelete: false
            
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleCloseNotif = this.handleCloseNotif.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
        this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
    }
    
    componentDidMount() {
        this.loadData();
        
    }
    
    async loadData() {
        try {
            const users = await APIConfig.get("/all/users", { headers: authHeader() });
            console.log(users.data);
            this.setState({ users: users.data });
            
        } catch (error) {
            this.setState({ isError: true });
            console.log(error);
        }
    }

    handleEdit(user) {
        this.setState({
            isEdit: true,
            userTarget: user
        });
        
    }

    handleFilter(event){
        let newUserList = this.state.users;
        const { value } = event.target;
        if( value !== "" ){
            newUserList = this.state.users.filter(user => {
                return (user.username.toLowerCase().includes(value.toLowerCase()) ||
                user.role_name.toLowerCase().includes(value.toLowerCase()))
            });
            this.setState({ isFiltered : true });
        }else{
            this.setState({ isFiltered : false });
        }
        this.setState({ usersFiltered : newUserList });
    }


    handleConfirmDelete(user) {
        this.setState({
            isConfirmDelete: true,
            userTarget: user
        });
    }

    handleCancel(event) {
        event.preventDefault();
        this.setState({
            isEdit: false, 
            isReport: false, 
            isError: false, 
            isSuccess: false,
            isFailed: false,
            isConfirmDelete: false,
            isDelete: false,
            messageError: null
        });
        this.loadData();
    }

    handleCloseNotif(){
        this.setState({ isFailed: false, messageError: null });
    }

    handleChangeField= (event) => {
        this.setState({role_name: event.target.value});
    }

    handleSave = (e) => {
        e.preventDefault();
        let user = {username: this.state.userTarget.username, role_name: this.state.role_name};
        console.log('user => ' + JSON.stringify(user));
        const URL = "http://localhost:2020/api/v1/user/updateRole";
        axios.put(URL, user, { headers: authHeader() });
        this.setState({isSuccess: true});
    }

    handleDelete() {
        
        let user = {username: this.state.userTarget.username};
        console.log('user => ' + JSON.stringify(user));
        const URL = "http://localhost:2020/api/v1/delete-user/";
        const usr = this.state.userTarget.username;
        axios.delete(URL+usr, { headers: authHeader() });
        
        this.setState({
            isDelete: true,
        });
        
    }

    handleValidation(event){
        event.preventDefault();
        if(this.state.role_name === ""){
            return this.setState({isFailed: true, messageError: "Role wajib dipilih"});
        }

        this.handleSave(event);
    }


    render() {
        const { isEdit, users, usersFiltered, isConfirmDelete, isFailed, messageError, userTarget, role_name, isError, isSuccess, isDelete, isFiltered } = this.state;
        const tableHeaders = ['Nomor', 'Username', 'Role', 'Aksi'];                  
        const tableRows = isFiltered ? usersFiltered.map((user) =>
                        [  <div className="d-flex justify-content-center">{user.username}</div>,
                            <div className="d-flex justify-content-center">{user.role_name}</div>,
                            <div className="d-flex justify-content-center">
                            <Button className={classes.button4} onClick={() => this.handleEdit(user)}>Ubah Role</Button>
                            <Button className="btn btn-danger" onClick={() => this.handleConfirmDelete(user)} style={{marginLeft: "5px"}}>Hapus Role</Button></div>])
                        : users.map((user) =>
                        [ <div className="d-flex justify-content-center">{user.username}</div>,
                        <div className="d-flex justify-content-center">{user.role_name}</div>,
                        <div className="d-flex justify-content-center">
                            <Button className={classes.button4} onClick={() => this.handleEdit(user)}>Ubah Role</Button>
                            <Button className="btn btn-danger" onClick={() => this.handleConfirmDelete(user)} style={{marginLeft: "5px"}}>Hapus Role</Button>
                        </div>])

        return (
            
            <div className={classes.container}>
                <div><h1 className="text-center">Daftar Pengguna Sistem</h1></div>
                <br></br>
                <div className="d-flex justify-content-end" style={{padding: 5}}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter} className={classes.search}/></div>
                <br></br>
                <div>{ users.length !== 0 ? <CustomizedTables headers={tableHeaders} rows={tableRows}/> : <p className="text-center" style={{color: "red"}}>Belum terdapat Pengguna</p>}</div>
                <Modal
                    show={isEdit}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                    <Modal.Header closeButton onClick={this.handleCancel}>
                        
                    <Modal.Title id="contained-modal-title-vcenter">
                        Ubah Role Pengguna
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
                                <Form>
                                    <Table borderless responsive="xl" size="sm">
                                        <tr>
                                            <td><p className="d-flex">Pilih Role<p style={{color: "red"}}>*</p></p></td>
                                            <td>
                                                <Form.Control
                                                as="select"
                                                size="lg"
                                                name="role_name"
                                                value={ this.state.value }
                                                onChange={this.handleChangeField}>
                                                <option value="None">None</option>
                                                <option value="Admin">Admin</option>
                                                <option value="Manager">Manager</option>
                                                <option value="Engineer">Engineer</option>
                                                <option value="Data Entry">Data Entry</option>
                                                <option value="Finance">Finance</option>
                                                </Form.Control>   
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{color: "red"}}>*Wajib dipilih</td>
                                            <td className="d-flex justify-content-end">
                                                    <Button variant="primary" className={classes.button1} onClick={this.handleValidation}>
                                                        Simpan
                                                    </Button>
                                            </td>
                                        </tr>
                                    </Table>
                                </Form>
                            </p>
                    </Modal.Body>
                </Modal>
                
                <Modal
                    show={isSuccess || isDelete}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                     <Modal.Header closeButton onClick={this.handleCancel}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Notification
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                                <br></br>
                                <div className="d-flex justify-content-center"><strong>{isSuccess ? "Role pada pengguna berhasil disimpan" : "Pengguna berhasil dihapus"} </strong></div><br></br>
                                <div className="d-flex justify-content-center">
                                </div> 
                                <div className="d-flex justify-content-center">
                                <Button className="btn btn-success" onClick={this.handleCancel}>Kembali</Button>
                                </div>
                                <br></br>
                                                        
                    </Modal.Body>
                </Modal>

                <Modal
                    show={isConfirmDelete}
                    dialogClassName="modal-90w"
                    aria-labelledby="contained-modal-title-vcenter"
                >
                     <Modal.Header closeButton onClick={this.handleCancel}>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Konfirmasi Penghapusan Role
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                                <br></br>
                                <div className="d-flex justify-content-center"><strong>Apakah Anda yakin untuk mengahpus pengguna?</strong></div><br></br>
                                <div className="d-flex justify-content-center">
                                </div> 
                                <div className="d-flex justify-content-center">
                                <Button className={classes.button3} onClick={this.handleCancel}>
                                    Batal
                                </Button>
                                <Button className={classes.button1} style={{marginLeft: "7px"}} onClick={this.handleDelete}>
                                    Hapus
                                </Button>
                                </div>
                                <br></br>
                                
                                

                                                        
                    </Modal.Body>
                </Modal>

            </div>

        );
    }
}

export default HalamanAdmin;