import React, { Component } from "react";
import APIConfig from "../../APIConfig";
import CustomizedTables from "../../components/Table";
import { Form, Button, Card, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./style.css";
import jsPDF from "jspdf";

class ReportAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ordersVerified: [],
            reports: [],
            listIr: [],
            listMr: [],
            listPi: [],
            listMs: [],
            listMaintenance: [],
            reportsFiltered: [],
            isInstallationReport: false,
            reportTarget: null,
            orderTarget: null,
            maintenanceTarget: null,
            orderByPO: null,
            file: null,
            notes: null,
            isValid: true,
            messageError: null,
            reportNum: null,
            bastList:[],
            orderList:[],
            isPreview: false,
            termList: [],
        };
        this.handleChangeField = this.handleChangeField.bind(this);
        this.handleFilter = this.handleFilter.bind(this);
        this.handlePreview = this.handlePreview.bind(this);
        this.handleDownload = this.handleDownload.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    async loadData() {
        try {
            const orders = await APIConfig.get("/ordersVerifiedReport");
            const order = await APIConfig.get("/laporan/order");
            const reports = await APIConfig.get("/reports/all");
            const listIr = await APIConfig.get("/reports/ir");
            const listMr = await APIConfig.get("/reports/mr");
            const listPi = await APIConfig.get("/orders/pi");
            const listMs = await APIConfig.get("/orders/ms");
            const listTerm = await APIConfig.get("/orders/ms/perc");
            const bast = await APIConfig.get("/laporan/bast");
            this.setState({ ordersVerified: orders.data, reports: reports.data, listIr: listIr.data,
                listMr: listMr.data, listPi: listPi.data, listMs: listMs.data, bastList: bast.data, orderList: order.data,
                termList: listTerm.data});
        } catch (error) {
            this.setState({ isError: true, messageError: "Oops terjadi masalah pada server" });
            console.log(error);
        }
    }


    handleChangeField(event) {
        event.preventDefault();
        const { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handlePreview(laporan){
        this.setState({
            reportTarget:laporan,
            isPreview: true
        });
    }

    getOrder(report){
        if(report.reportType === "installation"){
            const ir = this.getIr(report.idReport);
            if(ir !== null){
                const pi = ir.idOrderPi;
                return pi.idOrder;
            }
        }else{
            const mr = this.getMr(report.idReport);
            if(mr !== null){
                const maintenanceTarget = mr.idMaintenance;
                for(let i=0; i<this.state.listMs.length; i++){
                    if(this.state.listMs[i].listMaintenance !== null){
                        const listMaintenance = this.state.listMs[i].listMaintenance.filter(maintenance =>
                            maintenance.idMaintenance === maintenanceTarget.idMaintenance);
                        if(listMaintenance.length !== 0){
                            const ms = this.state.listMs[i];
                            return ms.idOrder;
                        }
                    }
                }
            }
        }

        return null;
    }
    getOrderPO(report){
        if(report.reportType === "installation"){
            const ir = this.getIr(report.idReport);
            if(ir !== null){
                const pi = ir.idOrderPi;
                return pi.idOrder.noPO;
            }
        }else{
            const mr = this.getMr(report.idReport);
            if(mr !== null){
                const maintenanceTarget = mr.idMaintenance;
                for(let i=0; i<this.state.listMs.length; i++){
                    if(this.state.listMs[i].listMaintenance !== null){
                        const listMaintenance = this.state.listMs[i].listMaintenance.filter(maintenance =>
                            maintenance.idMaintenance === maintenanceTarget.idMaintenance);
                        if(listMaintenance.length !== 0){
                            const ms = this.state.listMs[i];
                            return ms.idOrder.noPO;
                        }
                    }
                }
            }
        }
        if(report.reportType === "BAST"){
            const idChecker = report.idReport;
            const bastList = this.state.bastList;
            const orderList = this.state.orderList;
            let idPi = 0;
            let idMs = 0;
            for(let i=0; i<bastList.length; i++){
                if(bastList[i].idReport === idChecker){
                    console.log(bastList[i])
                    idPi = bastList[i].idOrderPi;
                    idMs = bastList[i].idOrderMs;
                }
            }
            for(let j=0; j<orderList.length; j++){
                const order = orderList[j];
                if(idPi === null){
                    const orderMs = order.idOrderMs;
                    if (orderMs === idMs){
                        return order.noPO
                    }
                }
                else{
                    const orderPi = order.idOrderPi;
                    if (orderPi === idPi){
                        return order.noPO
                    }
                }
            }

        }

        return null;
    }
    getIsBast(report){
        if(report.reportType === "BAST") {
            return true;
        }
        else{
            return false;
        }
    }

    getApproval(report){
        return report.statusApproval;
    }

    getOrderOrg(report){
        if(report.reportType === "installation"){
            const ir = this.getIr(report.idReport);
            if(ir !== null){
                const pi = ir.idOrderPi;
                return pi.idOrder.clientOrg;
            }
        }else if(report.reportType === "maintenance") {
            const mr = this.getMr(report.idReport);
            if(mr !== null){
                const maintenanceTarget = mr.idMaintenance;
                for(let i=0; i<this.state.listMs.length; i++){
                    if(this.state.listMs[i].listMaintenance !== null){
                        const listMaintenance = this.state.listMs[i].listMaintenance.filter(maintenance =>
                            maintenance.idMaintenance === maintenanceTarget.idMaintenance);
                        if(listMaintenance.length !== 0){
                            const ms = this.state.listMs[i];
                            return ms.idOrder.clientOrg;
                        }
                    }
                }
            }
        }
        if(report.reportType === "BAST"){
            const idChecker = report.idReport;
            const bastList = this.state.bastList;
            const orderList = this.state.orderList;
            let idPi = 0;
            let idMs = 0;
            for(let i=0; i<bastList.length; i++){
                if(bastList[i].idReport === idChecker){
                    console.log(bastList[i])
                    idPi = bastList[i].idOrderPi;
                    idMs = bastList[i].idOrderMs;
                }
            }
            for(let j=0; j<orderList.length; j++){
                const order = orderList[j];
                if(idPi === null){
                    const orderMs = order.idOrderMs;
                    if (orderMs === idMs){
                        return order.clientOrg
                    }
                }
                else{
                    const orderPi = order.idOrderPi;
                    if (orderPi === idPi){
                        return order.clientOrg
                    }
                }
            }

        }

        return null;
    }


    getPi(idOrder){
        let pi = this.state.listPi.filter(pi => pi.idOrder.idOrder === idOrder );
        if (pi.length !== 0) {
            return pi[0];
        }
        return null;
    }

    getMs(idOrder){
        let ms = this.state.listMs.filter(ms => ms.idOrder.idOrder === idOrder);
        console.log(ms);
        if (ms.length !== 0) {
            console.log(ms[0]);
            return ms[0];
        }
        return null;
    }

    getIr(idReport){
        let ir = this.state.listIr.filter(ir => ir.idReport.idReport === idReport);
        if (ir.length !== 0) {
            return ir[0];
        }
        return null;
    }

    getMr(idReport){
        let mr = this.state.listMr.filter(mr => mr.idReport.idReport === idReport);
        if (mr.length !== 0) {
            return mr[0];
        }
        return null;
    }

    getReportNum(report){
        if(report.reportType === "installation"){
            if(this.getIr(report.idReport) !== null){
                return this.getIr(report.idReport).irNum;
            }
        }else{
            if(this.getMr(report.idReport) !== null){
                return this.getMr(report.idReport).mrNum;
            }
        }
        return null;
    }

    getBastNum(report){
        const idChecker = report.idReport;
        const bastList = this.state.bastList;
        for(let i=0; i<bastList.length; i++){
            if(bastList[i].idReport === idChecker){
                return (bastList[i].bastNum);
            }
        }
    }

    getUrl(report){
        if(report.fileType === "application/pdf"){
            return report.urlFile+"/preview";
        }else{
            return report.urlFile;
        }
    }

    getToDownload(report){
        return report.urlFile;
    }

    getNotes(report){
        if(report.reportType === "installation"){
            const ir = this.getIr(report.idReport);
            if(ir !== null){
                if(ir.notes !== null){
                    return ir.notes;
                }
            }
        }else{
            const mr = this.getMr(report.idReport);
            if(mr !== null){
                if(mr.notes !== null){
                    return mr.notes;
                }
            }
        }
        return "-";
    }

    getDate(value){
        let date = new Date(value);
        const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
        return date.getDate()+" "+monthNames[date.getMonth()]+" "+date.getFullYear();
    }

    handleFilter(event){
        const { value } = event.target;
        let laporanList = this.state.reports;
        if(value !== null){
            if(value === ""){
                this.setState({ isFiltered: false });
            }
            else{
                laporanList = this.state.reports.filter(laporan => {
                    return(laporan.reportType.toLowerCase().includes(value.toLowerCase()) ||
                        laporan.reportName.toLowerCase().includes(value.toLowerCase()))
                })
                this.setState({ isFiltered: true,
                    reportsFiltered: laporanList
                });
            }
        }
        else{
            this.setState({ isFiltered: false });
        }
    }
    async handleDownload(laporan){
        const report = laporan;
        //const nomor = report.reportName;
        //console.log(report);
        const bastList = this.state.bastList;
        //console.log(bastList);
        var tipe;
        const id = laporan.idReport;
        var bast;
        for(let i=0; i<bastList.length; i++){
            if(bastList[i].idReport === id){
                var bast = bastList[i];
            }
        }
        let bastNum = bast.bastNum;
        let dateHandover = bast.dateHandover.substr(0, 10);
        let picName = bast.picName;
        let endP = bast.endPeriod;
        let dateHO = new Date(bast.dateHandover);
        dateHO = dateHO.getDay();

        let mn = bast.idMaintenance;
        let pi = bast.idOrderPi;
        let ms = bast.idOrderMs;
        let terms = this.state.termList;
        let term = Object.values(terms)[parseInt(mn)-1];

        const orderList = this.state.orderList;
        const mnList = this.state.mnList;
        var selectedOrder;
        for(let x=0; x<orderList.length;x++){
            let order = orderList[x];
            if(order.projectInstallation === true){
                if(order.idOrderPi === pi){
                    var selectedOrder = order;
                    var tipe = "pi";
                }
            }
            if(order.managedService === true){
                if(order.idOrderMs === ms){
                    var selectedOrder = order;
                    var tipe = "mn";
                }
            }
        }

        var end, start;
        let d1 = 0;
        let d2 = 0;
        let m1 = 0;
        let m2=0;
        let y1=0;
        let y2 =0;
        if(tipe.toLowerCase() === "mn"){
            var end = bast.endPeriod.substr(0, 10);
            var start = bast.startPeriod.substr(0, 10);

            let listBulan = ["", "Januari", "Februari", "Maret",  "April",
                "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]

            m1 = listBulan[parseInt(start.substr(5, 2))];
            m2 = listBulan[parseInt(end.substr(5, 2))];
            d1 = start.substr(8, 2);
            d2 = end.substr(8, 2);
            y1 = start.substr(0, 4);
            y2 = start.substr(0, 4);
        }

        let namaOrder = selectedOrder.orderName;
        let deskripsi = selectedOrder.description;
        let namaKedua = selectedOrder.clientName;
        let divisiKedua = selectedOrder.clientDiv;
        let organisasiKedua = selectedOrder.clientOrg;
        let picKedua = selectedOrder.clientPIC
        let po = selectedOrder.noPO;
        let sph = selectedOrder.noSPH

        var doc = new jsPDF('p', 'pt', 'a4',);
        doc.setFontSize(10);
        doc.setFont("times new roman")
        var doc = new jsPDF();
        var img = new Image();
        img.src= "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/4SfERXhpZgAATU0AKgAAAAgABgALAAIAAAAmAAAIYgESAAMAAAABAAEAAAExAAIAAAAmAAAIiAEyAAIAAAAUAAAIrodpAAQAAAABAAAIwuocAAcAAAgMAAAAVgAAEUYc6gAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFdpbmRvd3MgUGhvdG8gRWRpdG9yIDEwLjAuMTAwMTEuMTYzODQAV2luZG93cyBQaG90byBFZGl0b3IgMTAuMC4xMDAxMS4xNjM4NAAyMDIxOjA0OjIxIDA5OjUxOjM5AAAGkAMAAgAAABQAABEckAQAAgAAABQAABEwkpEAAgAAAAMzMgAAkpIAAgAAAAMzMgAAoAEAAwAAAAEAAQAA6hwABwAACAwAAAkQAAAAABzqAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAyMTowNDoyMSAwOTo1MDoxOQAyMDIxOjA0OjIxIDA5OjUwOjE5AAAAAAYBAwADAAAAAQAGAAABGgAFAAAAAQAAEZQBGwAFAAAAAQAAEZwBKAADAAAAAQACAAACAQAEAAAAAQAAEaQCAgAEAAAAAQAAFhcAAAAAAAAAYAAAAAEAAABgAAAAAf/Y/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8AAEQgAagDIAwEhAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/aAAwDAQACEQMRAD8A9/ooAbmih33FqnYKM0tNw8haKYxM0UaAJn0pcUeQu46igY3vS5ApeYDf50D360xK9xScUn05pJj0egCl7UK3QNUFLxincN9GLRQAUUAZGp2GpXLo1jqhswq4K+Sr7j68151rPiDxZomqPYzahG7Bd6MsK4ZT0PT2P5V24WEasuVnlZjVq0oc6DSNf8Ya3ffZbW8TKjLu8SbUHqeK7qw0vXopYpLzXRMqsC8a2yqGHpnrTxUKVOXKicBOtWjzs6KiuE9c5vVdO1+R5ZdO1mOIHlIXt1IHHTd1/wD115+PFvilbiaCS9VZInKOvlLwQcHtXoYWnSq6M8bHVa1GUbHV+BvEV7qst5a6lMJJ49rodoX5Twenvj867cVy4mHs6ljuwVV1aSmx1FYnWNrjvG3iWXRreK2smAvpjkHAOxB35/L862w8PaVOU5cZV9lRlM5nQvFPiG/8Q2NlPeB45ZBvHlKMqOT0HtWz478S6jo97aW2nzCIshd/lDZ5wOv0P512Sw0VXjTPKhjan1WVTzOe0/xH411Z2WwkM+wjcREgC59yK2RH8RyM+bAD6Hy/8KdaFCnKwUKuKrQ50VLrXPHukKXvLVJY16v5IZR/3yadp/xRm3KuoacrL3e3bB/I/wCNH1WnVjemH16rh5fvTvNJ1yw1m2E1lMHH8S9GX6jtWpmvOlFxlZntUqyqx5kLRUmoUUANPSvIvHs4k8YOB/yygRD+p/8AZq7cvX735HlZu/8AZ7eZ0XwytQNLvLsjmWbaPooH9Sa7sdKyxbvWl6nRl8bYeHoOornO0jfoa8ZDrPrOpTA5V7qQj6bjiu/AbtnlZnb3UXdCuf7N8XWkpO1JyYXP+90/XFetDpmox0ffTLy1+5KPmPorjPSKOo38OmWE15cMFiiQs3+FeMXVzc6rcSa3dcLPMYo1PYAZwPYcD8a9HAQs3PvoeLm07rk7am14HiFx4xDj/ljA7/ngf1qv4/nE/i6ZM5EESJ/7N/7NXVHXF+iPPlpgPVnU/DK32aDcTkczXB/IACu4wK8vFO9aXqe7l8bYeHoN2g8EV55438HxeRLqunRbJE+aeNRwy9SwHqKrCVfZ1Lk5hhlVpOxxWl6hc6PeRahaMcqfnXPDr3Br2/Tr2HUrCC8gbMUqBlrpzCGqkjiyepeLp/MuUV5p7gtFADD0rwzxHcfafE2qzZ4E7J/3z8v9K9DLV779Dxc5f7qK8z0/wJb/AGfwjZ8YMgaQ/iTXTVx13epL1PSwqtRivIWiszoKd/MLawuJ2OBFGzk/QE14t4Yhl1PVxag4MiSOSPXaf64r0cFpTnI8PM0/bU0V5rmR0DcrNE34gg17ZpF6uoaVa3a4xLGrH2JHI/Oqx8fcixZVUvVlE0aQng15h7p5l4z1CfxBrtv4a08llVwZ2HQN7+wHP/6qo+N7eLTJNJ0m3GI7aAvj1JOMn64NerQ91wp/M+exj54VKnyND4Zwb7rU7s84CRg/mT/SuS8QT/afEOqTdvPZc/Q4/pW1PXEy9Dlr6YKmu56r4It/s3hGwXHLKXP/AAJif610deRWd6kvU+kwqtQgvIMVFJGskTIwDKQQQe9Qt7msleLR4jdWQtNTv7H+CGZ0X6Z4/Su8+G10X0e5tGJP2ac7c9g3P88162K96gpHz2XrkxTXqjuKK8g+jCigCCeQRQO56KpNfPk8xnaaY8mVyxPrk5r08uXxM8HOn8ET3jR7f7Jo9nbn70cCKfwAzWj2rzpayPaoq0ELSVJoYHjO4+zeEtRbOC0RjH/AuP61wfwxt/N126nIyIrfb+LEf4Gu+jphZvzPGxXvY2mvIzvFVj/Z3ii+hCkJMfOT3Dcn9ciu0+G1/wCdoklmx+e1lIA/2W5H65rfEe/hVL0OTBfu8a4ebO3rnvFuvpoGiyThh9okykCnu3r9B1rzKceaaR72In7OlKXkY/w90B7SzfVrsFry8+YFuqoTn8z1rlPHdx5/i+5GciGNIx+Wf5k16OHlz4ps8XGx5MFFeZ1Pw8QWnhW6vHGA8rvn2VQP5g15hK5kEkjZLSMWz6k1vh/4tSXmcmMVsPRj5Hv+mW32TTLa3/55RKn5DFXK8aWsj6ekrQSFpD0qUaHjOssr+KtVK9POI/IAH+VdL8MwSNVfsZUH5A16+I/3b5I+dwv+9/NnoVFeQfRBRQBjeJ7j7L4b1CXOCIHAPuRgfzrxTT7f7RqFjbf89Z0T82Ar1cBpTkz53NnzV4RPoFBhQB0xTq8s+gSskhaTNIo4j4nXHleGo4R1muFUj2AJ/oKpfCuDFhqF1j78wjH4DP8A7NXoR0wj9Txpe9mKXZDPibY7TY6kq8gmFyPfkf1rI8A34svFIgLYS8Qpj1YZI/kfzren7+EaOSt+7zFPzR608ixqWYgKBkk9hXlyb/H3jQuQTpNl0B/iH/2R/QVw4f3U59j1cY+ZxpfzM9RAEaAKMKBgD0rwnXbn7Vr+pz5yGuHAPsDgfoK6ctV6kmcOc6U4x8z0C3/4lnwqZ/us9ozA+79P/Qq850u3+1arp9uR/rJ0H1BIrfDv3akvM5MYrzpR8ke/KMACnd68Y+mWiQVDPMkMDyucIilmJ7AU1uE3aNzwx7rz57u8Y8zyvJ/30c16V8PLNrfw0JXGGuZWlH06D+Wfxr1sZ7tC3mj5/LffxF/U7CivIPogooA5D4i3PkeFJEB5mlSP685/pXA+D7YXHi3T1YZWJi/5A4/XFerhdMLNnzuP97GwXp+Z7bRXlH0Q2qt5e29havc3MgjhT7zHtk4pLV2FJ2V+x558Urvc2m246EPL/ID+tdB8O7fyPCcLEYaaR3J9ecfyAr0ammEivM8ej72YSfkaHi/TzqXhm9hQfvFj8yP/AHl5H8q8atbp7O5tryMfvIHVxj2PStsA+alKJy5quXEQn/Wh6D478RlrCDStNJkuL9QTs6hD0H/Aun0zXR+FdCTQNGhtQAZW+eZh3Y/4dK5Ki9nRUe+p6NCXtq7qdtDWvZRb2k0xOAkbMT9BXz8xaVWbo0jE/nXRl2nMzizrWUInqHjYrp/gaCzXgMYoQPoM/wDstcf4Lt/tHi+wBGREGkI+inH6kVpQdsNNmOJjfGU16HtQGKWvIPpRma434ga2un6MbGN/9IuwUx6J/Efx6fjWuHg51VFHJjaip0HJnm+lWM2sahb6bADmRhvb+6vc/lXulpbR2lrFbxLtjjUIo9AOK7cxneSgedk1P3XVLNFeae4FFAHnXxOuMwadaA/ekaUj6DAP6msv4dW4fxPNKcHyrY49iWH9M16sNMGz52p72Ypeh6xS15R9ERvIqKWYgAdSe1cONSHi7xVHaWzb9L09hNK46TSD7o+gP54rWlDRyOWvUs4w7nKfEe4E3irYCMQQKn8yf516h4ctvsnhzToMYKwJuHvjJ/WuvE6UKaODA+9iqr8zSfDDBAII5zXg+r2g0rWL6xYECOUhAeynkfoRTy1+/KJGdR9yMjrPh7oT3l2dcvQzLF+7tt3OSBgn6AAAfjXp4HArDGSvVce2h2ZdT5KKffUwvGF0LXwrqD5xuhKD/gXy/wBa8e0iD7TrGm2+N2+4QH6bhn9K68FpRlI87NHfEwidx8Trj93ptqD1Z5CPpgD+Zqh8Nbfzdfu5yOIYNufQseP0U0R0wbJm75jFen5Hq2aM8V5R9GYHiLxRY6BbFp33TsD5cKn5mP8AQe9ePXFzqPiTWTJsaa6nbCRqOAOw9gK9XAUlTi6sj5/NKzrSVGJ6v4S8LR6BZF5Cr3soHmvj7o67R7CuoxXnVqjqVHI9fC0VRpKAuKKzOkO1YWo+IGsbh4F0vUbhlAIaGDKH8c1UFzNGdSbgtDzbXl8Qa9qv2uTRruNEGyNPLJ2qD6+vNRaZF4n0a9N3Z6Xch2XYytCSGHvXtKdD2Khc+alTxH1n2ljf/wCEt8bDj+wQf+2D/wCNI3izxwwwNC2+4t3/AKmuT2FBPc7vrWJ7GNqs/jTWUMN1aXghPWKKEqp+vrW54auLjw3obQpoWpT30pLyYhwuegGeuMe1XV9j7PkizOh7d1ueqcrc6Pr+q6w9zc6ZdB7iUFyYiAASB+QGPyr2+JBHEiDgKABWOMnFqKidGW0pRlOcupIRXnHjHwrd6r4pspbaNhFcrtmlA4j29Sfw6fSssLV9lPm8jqx1D21NR8zvbG0hsLSO2t0CQxKFUCoNS1P+zY0f7Hd3O84xbx7yPc88VhfmkdH8KnocD4u1HWtfhWytdEvorUMHZpIjucjoMDoKxdB0/VNM1y1vLjR75o4WJwkRz0x/WvVpOnGhyXPArU6lXFRqNbMt+KhrPiHVI7iLRr6OGGPYoeLknOSePwqHQ38UeHZJms9GldZsbxJAxzjpyPqapOj7H2bZDhX+te2sdIvi/wAUhcN4XkZvbcB+WKq3WrePdTBjt9NNmp7hQD+bGuaNKhF3bO+eIxEo2SKln8NtUvpzcaxfKjNy+0+Y5/E8fzrvdF8O6boUOyzgCuR80jDLt9T/AEqMRinOPIjTB4H2b9rU3NkDHSiuI9NC0UDE7VhS6zMmvXFikCusdsZVx95mGOP1rGrU9mkKVktS/p91LdWSTT25t5G6xsckVbDLVxqJxTuKysVbPUbXUEdrd96o5RiARzVvK0o1U1cPdE3AdaCy960jJN6CbVveE3KOTilyKNb6heOyF3jtWV4h1N9I0K7v4UV5IU3BW6Hken1qqcXKVvMmpNRg35GfYa/e3dxpinTmMF3b+bJcq3yxHGcfp6966PI9aqpDlZNGspR1E3KOuKw7HWpLrxJfaa0caxW6hlYdSTjr271yzqNNHZToRnGTtsjeDoTgEZoLL3rRTRk4dLBuSk3pjOaOZX3BQ8g3ClLYHFU2lqFnfUQSKakzSuNqwtFMQ2uNv2K+KNRIOCNPcgg8jgVx4t2ivUiZQV55bTQVW5lR5XdGcMc4LYq6bL+z/EMenx3Fw1veQneGkJIPPOfXjrXGm2ub0/EzRBoNtaw6beXtxcTxLE7oSrkAAgdvXmoXn+yXVld2UN5DFJKF3zyZEoJ9M0lLlhFf1uF/dLF2BBrFw2tfaljd/wBxNExCKPTj8Kz0sH1zxrrdpLe3KWSqjhIpSAx2jH4ck+9etlstaj7f5nNiW3yx8/0KWjaTPrGk6ml1qV2Rp7vHbgSYAIBOT69qr/2/fXujaFYzSXkiTF/P+y8yyqpICj8Ote37NTk/L/K5w+0cIrz/AMyVtRv9Ekvp9OtNUt9Pe2OFvEOI5SQAwJzjrUl/4eCeA31htQupLyaFZZC0pKuGI+Uj8fzqE1Bxa6tIdpTvd7K5JZXZt/E/hkPOyW404s43ELxG5yfyrN1OaKPTzqmjQ6sBFICL6ec7X5x0J55oUPfX9dxe09xr+tkdIgk8TeJJbe5nkjtreFCIo3K7mYAk/r/KqlokWl65rkdzdzCFIApl3EyAHGMH1GcV8vVaU3U82vuPt6Uv3apRX2V+NiATtZX+nXdjDfW8M8oUmeXIlU47ZParmm6c2t6rrEVxd3IhilJVEcj5iT/LFRF88uX+tjWSUIe08v1sR2GpRf8ACOzW+p3N04iuvKiWFz5knovuKht1uV1p9NhW6tYrqByIZpclSASGGDxyKTldR+Q1T5ZTi9tX9wk2oXl94b06xgkkFyokeU5OcR5/nxWgNUOq6vYSyTPHb21l9omKtgBiMHOPSmqzb+4iVCCvp3/HYyLydbeGDUdOTUYgsgxcTy8S/UZ716nEd0aE9wDXRhXdy+RyY6FoQv5k1Fdx5wmKxJ9C8/VLm9M5HnW5g2begI69awq0+dL1E0Qx+GBGumj7ST9ict9z7+Wz68VcuNI8/WrfUfOwYUKhNvXOe/41CoWjb0/ASiZv/CKY+1RLeuLW4JYxbOjdjn2oPheeVbZZ9TeQW7AxjywAAPoevTmsnhf6+ZPIS3fh+6vWaO41SRrVn3GLyxnGc4zTtM8Ox6d4gv8AU0nLC5RUEezGwKAOvfpXXh17Pm8yJ0ryT8xuk+GRpdtqUAuTIL2RpCSmNm4Yx15rNXwDFHo9paJfyLdWcjSQ3SLggk5xjP8AWu6OKcZPz/ysYSwikl5F218OXpiuLfV9Ye+t5ojEYvKCAZxzkd6y/wDhArk2D6fLrtw9gAfKg8sAKexPPODzjgcdqI4jl6dbkywaez2Vi3/whEbXlhNJds6Wto1qUCY3gqy5znj736VTPw+uH0r+zJNclNmjboo1hAwc55556n86pYvVO39ak/Ud1/WxpXfhNzcxXljfva3KxLFIyoCHAAGcfh71APA8ZN35t9LIbmMBmYc7wQd35jpXkTwzlNvpdv7z6GljnTglbXRfdYX/AIRC6lNq13qjzfZXBjBjGAB269Tgc1qaToP9l31/cCbzPtbhiNuNvX8+tKGG5Zc39bBUxnNBwt/V7mS/gcfZWjS+ZZvtJuI5BGBtPpjPNWrTwvNBrFvqdzqLzzRqVYMgAOQQMc8dfeksLZ/cVLH80eW2uq+8l07wrDYapd3vnbxPkLHtwEBOTUVh4Ot7K1v4HnaVbobM7cFF54HX1prCpP7/AMSZY+bv8vwKTeCbmWwW0l1aRoYz+6URgBfrzz+ddkqbUUegxV0aLg/uM8TiVWSSXf8AEkorpOQKKAEooAWigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKACigAooAKKAP/2QD//gA8Q1JFQVRPUjogZ2QtanBlZyB2MS4wICh1c2luZyBJSkcgSlBFRyB2ODApLCBxdWFsaXR5ID0gNzUKAP/hMehodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0n77u/JyBpZD0nVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkJz8+DQo8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIj48cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPjxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSJ1dWlkOmZhZjViZGQ1LWJhM2QtMTFkYS1hZDMxLWQzM2Q3NTE4MmYxYiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIj48eG1wOkNyZWF0b3JUb29sPldpbmRvd3MgUGhvdG8gRWRpdG9yIDEwLjAuMTAwMTEuMTYzODQ8L3htcDpDcmVhdG9yVG9vbD48eG1wOkNyZWF0ZURhdGU+MjAyMS0wNC0yMVQwOTo1MDoxOS4zMjM8L3htcDpDcmVhdGVEYXRlPjwvcmRmOkRlc2NyaXB0aW9uPjwvcmRmOlJERj48L3g6eG1wbWV0YT4NCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9J3cnPz7/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoHBwYIDAoMDAsKCwsNDhIQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsNFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCABqAMgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl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";

        let startX_back = 170;
        let startY = 10;
        let startX = 15;
        var footerY = doc.internal.pageSize.height-10;
        let adderX = 0;
        let adderY = 0;

        let listBulan = ["", "Januari", "Februari", "Maret",  "April",
            "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"]
        let listHari= ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"];
        let day = listHari[parseInt(dateHO)];
        let bulan = listBulan[parseInt(dateHandover.substr(5, 2))];
        let hari = dateHandover.substr(8, 2);
        let tahun = dateHandover.substr(0, 4);

        doc.line(startX-4, startY+9.5, startX+178, startY+9.5)
        doc.line(startX-4, startY+25.5, startX+178, startY+25.5)
        doc.line(startX-4, startY+9.5, startX-4, startY+25.5)
        doc.line(startX+32.5, startY+9.5, startX+32.5, startY+25.5)
        doc.line(startX+178, startY+9.5, startX+178, startY+25.5)

        //border halaman
        doc.line(startX-3, startY+28.5, startX+177, startY+28.5)
        doc.line(startX-3, startY+28.5, startX-3, footerY-16)
        doc.line(startX+177, startY+28.5, startX+177, footerY-16)
        doc.line(startX-3, footerY-16, startX+177, footerY-16)

        doc.line(startX-4, startY+27.5, startX+178, startY+27.5)
        doc.line(startX-4, startY+27.5, startX-4, footerY-15)
        doc.line(startX+178, startY+27.5, startX+178, footerY-15)
        doc.line(startX-4, footerY-15, startX+178, footerY-15)

        // border penting
        doc.line(startX_back-5, startY-2, startX+177, startY-2)
        doc.line(startX_back-5, startY-2, startX_back-5, startY+8)
        doc.line(startX_back-5, startY+8, startX+177, startY+8)
        doc.line(startX+177, startY-2, startX+177, startY+8)

        doc.setFont('times new roman', 'bold', 'bold');
        doc.setFontSize(13);

        adderY += 5;
        doc.text('PENTING', startX_back-2, startY+5)

        adderY += 5
        doc.addImage(img, 'png', startX+2, startY+12, 22.5, 12.15);
        doc.setFontSize(15);

        adderX += 40;
        adderY += 8.5;
        doc.text('FORM BERITA ACARA SERAH TERIMA', startX+55, startY+19.5);

        doc.setFont('times new roman', 'normal', 'normal');
        doc.setFontSize(11);

        adderX += 40;
        adderY += 8.5;
        doc.text('Nomor Permintaan: '+ bastNum, startX+1, startY+34.5)
        doc.text('Pada hari ini, '+ day+" Tanggal "+ hari +" Bulan "+ bulan +" Tahun "+ tahun, startX+1,startY+41.5 )
        doc.text('Bertempat di Jakarta', startX+1,startY+48.5 )
        doc.text('Kami yang bertandatangan di bawah ini:', startX+1,startY+55.5 );
        doc.setFont('times new roman', 'bold', 'bold');
        doc.text('1', startX+1,startY+62.5 );
        doc.setFont('times new roman', 'normal', 'normal');
        doc.text('Nama         : ' + picName, startX + 5,startY+62.5 );
        doc.setFont('times new roman', 'bold', 'bold');
        doc.text('2', startX+91,startY+62.5 );
        doc.setFont('times new roman', 'normal', 'normal');
        doc.text('Nama         : ' + namaKedua, startX + 95,startY+62.5 );
        doc.text('Bagian       : Managed Service ', startX + 5,startY+69.5 );
        doc.text('Bagian       : ' + divisiKedua, startX + 95,startY+69.5 );
        doc.text('Perusahaan: PT. Lintas Media Danawa', startX + 5,startY+76.5 );
        doc.text('Perusahaan: ' +organisasiKedua, startX + 95,startY+76.5 );
        doc.text('Untuk selanjutnya disebut sebagai',startX + 5, startY+83.5 )
        doc.text('Untuk selanjutnya disebut sebagai',startX + 95, startY+83.5 )
        doc.setFont('times new roman', 'bold', 'bold');
        doc.text('PIHAK PERTAMA',startX + 5, startY+90.5 )
        doc.text('PIHAK KEDUA',startX + 95, startY+90.5 )
        doc.setFont('times new roman', 'normal', 'normal');

        doc.text('Bahwa PIHAK PERTAMA telah menjelaskan Hasil '+ namaOrder+' kepada PIHAK KEDUA.' , startX+1, startY+102.5)
        doc.text('Dan PIHAK KEDUA menyetujui Hasil '+ namaOrder+ ' yang dijelaskan PIHAK PERTAMA.', startX+1, startY+108.5)

        doc.text(namaOrder, startX+1, startY+115.5)

        if(tipe === "mn"){
            doc.text('Periode: '+ d1 +" " + m1 + " "+ y1 + ' - ' + d2 +" " + m2 + " "+ y2, startX+1, startY+121.5)
            //beda 6
            doc.text('Term: '+ term, startX+1, startY+127.5)
            doc.text('No PO: '+ po, startX+1, startY+133.5)
            doc.setFont('times new roman', 'bold', 'bold');

            //border ttd
            doc.line(startX+20, startY+138, startX+20, startY+190);
            doc.line(startX+20, startY+138, startX+155, startY+138);
            doc.line(startX+155, startY+138, startX+155, startY+190);
            doc.line(startX+20, startY+190, startX+155, startY+190);
            doc.line(startX+87.5, startY+138, startX+87.5, startY+190);
            //doc.line(startX+20, startY+128.5, startX+20, startY+131.5);

            doc.text('PIHAK PERTAMA', startX+35, startY+144.5)
            doc.text('PIHAK KEDUA', startX+107, startY+144.5)
            doc.text('('+picName+')', startX+32, startY+184.5)
            doc.text('('+namaKedua+')', startX+114, startY+184.5)

            doc.text('MENGETAHUI',startX+73, startY+197.5)

            //border ttd
            doc.line(startX+20, startY+203, startX+20, startY+255);
            doc.line(startX+20, startY+203, startX+155, startY+203);
            doc.line(startX+155, startY+203, startX+155, startY+255);
            doc.line(startX+20, startY+255, startX+155, startY+255);
            doc.line(startX+87.5, startY+203, startX+87.5, startY+255);

            doc.text('PEMIMPIN PIHAK PERTAMA', startX+27, startY+209.5)
            doc.text('PEMIMPIN PIHAK KEDUA', startX+96, startY+209.5)
            doc.text('(Moh. Farid Taufiqurrahman)', startX+28, startY+249.5)
            doc.text('('+picKedua+')', startX+115, startY+249.5)

            //footer
            doc.setFontSize(8);
            doc.line(startX+5, footerY-13, startX+175, footerY-13);
            doc.text('©Hak Cipta PT. LINTAS MEDIA DANAWA, Indonesia', startX+5, footerY-10)
            doc.text('Form Berita Acara Serah Terima (FBAST)', startX+5, footerY-7)
        }
        else{
            doc.text('No PO: '+ po, startX+1, startY+121.5);
            doc.setFont('times new roman', 'bold', 'bold');

            //border ttd
            doc.line(startX+20, startY+127, startX+20, startY+178);
            doc.line(startX+20, startY+127, startX+155, startY+127);
            doc.line(startX+155, startY+127, startX+155, startY+178);
            doc.line(startX+20, startY+178, startX+155, startY+178);
            doc.line(startX+87.5, startY+127, startX+87.5, startY+178);

            doc.text('PIHAK PERTAMA', startX+35, startY+133.5)
            doc.text('PIHAK KEDUA', startX+110, startY+133.5)
            doc.text('('+picName+')', startX+32, startY+173.5)
            doc.text('('+namaKedua+')', startX+110, startY+173.5)

            doc.text('MENGETAHUI',startX+73, startY+188.5)

            //border ttd
            doc.line(startX+20, startY+196, startX+20, startY+248);
            doc.line(startX+20, startY+196, startX+155, startY+196);
            doc.line(startX+155, startY+196, startX+155, startY+248);
            doc.line(startX+20, startY+248, startX+155, startY+248);
            doc.line(startX+87.5, startY+196, startX+87.5, startY+248);

            doc.text('PEMIMPIN PIHAK PERTAMA', startX+27, startY+203.5)
            doc.text('PEMIMPIN PIHAK KEDUA', startX+96, startY+203.5)
            doc.text('(Moh. Farid Taufiqurrahman)', startX+28, startY+243.5)
            doc.text('('+picKedua+')', startX+115, startY+243.5)

            // footer
            doc.setFontSize(8);
            doc.line(startX+5, footerY-13, startX+175, footerY-13);
            doc.text('©Hak Cipta PT. LINTAS MEDIA DANAWA, Indonesia', startX+5, footerY-10)
            doc.text('Form Berita Acara Serah Terima (FBAST)', startX+5, footerY-7)

        }

        doc.save(bastNum+ '.pdf');
    }

    render() {
        const { reports, reportsFiltered, isMrUploaded, isInstallationReport, isUpload, isSuccess, isDelete, isDeleteSuccess, isFailed, isError,
            listMaintenance, reportTarget, messageError, isFiltered, reportNum, bastList, orderList, isPreview } = this.state;
        const tableHeaders = ['No.', 'Nomor Laporan', 'Nama Laporan', 'Nomor PO', 'Perusahaan', 'Tanggal dibuat', 'Status', 'Aksi'];
        let tableRows = [];

        let nomor, tipe, status, order, id, bast, mn, ms, pi, bastNum, dateHandover, picName, namaOrder, deskripsi;
        let namaKedua, divisiKedua, organisasiKedua, picKedua, po, sph, selectedOrder;

        if(this.state.reportTarget !== null){
            tipe = reportTarget.reportType;
            nomor = reportTarget.reportName;
            status = reportTarget.statusApproval;
            id = reportTarget.idReport;
        }
        for(let i=0; i<bastList.length; i++){
            if(bastList[i].idReport === id){
                bast = bastList[i];
                bastNum = bast.bastNum;
                dateHandover = bast.dateHandover.substr(0, 10);
                picName = bast.picName;
                mn = bast.idMaintenance;
                pi = bast.idOrderPi;
                ms = bast.idOrderMs;
            }
        }

        for(let x=0; x<orderList.length;x++){
            order = orderList[x];
            if(order.projectInstallation === true){
                if(order.idOrderPi === pi){
                    selectedOrder = order;
                    namaOrder = order.orderName;
                    deskripsi = order.description;
                    namaKedua = order.clientName;
                    divisiKedua = order.clientDiv;
                    organisasiKedua = order.clientOrg;
                    picKedua = order.clientPIC
                    po = order.noPO;
                    sph = order.noSPH
                }
            }
            if(order.managedService === true){
                if(order.idOrderMs === ms){
                    selectedOrder = order;
                    namaKedua = order.clientName;
                    divisiKedua = order.clientDiv;
                    organisasiKedua = order.clientOrg;
                    picKedua = order.clientPIC
                    po = order.noPO;
                    sph = order.noSPH
                }
            }
        }

        if(reports.length !== 0){
            tableRows = isFiltered ? reportsFiltered.map((report) =>
                    [this.getIsBast(report) === true ? this.getBastNum(report) : this.getReportNum(report), report.reportName, this.getOrderPO(report), this.getOrderOrg(report),
                        this.getDate(report.uploadedDate), this.getApproval(report), this.getIsBast(report) === true?
                        <div className="d-flex justify-content-center">
                            <Button className={classes.button4} onClick={() => this.handlePreview(report)}>Preview</Button>
                            <Button className={classes.button4} onClick={() => this.handleDownload(report)}>Unduh</Button>
                        </div>
                        :
                        <div className="d-flex justify-content-center">
                            <Button className={classes.button4} href={this.getUrl(report)} target = "_blank">Preview</Button>
                            <Button className={classes.button4} href={this.getToDownload(report)} target = "_blank">Unduh</Button>
                        </div>
                    ]
                )
                : reports.map((report) =>
                    [ this.getIsBast(report) === true ? this.getBastNum(report) : this.getReportNum(report), report.reportName, this.getOrderPO(report), this.getOrderOrg(report),
                        this.getDate(report.uploadedDate), this.getApproval(report), this.getIsBast(report) === true ?
                        <div className="d-flex justify-content-center">
                            <Button className={classes.button4} onClick={() => this.handlePreview(report)}>Preview</Button>
                            <Button className={classes.button4} onClick={() => this.handleDownload(report)}>Unduh</Button>
                        </div>
                        :
                        <div className="d-flex justify-content-center">
                            <Button className={classes.button4} href={this.getUrl(report)} target = "_blank">Preview</Button>
                            <Button className={classes.button4} href={this.getToDownload(report)} target = "_blank">Unduh</Button>
                        </div>
                    ]);
        }

        return (
            <div id="content">
                {isPreview === true ?
                    <div id="preview">
                        <Card id="card-preview">
                            <a onClick={(event)=>this.handleClose(event)} href={"/laporan/admin"}><p id="highlighted3">    &#8810; Kembali ke Daftar Laporan    </p></a>
                            <Table>
                                <tr></tr>
                                <tr> <td colSpan={2}><h2 id="title">Preview Berita Acara Serah Terima</h2></td> </tr>
                                <tr>
                                    <td id="nameDesc2"></td>
                                    <td id="nameDesc2"></td>
                                </tr>
                                <tr>
                                    <td id="nameDesc">Nomor Permintaan:</td>
                                    <td id="nameDesc">Tanggal Penyerahan:</td>
                                </tr>
                                <tr>
                                    <td>{bastNum}</td>
                                    <td>{dateHandover}</td>
                                </tr>
                                <tr>
                                    <td hidden={true}>-----</td> <td hidden={true}>-----</td>
                                </tr>
                                <tr>
                                    <td id="nameDesc2"></td>
                                    <td id="nameDesc2"></td>
                                </tr>
                                <tr>
                                    <td id="nameDesc2">Pihak Pertama</td>
                                    <td id="nameDesc2">Pihak Kedua</td>
                                </tr>
                                <tr>
                                    <td id="nameDesc">Nama:</td>
                                    <td id="nameDesc">Nama:</td>
                                </tr>
                                <tr>
                                    <td>{picName}</td>
                                    <td>{namaKedua}</td>
                                </tr>
                                <tr>
                                    <td id="nameDesc">Perusahaan atau Organisasi:</td>
                                    <td id="nameDesc">Perusahaan atau Organisasi:</td>
                                </tr>
                                <tr>
                                    <td>PT Lintas Media Danawa</td>
                                    <td>{organisasiKedua}</td>
                                </tr>
                                <tr>
                                    <td id="nameDesc">Divisi atau Bagian:</td>
                                    <td id="nameDesc">Divisi atau Bagian:</td>
                                </tr>
                                <tr>
                                    <td>Managed Services</td>
                                    <td>{divisiKedua}</td>
                                </tr>

                            </Table>
                        </Card>
                    </div>
                    :
                    <div className={classes.container}>
                        <div>
                            <br></br>
                            <div><h1 className="text-center">Daftar Laporan</h1></div>
                            <div className="d-flex justify-content-between" style={{padding: 5}}>
                                <table>
                                    <tr>
                                        <td colSpan={2} id="gap">
                                            <div className={classes.search}><Form.Control type="text" size="sm" placeholder="Cari..." onChange={this.handleFilter}/></div>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            <div>{ reports.length !== 0 ?
                                <CustomizedTables headers={tableHeaders} rows={tableRows}/> :
                                <p className="text-center" style={{color: "red"}}>Belum terdapat laporan </p>}
                            </div>
                        </div>
                    </div>
                }
            </div>

        );
    }
}

export default ReportAdmin;