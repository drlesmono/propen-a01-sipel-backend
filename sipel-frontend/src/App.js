import React, { Component } from "react";
import Layout from "./components/Layout";
import InputDataOrder from "./containers/InputDataOrder/InputDataOrder";

class App extends Component {
  render() {
    return (
      <Layout>
        <InputDataOrder/>
      </Layout>
    );
  }
}

export default App;
