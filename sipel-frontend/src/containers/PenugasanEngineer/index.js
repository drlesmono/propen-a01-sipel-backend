import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import CustomizedButtons from "../../components/Button";

class PenugasanEngineer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [ {items : [10,  '000010/I/PO-LA/2021', 'PIMS-190621/PT.Aplikasinusa', 'Project Installation (PI), Managed Service (MS)', 'Belum ditugaskan', 'Belum ditugaskan']},
            {items : [9,  '000010/I/PO-LA/2021', 'PIMS-190621/PT.Aplikasinusa', 'Project Installation (PI), Managed Service (MS)', 'Belum ditugaskan', 'Belum ditugaskan']}],
            isLoading: false,
        }; 
    }
    
    componentDidMount() {
        this.loadData();
    }
    
    async loadData() {
        try {
            const { data } = await APIConfig.get("/ordersVerified");
            this.setState({ ordersVerified: data});
        } catch (error) {
            alert("Oops terjadi masalah pada server");
            console.log(error);
        }
    }

    render() {
        const { ordersVerified} = this.state;
        const tableHeaders = ['No.', 'Id Order', 'Nomor PO', 'Nama Order', 'Tipe', 'PIC PI', 'PIC MS', 'Aksi'];

        ordersVerified.forEach((order) => {
            order.items.push(<CustomizedButtons variant="contained" size="small" color="#FD693E">perbarui</CustomizedButtons>);
            order.items.splice(7, 1);
        });

        return (
            <div>
                <h1>Daftar Order</h1>
                <CustomizedTables headers={tableHeaders} rows={ordersVerified}/>
            </div>
        );
    }
}

export default PenugasanEngineer;