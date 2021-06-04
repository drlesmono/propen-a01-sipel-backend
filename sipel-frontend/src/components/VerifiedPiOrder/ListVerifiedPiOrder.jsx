import React, { Component } from 'react'
import InstallationProjectService from "../../services/InstallationProjectService";
import classes from "./styles.module.css";



class ListVerifiedPiOrder extends Component {
    constructor(props) {
        super(props)

        this.state = {
            piOrders: []

        }
        this.retrieveListTask = this.retrieveListTask.bind(this);
    }

    retrieveListTask(id){
        this.props.history.push(`/list-task/${id}`); 

    }

    componentDidMount(){

        InstallationProjectService.getVerifiedOrderPi().then((res) => {
            this.setState({ piOrders: res.data});
        });
        
    }

    render() {
        
        return (
            <div className={classes.container}>
            <div>
            <div>
                <h2 className="text-center">Daftar Proyek Instalasi</h2>
                <div className = "row">
                    <table className = "table table-striped table-bordered">

                        <thead>
                            <tr>
                                <th>Nama Order</th>
                                <th>Target Selesai</th>
                                <th>Progres</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                this.state.piOrders.map(
                                    piOrder =>
                                    <tr key = {piOrder.idOrderPi}>
                                        <td>{piOrder.orderName}</td>
                                        <td>{piOrder.deadline}</td>
                                        <td>{piOrder.percentage + "%"}</td>
                                        <td>
                                            <button onClick = { () => this.retrieveListTask(piOrder.idOrderPi) } className="btn btn-info">Lihat Task</button>
                                        </td>

                                    </tr>

                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </div>
       )

    }
}

export default ListVerifiedPiOrder