import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
import Modal from "../../components/Modal";
import {Form, Card, Table} from "react-bootstrap";
import { Input, FormControlLabel } from "@material-ui/core";
import classes from "./style.css";
import "./style.css";
import authHeader from '../../services/auth-header';


class Progress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress:[],
            filteredProgress:[],
            isFiltered: false,
            isPi: true,
            isMs: true,
        };
        this.handleFilter = this.handleFilter.bind(this);
        this.handlePi = this.handlePi.bind(this);
        this.handleMs = this.handleMs.bind(this);
        this.handleAll = this.handleAll.bind(this);

    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const progressList = await APIConfig.get("/order/progress", { headers: authHeader() });
            this.setState({ progress: progressList.data,
                }
                );
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    handleFilter(event){
        let progressList = this.state.progress;
        const { value } = event.target;
        if( value !== "" ){
            progressList = this.state.progress.filter(prog => {
                return (prog.orderName.toLowerCase().includes(value.toLowerCase()) ||
                    prog.tipeOrder.toLowerCase().includes(value.toLowerCase()))
            });
            this.setState({ isFiltered : true });
        }else{
            this.setState({ isFiltered : false });
        }
        this.setState({ filteredProgress : progressList });
        console.log(this.state.filteredProgress);
    }

    async handleAll(event){
        let progressList = this.state.progress;
        this.setState({ filteredProgress : progressList,
            isPi: true,
            isMs: true});
    }

    async handleMs(event){
        let progressList = this.state.progress;
        let value = "managed";
        progressList = this.state.progress.filter(prog => {
            return (prog.tipeOrder.toLowerCase().includes(value.toLowerCase()) )
        });
        this.setState({ isFiltered : true,
            isPi: false,
            isMs: true
        });

        this.setState({ filteredProgress : progressList });

    }

    async handlePi(event){
        let progressList = this.state.progress;
        let value = "proyek";
        progressList = this.state.progress.filter(prog => {
            return (prog.tipeOrder.toLowerCase().includes(value.toLowerCase()) )
        });
        this.setState({ isFiltered : true,
            isPi: true,
            isMs: false
        });

        this.setState({ filteredProgress : progressList });

    }


    render() {
        const tableHeaders = ['No','Order', 'Tipe Order', 'Status', 'Progress'];
        let {progress, filteredProgress, isFiltered, isPi, isMs} = this.state;
        const tableRows = isFiltered ?
            filteredProgress.map((prog) =>
                [prog.orderName, prog.tipeOrder, prog.statusOrder, prog.completionPercentage+"%"])
            : progress.map((prog) =>
            [prog.orderName, prog.tipeOrder, prog.statusOrder, prog.completionPercentage+"%"]

        )

        return(
            <div class="test">
                <div><h1 class="text-center">Daftar Progress</h1></div>
                {isPi === true ?
                    <div>
                        {isMs === true ?
                            <div>
                                <CustomizedButtons variant="contained" size="small" color="#2F3F58" onClick={(event)=>this.handleMs(event)}>Managed Services</CustomizedButtons>
                                <CustomizedButtons variant="contained" size="small" color="#2F3F58" onClick={(event)=>this.handlePi(event)}>Proyek Instalasi</CustomizedButtons>
                            </div>
                            :
                            <div>
                                <CustomizedButtons variant="contained" size="small" color="#2F3F58" onClick={(event)=>this.handleAll(event)}>All</CustomizedButtons>
                                <CustomizedButtons variant="contained" size="small" color="#2F3F58" onClick={(event)=>this.handleMs(event)}>Managed Services</CustomizedButtons>
                            </div>
                        }
                    </div>

                    :
                    <div>
                        <CustomizedButtons variant="contained" size="small" color="#2F3F58" onClick={(event)=>this.handleAll(event)}>All</CustomizedButtons>
                        <CustomizedButtons variant="contained" size="small" color="#2F3F58" onClick={(event)=>this.handlePi(event)}>Proyek Instalasi</CustomizedButtons>
                    </div>
                }
               <Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter} className="search"/>
                <CustomizedTables headers={tableHeaders} rows={tableRows} class="tbl"/>
            </div>
        );
    }

}

export default Progress;