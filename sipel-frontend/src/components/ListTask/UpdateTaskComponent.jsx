import React, { Component } from 'react'
import InstallationProjectService from "../../services/InstallationProjectService";

class UpdateTaskComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
            idPi: this.props.match.params.idPi,
            idTask: this.props.match.params.idTask,
            taskName: '',
            description: ''

        }
        this.changeTaskNameHandler = this.changeTaskNameHandler.bind(this);
        this.changeDescriptionHandler = this.changeDescriptionHandler.bind(this);
        this.updateTask = this.updateTask.bind(this);
    }

    componentDidMount(){
        InstallationProjectService.getTaskByIdTask(this.state.idTask).then( (res) =>{
            let task = res.data;
            this.setState({taskName: task.taskName, description: task.description});
        });
    }
    
    changeTaskNameHandler= (event) => {
        this.setState({taskName: event.target.value});
    }

    changeDescriptionHandler= (event) => {
        this.setState({description: event.target.value});
    }
    
    updateTask = (e) => {
        e.preventDefault();
        let task = {taskName: this.state.taskName, description: this.state.description};
        console.log('task => ' + JSON.stringify(task));
        
        InstallationProjectService.updateTaskModel(task, this.state.idTask).then( res => {
            this.props.history.push(`/list-task/${this.state.idPi}`)
        });
        alert("Data Task Berhasil DiUbah");
    }

    cancel(){
        this.props.history.push(`/list-task/${this.state.idPi}`); //harusnya ke list-task/id
    }

    render() {
        return (
            <div>
                <br/><br/>
                <div className="container">
                    <div className="row">
                        <div className = "card col-md-6 offset-md-3 offset-md-3">
                            <br/>
                            <h3 className="text-center">Ubah Data Task</h3>
                            <div className = "card-body">
                                <form>
                                    <div className="form-group">
                                        <label> Nama Task: </label>
                                        <input placeholder="Nama Task" name="taskname" className="form-control" 
                                            value={this.state.taskName} onChange={this.changeTaskNameHandler}/>
                                    </div>
                                    <div className="form-group">
                                        <label>Deskripsi Task</label>
                                        <input placeholder="Deskripsi Task" name="description" className="form-control" 
                                            value={this.state.description} onChange={this.changeDescriptionHandler}/>
                                    </div>

                                    <button className="btn btn-success" onClick={this.updateTask}>Simpan</button>
                                    <button className="btn btn-danger" onClick={this.cancel.bind(this)} style={{marginLeft: "10px"}}>Batal</button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UpdateTaskComponent