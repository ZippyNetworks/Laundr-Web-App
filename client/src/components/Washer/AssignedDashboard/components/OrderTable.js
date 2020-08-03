import React, { Component } from "react";
import PropTypes from "prop-types";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  IconButton,
  Grid,
  Paper,
  TableContainer,
} from "@material-ui/core";
import Close from "@material-ui/icons/Close";
import orderTableStyles from "../../../../styles/Washer/AssignedDashboard/components/orderTableStyles";

class OrderTable extends Component {
  state = {
    showActionDialog: false,
    actionDialogTitle: "",
    currentOrder: null,
    // openSnackbar: false,
    // snackbarMessage: "",
    // snackbarSuccess: true,
  };

  renderStage = (stage) => {
    if (stage === 3) {
      return "Washing";
    }
  };

  renderActions = (stage) => {
    if (stage === 3) {
      return "Done";
    }
  };

  handleActionClicked = (stage, order) => {
    this.setState({ currentOrder: order }, () => {
      if (stage === 3) {
        this.setState({
          showActionDialog: true,
          actionDialogTitle: "Confirmation",
        });
      }
    });
  };

  renderDialogContent = () => {
    const order = this.state.currentOrder;

    if (order) {
      const status = order.orderInfo.status;

      if (status === 3) {
        return (
          <React.Fragment>
            <Typography variant="body1">
              Please confirm that you have finished washing the order from:
            </Typography>
            <Typography
              variant="body1"
              style={{ fontWeight: 600, textAlign: "center" }}
            >
              {`${order.userInfo.fname} ${order.userInfo.lname}`}
            </Typography>
          </React.Fragment>
        );
      }
    }
  };

  renderDialogActions = (classes) => {
    const order = this.state.currentOrder;

    if (order) {
      const status = order.orderInfo.status;

      if (status === 3) {
        return (
          <React.Fragment>
            <Button
              onClick={this.handleDialogClose}
              color="primary"
              variant="contained"
              className={classes.gradient}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                let success = await this.props.handleWasherDone(
                  this.state.currentOrder
                );
                if (success) {
                  this.renderDoneMsg();
                } else {
                  this.renderErrorDoneMsg();
                }
              }}
              color="primary"
              variant="contained"
              className={classes.gradient}
            >
              Confirm
            </Button>
          </React.Fragment>
        );
      }
    }
  };

  handleDialogClose = () => {
    this.setState({ showActionDialog: false });

    const order = this.state.currentOrder;

    if (order.orderInfo.status === 1) {
      //clear weight text field
      this.props.handleWeightChange("");
    }
  };

  renderDoneMsg = async () => {
    await this.props.getOrders();
  };

  renderErrorDoneMsg = () => {
    alert("error - placeholder");
  };

  renderWasherPrefs = (order) => {
    const scented = order.washerInfo.scented;
    const delicates = order.washerInfo.delicates;
    const separate = order.washerInfo.separate;
    const towelsSheets = order.washerInfo.towelsSheets;

    let prefs = "";

    if (scented) {
      prefs += "Scented, ";
    }

    if (delicates) {
      prefs += "Delicates, ";
    }

    if (separate) {
      prefs += "Separate, ";
    }

    if (towelsSheets) {
      prefs += "Towels and Sheets,";
    }

    if (towelsSheets) {
      prefs = prefs.slice(0, prefs.length - 1);
    } else {
      prefs = prefs.slice(0, prefs.length - 2);
    }

    return prefs;
  };

  render() {
    const { classes } = this.props;

    return (
      <Card>
        <CardContent className={classes.noPaddingCard}>
          <PerfectScrollbar>
            <React.Fragment>
              <Dialog
                open={this.state.showActionDialog}
                onClose={this.handleDialogClose}
              >
                <DialogTitle>{this.state.actionDialogTitle}</DialogTitle>
                <DialogContent>{this.renderDialogContent()}</DialogContent>
                <DialogActions>
                  {this.renderDialogActions(classes)}
                </DialogActions>
              </Dialog>
            </React.Fragment>
            <div className={classes.inner}>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="left">Date/Time</TableCell>
                      <TableCell align="left">User Phone</TableCell>
                      <TableCell align="left">Instructions</TableCell>
                      <TableCell align="left">Preferences</TableCell>
                      <TableCell align="left">Load Size</TableCell>
                      <TableCell align="left">Stage</TableCell>
                      <TableCell align="left">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.props.orders.map((order) => (
                      <TableRow key={order.orderInfo.orderID}>
                        <TableCell>
                          <div className={classes.nameContainer}>
                            <Typography variant="body1">
                              {`${order.userInfo.fname} ${order.userInfo.lname}`}
                            </Typography>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Grid
                            container
                            direction="column"
                            justify="center"
                            alignItems="flex-start"
                            spacing={1}
                          >
                            <Grid item>
                              <Paper elevation={1}>
                                <div className={classes.cardCell}>
                                  <Typography
                                    variant="body1"
                                    style={{ fontWeight: 600 }}
                                  >
                                    Pickup:&nbsp;
                                  </Typography>
                                  <Typography variant="body1">{` ${order.pickupInfo.date} @ ${order.pickupInfo.time}`}</Typography>
                                </div>
                              </Paper>
                            </Grid>
                            <Grid item>
                              <Paper elevation={1}>
                                <div className={classes.cardCell}>
                                  <Typography
                                    variant="body1"
                                    style={{ fontWeight: 600 }}
                                  >
                                    Dropoff:&nbsp;
                                  </Typography>
                                  <Typography variant="body1">
                                    {` ${order.dropoffInfo.date} @ ${order.dropoffInfo.time}`}
                                  </Typography>
                                </div>
                              </Paper>
                            </Grid>
                          </Grid>
                        </TableCell>
                        <TableCell>{order.userInfo.phone}</TableCell>
                        <TableCell>{order.washerInfo.prefs}</TableCell>
                        <TableCell>{this.renderWasherPrefs(order)}</TableCell>
                        <TableCell>{420}</TableCell>
                        <TableCell>
                          {this.renderStage(order.orderInfo.status)}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            className={classes.gradient}
                            color="primary"
                            onClick={() => {
                              this.handleActionClicked(
                                order.orderInfo.status,
                                order
                              );
                            }}
                          >
                            {this.renderActions(order.orderInfo.status)}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </PerfectScrollbar>
        </CardContent>
        {/* <React.Fragment>
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            open={this.state.openSnackbar}
            autoHideDuration={6000}
            onClose={(event, reason) => {
              if (reason !== "clickaway") {
                this.setState({ openSnackbar: false });
              }
            }}
            message={this.state.snackbarMessage}
            action={
              <React.Fragment>
                <IconButton
                  size="small"
                  aria-label="close"
                  color="inherit"
                  onClick={() => {
                    this.setState({ openSnackbar: false });
                  }}
                >
                  <Close fontSize="small" />
                </IconButton>
              </React.Fragment>
            }
            ContentProps={{
              style: {
                backgroundColor: this.state.snackbarSuccess ? "green" : "red",
              },
            }}
          />
        </React.Fragment> */}
      </Card>
    );
  }
}

OrderTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(orderTableStyles)(OrderTable);
