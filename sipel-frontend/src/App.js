// import logo from './logo.svg';
import './App.css';
// import { render } from '@testing-library/react';
import React, { Component } from "react";
import Layout from "./components/Layout";
import PenugasanEngineer from "./containers/PenugasanEngineer";

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

class App extends Component {
  render() {
    return (
      <Layout>
        <PenugasanEngineer/>
      </Layout>
    );
  }
}

export default App;
