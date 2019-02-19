import React, { Component } from 'react';
import { createBrowserHistory } from "history";
import { Router, Route, Switch, Redirect } from "react-router-dom";
import ReactDOM from "react-dom";
import Web3 from 'web3';

import Admin from "./layouts/Admin.jsx";

import "./assets/css/material-dashboard-react.css";

const hist = createBrowserHistory();

// class App extends Component {
//   render() {
//     return (
//       <div>
//         Single div
//       </div>
//     );
//   }
// }

// export default App;






ReactDOM.render(
  <Router history={hist}>
    <Switch>
      <Route path="/admin" component={Admin} />
      <Redirect from="/" to="/admin/dashboard" />
    </Switch>
  </Router>,
  document.getElementById("root")
);


// export default App;
