import React, { Component } from "react";
import {
  withStyles,
  Backdrop,
  CircularProgress,
  Grid,
  Typography,
  Paper,
} from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import OrderTable from "../components/OrderTable";
import baseURL from "../../../baseURL";
import availableDashboardStyles from "../../../styles/Driver/AvailableDashboard/availableDashboardStyles";
import sectionBorder from "../../../images/UserDashboard/sectionBorder.png";

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
  constructor(props) {
    super(props);

    let token = localStorage.getItem("token");
    const data = jwtDecode(token);

    this.state = { orders: [], showLoading: false, userFname: data.fname };
  }

  componentDidMount = async () => {
    this.getOrders();
  };

  getOrders = () => {
    this.setState({ showLoading: true }, async () => {
      await axios
        .get(baseURL + "/order/getOrders", {})
        .then((res) => {
          if (res.data.success) {
            console.log("list of orders:");
            console.log(res.data.message);

            //filter only status 0 and 4
            let filteredOrders = res.data.message.filter((order) => {
              return (
                order.orderInfo.status === 0 || order.orderInfo.status === 4
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

  handlePickupAccept = async (order) => {
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let driverEmail = data.email;
    let orderID = order.orderInfo.orderID;

    let success;
    await axios
      .post(baseURL + "/driver/assignOrderPickup", { driverEmail, orderID })
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

  handleDropoffAccept = async (order) => {
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let driverEmail = data.email;
    let orderID = order.orderInfo.orderID;

    let success;
    await axios
      .post(baseURL + "/driver/assignOrderDropoff", { driverEmail, orderID })
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
          handlePickupAccept={this.handlePickupAccept}
          handleDropoffAccept={this.handleDropoffAccept}
        />
        <Backdrop className={classes.backdrop} open={this.state.showLoading}>
          <CircularProgress color="inherit" />
        </Backdrop>
      </React.Fragment>
    );
  }
}

AvailableDashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(availableDashboardStyles)(AvailableDashboard);
