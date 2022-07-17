import Register from "./components/Register";
import ipConfig from "./ipConfig.json";
import { Route, Switch } from "react-router-dom";
import Login from "./components/Login";
import Products from "./components/Products";
import Checkout from "./components/Checkout";
import Thanks from './components/Thanks'
export const config = {
  endpoint: `https://qkart-frontend-divy.herokuapp.com/api/v1`,
};

function App() {
  return (
    <div className="App">
      <Switch>
        {/* TODO: CRIO_TASK_MODULE_LOGIN - To add configure routes and their mapping */}
        {/* <Register /> */}
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/checkout">
          <Checkout />
        </Route>
        <Route path="/thanks">
          <Thanks />
        </Route>
        <Route path="/">
          <Products />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
