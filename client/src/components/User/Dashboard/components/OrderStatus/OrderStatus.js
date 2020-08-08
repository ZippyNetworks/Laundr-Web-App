import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  withStyles,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Grid,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CardActions,
} from "@material-ui/core";
import { caughtError, showConsoleError } from "../../../../../helpers/errors";
import axios from "axios";
import MainAppContext from "../../../../../contexts/MainAppContext";
import baseURL from "../../../../../baseURL";
import HomeRoundedIcon from "@material-ui/icons/HomeRounded";
import QueryBuilderIcon from "@material-ui/icons/QueryBuilder";
import LocalMallIcon from "@material-ui/icons/LocalMall";
import ProgressBar from "./components/ProgressBar";
import orderStatusStyles from "../../../../../styles/User/Dashboard/components/OrderStatus/orderStatusStyles";

//0: order just placed
//1: order accepted by driver to be picked up from user
//2: weight entered
//3: order dropped off to washer
//4: order done by washer
//5: order accept by driver to be delivered back to user
//6: order delivered to user
//7: canceled
//8: fulfilled (user confirmed theyve seen the status on it)

class OrderStatus extends Component {
  static contextType = MainAppContext;

  state = { showCancelDialog: false, hi: null };

  handleOrderCancel = async (order) => {
    try {
      const response = await axios.delete(`${baseURL}/order/cancelOrder`, {
        params: {
          orderID: order.orderInfo.orderID,
        },
      });

      this.setState({ showCancelDialog: false }, () => {
        this.context.showAlert(
          response.data.message,
          this.props.fetchOrderInfo
        );
      });
    } catch (error) {
      showConsoleError("cancelling order", error);
      this.context.showAlert(caughtError("cancelling order", error, 99));
    }
  };

  toggleCancelDialog = () => {
    this.setState({ showCancelDialog: !this.state.showCancelDialog });
  };

  renderDropoffComponent = (classes, order) => {
    //if status is not at least 2 and no time is entered
    if (order.orderInfo.status < 2 && order.dropoffInfo.time === "N/A") {
      return (
        <Typography variant="body1" color="textSecondary">
          TBD
        </Typography>
      );
    } else if (order.dropoffInfo.time !== "N/A") {
      return (
        <Typography variant="body1" color="textSecondary">
          order.dropoffInfo.time
        </Typography>
      );
    } else {
      return (
        <Button
          size="small"
          variant="contained"
          className={classes.gradient}
          onClick={() => {
            alert("dropoff");
          }}
          style={{ marginBottom: 5 }}
        >
          Set Dropoff Time
        </Button>
      );
    }
  };

  render() {
    const { classes, order } = this.props;

    return (
      <React.Fragment>
        <div className={classes.layout}>
          <div className={classes.root}>
            <Dialog
              disableEnforceFocus
              disableAutoFocus
              disableRestoreFocus
              open={this.state.showCancelDialog}
              onClose={this.toggleCancelDialog}
              container={() => document.getElementById("orderStatusContainer")}
              style={{ position: "absolute", zIndex: 1 }}
              BackdropProps={{
                style: {
                  position: "absolute",
                  backgroundColor: "transparent",
                },
              }}
            >
              <DialogTitle>Confirmation</DialogTitle>
              <DialogContent>
                <Typography variant="body1">
                  Are you sure you want to cancel your order?
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.toggleCancelDialog} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    this.handleOrderCancel(order);
                  }}
                  color="primary"
                >
                  Confirm
                </Button>
              </DialogActions>
            </Dialog>
            <CardContent id="orderStatusContainer">
              <ProgressBar status={order.orderInfo.status} />
              <Grid
                container
                direction="row"
                alignItems="center"
                justify="center"
              >
                <Grid item>
                  <Card className={classes.infoCard}>
                    <CardHeader
                      title={`Order ID: #${order.orderInfo.orderID}`}
                      titleTypographyProps={{ variant: "h4" }}
                    />
                    <Divider />
                    <CardContent>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <HomeRoundedIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Address
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {order.orderInfo.address}
                      </Typography>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <QueryBuilderIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Pickup Time
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {order.pickupInfo.time}
                      </Typography>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <QueryBuilderIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Dropoff Time
                      </Typography>
                      {this.renderDropoffComponent(classes, order)}

                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <LocalMallIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Weight
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {order.orderInfo.weight === "N/A"
                          ? "TBD"
                          : `${order.orderInfo.weight} lbs`}
                      </Typography>
                      <Typography variant="h5" style={{ marginBottom: -10 }}>
                        {order.orderInfo.cost === -1
                          ? "Price: TBD"
                          : `Price: $${order.orderInfo.cost}`}
                      </Typography>
                    </CardContent>
                    <Divider />
                    <CardActions style={{ justifyContent: "center" }}>
                      <Button
                        size="small"
                        variant="contained"
                        className={classes.gradient}
                        onClick={this.toggleCancelDialog}
                      >
                        Cancel
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              </Grid>
            </CardContent>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

OrderStatus.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(orderStatusStyles)(OrderStatus);
