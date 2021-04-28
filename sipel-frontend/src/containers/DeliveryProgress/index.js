import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";
import Modal from "../../components/Modal";
import { Form } from "react-bootstrap";

class DeliveryProgress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            verifiedPiOrders: [],
            isError: false
        };
        //this.handleEdit = this.handleEdit.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orders = await APIConfig.get("/delivery-progress");
            console.log(orders.data);
            this.setState({ verifiedPiOrders: orders.data });
            
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            this.setState({ isError: true });
            console.log(error);
        }
    }

}