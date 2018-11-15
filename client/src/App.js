import React, { Component } from "react";
import "./App.css";
import Dropdown from "./components/dropdown";
import "bootstrap/dist/css/bootstrap.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Birdie Test App</h1>
        </header>
        <Dropdown />
      </div>
    );
  }
}

export default App;
