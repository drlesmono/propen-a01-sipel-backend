import React from "react";

const Layout = (props) => {
    return <main className="base-layout">
            {props.children}
        </main>;
};

export default Layout;