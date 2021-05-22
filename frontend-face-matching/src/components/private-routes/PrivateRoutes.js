import React from "react";
import rolesConfig from "../../configs/routes";
import { Route, Switch, Redirect } from "react-router-dom";

function PrivateRoutes(props) {
  const role = props.role || "guest";
  const allowedRoutes = rolesConfig[role].routes;
  const redirectRoute = rolesConfig[role].redirectRoute;
  return (
    <Switch>
      {allowedRoutes.map((route) => {
        return (
          <Route exact path={route.url} key={route.url}>
            <route.component setRole={props.setRole} />
          </Route>
        );
      })}
      <Redirect to={redirectRoute} />
    </Switch>
  );
}

export default PrivateRoutes;
