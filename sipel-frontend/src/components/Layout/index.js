import React from "react";
import classes from "./styles.module.css";

const Layout = (props) => {
    return <main className={classes.layout}>
            {props.children}
        </main>;
};

export default Layout;