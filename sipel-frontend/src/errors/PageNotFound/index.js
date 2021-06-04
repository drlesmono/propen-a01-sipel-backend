import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import classes from "./styles.module.css";

class PageNotFound extends Component {
    constructor(props){
        super(props);
    }
    
    render(){
        return (
            <div id="wrapper" className={classes.container}>
                <div id="info" class="text-center">
                    <h3 class={classes.title}>Halaman tidak ditemukan</h3>
                    <div><a href="/">Kembali ke Halaman Utama</a></div>
                </div>
            </div >
        );
    }
}

export default PageNotFound;