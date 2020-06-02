import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
} from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import OrderTable from "../components/OrderTable";
import baseURL from "../../../baseURL";
import acceptedDashboardStyles from "../../../styles/Driver/AcceptedDashboard/acceptedDashboardStyles";
import sectionBorder from "../../../images/UserDashboard/sectionBorder.png";

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
  constructor(props) {
    super(props);

    this.state = {
      orders: [],
      weight: "",
      weightError: false,
      weightErrorMsg: "",
    };
  }

  componentDidMount = async () => {
    this.getOrders();
  };

  getOrders = () => {
    this.setState({ showLoading: true }, async () => {
      let token = localStorage.getItem("token");
      const data = jwtDecode(token);
      let driverEmail = data.email;

      await axios
        .get(baseURL + "/order/getOrders", {})
        .then((res) => {
          if (res.data.success) {
            console.log("list of orders:");
            console.log(res.data.message);

            //filter only status 1, 2, 5 of orders assigned to the logged in driver
            let filteredOrders = res.data.message.filter((order) => {
              return (
                (order.orderInfo.status === 1 ||
                  order.orderInfo.status === 2 ||
                  order.orderInfo.status === 5) &&
                order.pickupInfo.driverEmail === driverEmail
              );
            });

            this.setState({ orders: filteredOrders }, () => {
              this.setState({ showLoading: false });
            });
          } else {
            alert("Error with fetching orders, please contact us.");
          }
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    });
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
    console.log("entered weight: " + this.state.weight);

    let orderID = order.orderInfo.orderID;
    let weight = this.state.weight;

    let success;
    await axios
      .post(baseURL + "/driver/updateOrderWeight", { weight, orderID })
      .then((res) => {
        if (res.data.success) {
          success = true;
        } else {
          success = false;
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });

    return success;
  };

  handleChargeCustomer = async (order) => {
    let weight = this.state.weight;
    let userEmail = order.userInfo.email;

    let success = { status: true, message: "" };

    await axios
      .post(baseURL + "/stripe/chargeCustomer", { weight, userEmail })
      .then((res) => {
        if (!res.data.success) {
          success.status = false;
          success.message = res.data.message;
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });

    return success;
  };

  handleWasherReceived = async (order) => {
    let orderID = order.orderInfo.orderID;
    let success;

    await axios
      .post(baseURL + "/driver/setWasherDelivered", { orderID })
      .then((res) => {
        if (res.data.success) {
          success = true;
        } else {
          success = false;
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });

    return success;
  };

  handleUserReceived = async (order) => {
    let orderID = order.orderInfo.orderID;
    let success;

    await axios
      .post(baseURL + "/driver/setUserDelivered", { orderID })
      .then((res) => {
        if (res.data.success) {
          success = true;
        } else {
          success = false;
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });

    return success;
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
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
            src={sectionBorder}
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
      </React.Fragment>
    );
  }
}

AcceptedDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(acceptedDashboardStyles)(AcceptedDashboard);
