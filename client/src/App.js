import React, { Component } from 'react';
import Home from "./components/Home";
import Saved from "./components/Saved";
//import API from "./src/utils/API";



class App extends Component {

  render() {
    return (
      <div className="container">
        <Home />
        {/* <Saved /> */}
      </div>
    );
  }
}

export default App;
