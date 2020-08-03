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
  state = { showCancelDialog: false };

  handleOrderCancel = () => {
    alert("Cancel clicked");
  };

  toggleCancelDialog = () => {
    this.setState({ showCancelDialog: !this.state.showCancelDialog });
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
                <Button onClick={this.handleOrderCancel} color="primary">
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
                      titleTypographyProps={{ variant: "h5" }}
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
                      <Typography variant="body1" color="textSecondary">
                        {order.dropoffInfo.time}
                        "functionality later"
                      </Typography>
                      <Typography variant="body1" style={{ fontWeight: 500 }}>
                        <LocalMallIcon
                          fontSize="small"
                          style={{ marginBottom: -4 }}
                        />{" "}
                        Weight
                      </Typography>
                      <Typography variant="body1" color="textSecondary">
                        {order.orderInfo.weight} lbs
                      </Typography>
                      <Typography variant="h5">
                        Price: {order.orderInfo.cost}
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
