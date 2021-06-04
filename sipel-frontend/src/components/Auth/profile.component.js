import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../services/auth.service";


export default class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirect: null,
      userReady: false,
      currentUser: { username: "" }
    };
  }

  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) this.setState({ redirect: "/" });
    this.setState({ currentUser: currentUser, userReady: true })
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />
    }

    const { currentUser } = this.state;

    return (
      
      <div className="classes.container">
        {(this.state.userReady) ?
        <div>
        <header className="jumbotron">
          <h3>
            <strong>{currentUser.username}</strong> Profile
          </h3>
        </header>
        <p>
          <strong>Nama Lengkap:</strong>{" "}
          {currentUser.fullname}
        </p>

        <p>
          <strong>Nama Panggilan:</strong>{" "}
          {currentUser.surname}
        </p>

        <p>
          <strong>Username:</strong>{" "}
          {currentUser.username}
        </p>

        <p>
          <strong>NIP:</strong>{" "}
          {currentUser.nip}
        </p>

        <p>
          <strong>Email:</strong>{" "}
          {currentUser.email}
        </p>

        <strong>Authorities:</strong>
        <ul>
          {currentUser.roles &&
            currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
        </ul>
      </div>: null}
      </div>
    );
  }
}
