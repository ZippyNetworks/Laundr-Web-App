import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  Button,
  Card,
  CardHeader,
  Divider,
  CardContent,
  CardActions,
} from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import ReactScoreIndicator from "react-score-indicator";
import PlayCircleOutlineIcon from "@material-ui/icons/PlayCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import jwtDecode from "jwt-decode";
import baseURL from "../../../../../baseURL";
import subscriptionStatusStyles from "../../../../../styles/User/Subscription/components/SubscriptionStatus/subscriptionStatusStyles";

const moment = require("moment");

const doughnutColors = [
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
  "#01c9e2",
];

class SubscriptionStatus extends Component {
  renderMaxLbs = () => {
    switch (this.props.subscription.plan) {
      case "Student":
        return 40;

      case "Standard":
        return 48;

      case "Plus":
        return 66;

      case "Family":
        return 84;

      default:
        return;
    }
  };

  renderPeriodStart = () => {
    if (this.props.subscription.periodStart === "N/A") {
      return "N/A";
    } else {
      return moment(this.props.subscription.periodStart).format("MM/DD");
    }
  };

  renderPeriodEnd = () => {
    if (this.props.subscription.periodEnd === "N/A") {
      return "N/A";
    } else {
      return moment(this.props.subscription.periodEnd).format("MM/DD");
    }
  };

  handleManageSub = async () => {
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);

    let customerID = data.stripe.customerID;

    await axios
      .post(baseURL + "/stripe/createSelfPortal", { customerID })
      .then((res) => {
        if (res.data.success) {
          window.open(res.data.message, "_self");
        } else {
          alert("Error with creating self-service portal. Please contact us.");
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Grid item>
          <div className={classes.infoCard}>
            <CardHeader
              title={`Current Plan: ${this.props.subscription.plan}`}
              titleTypographyProps={{ variant: "h3" }}
            />
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ReactScoreIndicator
                value={this.props.subscription.lbsLeft}
                maxValue={this.renderMaxLbs()}
                width={290}
                lineGap={1}
                lineWidth={15}
                fadedOpacity={20}
                stepsColors={doughnutColors}
              />
              <div
                style={{
                  position: "relative",
                }}
              >
                <div
                  style={{
                    top: 175,
                    left: -210,
                    position: "absolute",
                  }}
                >
                  <Typography variant="h3">Pounds Left</Typography>
                </div>
                <div
                  style={{
                    top: 40,
                    left: -250,
                    position: "absolute",
                  }}
                >
                  <img
                    style={{ height: 133, width: 214 }}
                    src="/images/Subscription/Box.png"
                    alt="Box"
                  />
                </div>
              </div>
            </CardContent>
          </div>
        </Grid>
        <Grid item>
          <Card className={classes.subInfoCard}>
            <CardHeader
              title="Subscription Information"
              titleTypographyProps={{ variant: "h5" }}
            />
            <Divider />
            <CardContent
              style={{
                justifyContent: "center",
              }}
            >
              <div className={classes.cardCell}>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  <PlayCircleOutlineIcon
                    fontSize="small"
                    style={{ marginBottom: -4 }}
                  />{" "}
                  Period Start
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {this.renderPeriodStart()}
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  <HighlightOffIcon
                    fontSize="small"
                    style={{ marginBottom: -4 }}
                  />{" "}
                  Period End
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {this.renderPeriodEnd()}
                </Typography>
              </div>
            </CardContent>
            <Divider />
            <CardActions style={{ justifyContent: "center" }}>
              <Button
                size="small"
                variant="contained"
                className={classes.gradientButton}
                onClick={this.handleManageSub}
              >
                Manage
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </React.Fragment>
    );
  }
}

SubscriptionStatus.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionStatusStyles)(SubscriptionStatus);
