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
} from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import ReactScoreIndicator from "react-score-indicator";
import jwtDecode from "jwt-decode";
import baseURL from "../../../../../baseURL";
import subscriptionStatusStyles from "../../../../../styles/User/Subscription/components/SubscriptionStatus/subscriptionStatusStyles";

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
  constructor(props) {
    super(props);

    let defaultSubscription = {
      plan: "",
      lbsLeft: "",
    };

    let token = localStorage.getItem("token");
    const data = jwtDecode(token);

    this.state = {
      subscription: defaultSubscription,
      userEmail: data.email,
    };
  }

  componentDidMount = async () => {
    let userEmail = this.state.userEmail;

    await axios
      .post(baseURL + "/user/updateToken", { userEmail })
      .then((res) => {
        if (res.data.success) {
          const token = res.data.token;
          localStorage.setItem("token", token);
          const data = jwtDecode(token);
          this.setState({ subscription: data.subscription });
        } else {
          alert("Error with updating token");
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  };

  renderMaxLbs = () => {
    switch (this.state.subscription.plan) {
      case "Student":
        return 40;

      case "Standard":
        return 48;

      case "Plus":
        return 66;

      case "Family":
        return 84;
    }
  };

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Grid item>
          <div className={classes.infoCard}>
            <CardHeader
              title={`Current plan: ${this.state.subscription.plan}`}
              titleTypographyProps={{ variant: "h2" }}
            />
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ReactScoreIndicator
                value={this.state.subscription.lbsLeft}
                maxValue={this.renderMaxLbs()}
                width={300}
                lineGap={0}
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
                    top: 170,
                    left: -245,
                    position: "absolute",
                  }}
                >
                  <Typography variant="h3">Pounds left:</Typography>
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
                  Period Start
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  aaa
                </Typography>
                <Typography variant="body1" style={{ fontWeight: 500 }}>
                  Period End
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                  aaa
                </Typography>
              </div>
              <Button variant="contained" className={classes.gradientButton}>
                Manage
              </Button>
            </CardContent>
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
