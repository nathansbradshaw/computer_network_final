import React, { Component } from "react";
import "../app.scss";

class Nav extends Component {
  state = { message: "" };
  callbackFunction = (childData) => {
    this.setState({ message: childData });
  };
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {}

  render() {
    return (
      <nav class="navbar" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">

          <a
            role="button"
            class="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" class="navbar-menu">
          <div class="navbar-start">
            <a class="navbar-item is-active">Chat - Socket Example</a>
          </div>

          <div class="navbar-end">
            <div class="navbar-item">
              <div class="buttons">
                <a href='https://github.com/nathansbradshaw/computer_network_final' class="button is-primary">
                  <strong>Github</strong>
                </a>
                
              </div>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

export default Nav;
