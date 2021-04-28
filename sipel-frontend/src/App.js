// import logo from './logo.svg';
import './App.css';
import React, { Component } from "react";
import ListVerifiedPiOrder from "./components/VerifiedPiOrder/ListVerifiedPiOrder";
import HeaderComponent from './components/Header/HeaderComponent';
import FooterComponent from './components/Footer/FooterComponent';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import LandingPage from './components/LandingPage';
import ListTaskComponent from './components/ListTask/ListTaskComponent';
import CreateTaskComponent from './components/ListTask/CreateTaskComponent';
import UpdateTaskComponent from './components/ListTask/UpdateTaskComponent';
import UpdateTaskProgressComponent from './components/ListTask/UpdateTaskProgressComponent';

function App() {
    return (
      <Router>
        <div>
          <HeaderComponent/>
                <div className="container">
                  <Switch>
                    <Route path = "/" exact component = {LandingPage}></Route>
                    <Route path = "/delivery-progress" component = {ListVerifiedPiOrder}></Route>
                    <Route path = "/list-task/:id" component = {ListTaskComponent}></Route>
                    <Route path = "/add-task/:id" component = {CreateTaskComponent}></Route>
                    <Route path = "/update-task/:idPi/:idTask" component = {UpdateTaskComponent}></Route>
                    <Route path = "/add-progress/:idPi/:idTask" component = {UpdateTaskProgressComponent}></Route>
                    <ListVerifiedPiOrder/>
                    <ListTaskComponent/>  
                    
                  </Switch>
                </div>
          <FooterComponent/>
        </div>
      </Router>
    );
}

export default App;
