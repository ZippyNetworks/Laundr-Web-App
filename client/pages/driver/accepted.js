import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import { showDefaultError, showConsoleError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import OrderTable from "../../src/components/Driver/components/OrderTable";
import baseURL from "../../src/baseURL";
import acceptedDashboardStyles from "../../src/styles/Driver/AcceptedDashboard/acceptedDashboardStyles";

//todo: refresh list after completing an action, and THEN show the snackbar?

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled

//only display status 1 (need to enter weight), 2: (mark dropped to washer), 5: (mark delivered to user)

class AcceptedDashboard extends Component {
  state = {
    orders: [],
    weight: "",
    weightError: false,
    weightErrorMsg: "",
  };

  componentDidMount = async () => {
    await this.getOrders();
  };

  getOrders = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await axios.get(baseURL + "/order/getOrders");

      if (response.data.success) {
        //filter only status 0 and 4
        const filteredOrders = response.data.message.filter((order) => {
          return (
            (order.orderInfo.status === 1 ||
              order.orderInfo.status === 2 ||
              order.orderInfo.status === 5) &&
            order.pickupInfo.driverEmail === currentUser.email
          );
        });

        this.setState({ orders: filteredOrders });
      } else {
        showDefaultError("getting orders", 99);
      }
    } catch (error) {
      showConsoleError("getting orders", error);
      showDefaultError("getting orders", 99);
    }
  };

  handleWeightChange = (weight) => {
    const regex = /^[0-9\b]+$/;

    if (weight === "" || regex.test(weight)) {
      this.setState({ weight: weight });
    }
  };

  handleWeightMinimum = () => {
    if (!this.state.weight.replace(/\s/g, "").length) {
      this.setState({
        weightError: true,
        weightErrorMsg: "Please enter a weight.",
      });

      return false;
    } else if (this.state.weight < 10) {
      this.setState({
        weightError: true,
        weightErrorMsg: "Minimum weight to be entered is 10 lbs.",
      });

      return false;
    } else {
      return true;
    }
  };

  handleClearWeightError = () => {
    this.setState({ weightError: false, weightErrorMsg: "" });
  };

  handleWeightEntered = async (order) => {
    let success = false;

    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(baseURL + "/driver/updateOrderWeight", {
        weight: this.state.weight,
        orderID,
      });

      success = response.data.success;
    } catch (error) {
      showConsoleError("entering weight", error);
      showDefaultError("entering weight", 99);
    }

    return success;
  };

  handleChargeCustomer = async (order) => {
    let success = { status: false, message: "N/A" };

    try {
      const email = order.userInfo.email;

      const response = await axios.post(baseURL + "/stripe/chargeCustomer", {
        weight: this.state.weight,
        userEmail: email,
      });

      success.status = response.data.success;
      success.message = response.data.message;
    } catch (error) {
      showConsoleError("charging customer", error);
      showDefaultError("charging customer", 99);
    }

    return success;
  };

  handleWasherReceived = async (order) => {
    let success = false;

    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(baseURL + "/driver/setWasherDelivered", {
        orderID,
      });

      success = response.data.success;
    } catch (error) {
      showConsoleError("setting order as received by washer", error);
      showDefaultError("setting order as received by washer", 99);
    }

    return success;
  };

  handleUserReceived = async (order) => {
    let success = false;

    try {
      const orderID = order.orderInfo.orderID;

      const response = await axios.put(baseURL + "/driver/setUserDelivered", {
        orderID,
      });

      success = response.data.success;
    } catch (error) {
      showConsoleError("setting order as delivered", error);
      showDefaultError("setting order as delivered", 99);
    }

    return success;
  };

  render() {
    const { classes } = this.props;

    return (
      <Layout>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{
            paddingTop: 8,
            backgroundColor: "#21d0e5",
          }}
        >
          <Grid item>
            <Typography variant="h1" className={classes.componentName}>
              Accepted Orders
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src="/images/UserDashboard/sectionBorder.png"
            style={{
              width: "100%",
              height: "100%",
              paddingTop: 8,
              paddingBottom: 15,
            }}
            alt="Section border"
          />
        </Grid>
        <OrderTable
          orders={this.state.orders}
          getOrders={this.getOrders}
          weight={this.state.weight}
          weightError={this.state.weightError}
          weightErrorMsg={this.state.weightErrorMsg}
          handleWeightChange={this.handleWeightChange}
          handleWeightMinimum={this.handleWeightMinimum}
          handleChargeCustomer={this.handleChargeCustomer}
          handleClearWeightError={this.handleClearWeightError}
          handleWeightEntered={this.handleWeightEntered}
          handleWasherReceived={this.handleWasherReceived}
          handleUserReceived={this.handleUserReceived}
        />
        <Backdrop className={classes.backdrop} open={this.state.showLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </Layout>
    );
  }
}

AcceptedDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(acceptedDashboardStyles)(AcceptedDashboard);
