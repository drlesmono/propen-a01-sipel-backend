import React, { Component } from "react";
import Table from "../../components/Table";

class PenugasanEngineer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orders: [],
            isLoading: false,
        }; 
    }
    
    componentDidMount() {
        console.log("componentDidMount()");
    }
    
    shouldComponentUpdate(nextProps, nextState) {
        console.log("shouldComponentUpdate()");
    }

    render() {
        return (
            <div>
                <h1>Daftar Order</h1>
                <Table></Table>
            </div>
        );
    }
}

export default PenugasanEngineer;