import React, { Component } from 'react'
import InstallationProjectService from "../../services/InstallationProjectService";
import APIConfig from "../../APIConfig";
import classes from "./styles.module.css";


class ListTaskComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id, //jangan diapus, sblmnya id doang, jadi idPi
            //idTask: this.props.match.params.idTask,
            listTask: []

        }
        this.addTask = this.addTask.bind(this);
        this.editTask = this.editTask.bind(this);
        this.editProgres = this.editProgres.bind(this);
        this.deleteTask = this.deleteTask.bind(this);
        
    }

    deleteTask(idTask){
        InstallationProjectService.deleteTask(idTask).then( res => {
            this.setState({listTask: this.state.listTask.filter(task => task.idTask !== idTask)})
        });
        alert("Task Berhasil Dihapus");
    }

    editTask(id, idTask){
        this.props.history.push(`/update-task/${id}/${idTask}`);
    }

    editProgres(id, idTask){
        this.props.history.push(`/add-progress/${id}/${idTask}`);
    }


    componentDidMount(){

        InstallationProjectService.getListTaskByIdPi(this.state.id).then((res) => {
            this.setState({ listTask: res.data});
        });
        
    }

    addTask(idPi){
        this.props.history.push(`/add-task/${idPi}`); //diubah sblmnya idOrder
    }

    //dibutton tambah jadi idPi, sblmnya id doang
    //edit task jadi nambah idPi
    render() {
        return (
            <div className={classes.container}>
            <div>
                <h2 className="text-center">Daftar Task Order</h2>
                <div className="row">
                    <button onClick = { () => this.addTask(this.state.id) } className="btn btn-primary">+ Tambah Task</button>
                </div>
                <div className = "row">
                    <table className = "table table-striped table-bordered">

                        <thead>
                            <tr>
                                <th>Nama Task</th>
                                <th>Deskripsi Task</th>
                                <th>Progres Task</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                this.state.listTask.map(
                                    task =>
                                    <tr key = {task.idTask}>
                                        <td>{task.taskName}</td>
                                        <td>{task.description}</td>
                                        <td>{task.percentage + "%"}</td>
                                        <td>
                                            <button onClick = { () => this.editTask(this.state.id, task.idTask)} className="btn btn-info">Ubah Task</button>
                                            <button onClick = { () => this.editProgres(this.state.id, task.idTask)} className="btn btn-warning" style={{marginLeft: "10px"}}>Ubah Progres</button>
                                            <button onClick = { () => this.deleteTask(task.idTask)} className="btn btn-danger" style={{marginLeft: "10px"}}>Hapus Task</button>
                                        </td>

                                    </tr>

                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
            </div>
        )
    }
}

export default ListTaskComponent