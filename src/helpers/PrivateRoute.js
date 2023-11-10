import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ children, ...rest }) => {
  return <Route {...rest}>{children}</Route>;
};
