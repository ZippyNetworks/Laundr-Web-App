import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import AvailableDriverDashboard from "./components/Driver/AvailableDashboard/AvailableDashboard";
import AcceptedDriverDashboard from "./components/Driver/AcceptedDashboard/AcceptedDashboard";
import AssignedWasherDashboard from "./components/Washer/AssignedDashboard/AssignedDashboard";
import UserDashboard from "./components/User/Dashboard/Dashboard";
import SubscriptionBoxes from "./components/User/Subscription/components/SubscriptionBoxes";
import theme from "./theme";
import { ThemeProvider } from "@material-ui/styles";
import { Main as MainLayout } from "./layouts";
import RouteWithLayout from "./layouts/RouteWithLayout";

//todo: make page not found

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <Switch>
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
          <ThemeProvider theme={theme}>
            <Switch>
              <RouteWithLayout
                component={AvailableDriverDashboard}
                exact
                layout={MainLayout}
                path="/driverAvailable"
              />
              <RouteWithLayout
                component={AcceptedDriverDashboard}
                exact
                layout={MainLayout}
                path="/driverAccepted"
              />
              <RouteWithLayout
                component={AssignedWasherDashboard}
                exact
                layout={MainLayout}
                path="/washerAssigned"
              />
              <RouteWithLayout
                component={UserDashboard}
                exact
                layout={MainLayout}
                path="/userDashboard"
              />
              <RouteWithLayout
                component={SubscriptionBoxes}
                exact
                layout={MainLayout}
                path="/paymentTest"
              />
              <Route path="/">
                <Redirect to="/login" />
              </Route>
            </Switch>
          </ThemeProvider>
        </Switch>
        <br />
      </React.Fragment>
    );
  }
}
