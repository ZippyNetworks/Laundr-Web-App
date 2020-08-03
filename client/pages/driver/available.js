import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Paper,
} from "@material-ui/core";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import { showDefaultError, showConsoleError } from "../../src/helpers/errors";
import { Layout } from "../../src/layouts";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import OrderTable from "../../src/components/Driver/components/OrderTable";
import baseURL from "../../src/baseURL";
import availableDashboardStyles from "../../src/styles/Driver/AvailableDashboard/availableDashboardStyles";

//todo: add isDriver to user, also iswasher, etc.
//todo: conditional redirects

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled

//only display status 0 and 4, ones able to be "accepted"

class AvailableDashboard extends Component {
  state = { orders: [], userFname: "" };

  componentDidMount = async () => {
    await this.getOrders();
  };

  //todo: move to helper
  getOrders = async () => {
    try {
      const currentUser = getCurrentUser();
      const response = await axios.get(baseURL + "/order/getOrders");

      if (response.data.success) {
        //filter only status 0 and 4
        const filteredOrders = response.data.message.filter((order) => {
          return order.orderInfo.status === 0 || order.orderInfo.status === 4;
        });

        this.setState({ orders: filteredOrders, userFname: currentUser.fname });
      } else {
        showDefaultError("getting orders", 99);
      }
    } catch (error) {
      showConsoleError("getting orders", error);
      showDefaultError("getting orders", 99);
    }
  };

  handlePickupAccept = async (order) => {
    let success = false;

    try {
      const currentUser = getCurrentUser();
      const orderID = order.orderInfo.orderID;

      const response = await axios.post(baseURL + "/driver/assignOrderPickup", {
        driverEmail: currentUser.email,
        orderID,
      });

      success = response.data.success;
    } catch (error) {
      showConsoleError("accepting order", error);
      showDefaultError("accepting order");
    }

    return success;
  };

  handleDropoffAccept = async (order) => {
    let success = false;

    try {
      const currentUser = getCurrentUser();
      const orderID = order.orderInfo.orderID;

      const response = await axios.post(
        baseURL + "/driver/assignOrderDropoff",
        {
          driverEmail: currentUser.email,
          orderID,
        }
      );

      success = response.data.success;
    } catch (error) {
      showConsoleError("setting order as dropped off", error);
      showDefaultError("setting order as dropped off");
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
            <Paper elevation={3} className={classes.welcomeCard}>
              <Typography variant="h3" className={classes.welcomeText}>
                {`Welcome, ${this.state.userFname}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Typography variant="h1" className={classes.componentName}>
              Available Orders
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
          handlePickupAccept={this.handlePickupAccept}
          handleDropoffAccept={this.handleDropoffAccept}
        />
      </Layout>
    );
  }
}

AvailableDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(availableDashboardStyles)(AvailableDashboard);
