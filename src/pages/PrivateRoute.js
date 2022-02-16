import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const PrivateRoute = ({ children, ...rest }) => {
  const { user, isAuthenticated } = useAuth0();
  const isUser = user && isAuthenticated;
  return (
    <Route
      {...rest}
      render={() => {
        return isUser ? children : <Redirect to="/login" />;
      }}
    />
  );
};
export default PrivateRoute;
