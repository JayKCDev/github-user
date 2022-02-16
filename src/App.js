import React from "react";
import { Dashboard, Login, PrivateRoute, AuthWrapper, Error } from "./pages";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  //As per the docs of Auth0.com whole app has to be wrapped in a wrapper in order for the login/logout functionality to work properly
  return (
    <AuthWrapper>
      <Router>
        <Switch>
          <PrivateRoute exact path={"/"}>
            <Dashboard />
          </PrivateRoute>
          <Route path={"/login"}>
            <Login />
          </Route>
          <Route path={"*"}>
            <Error />
          </Route>
        </Switch>
      </Router>
    </AuthWrapper>
  );
}

export default App;
