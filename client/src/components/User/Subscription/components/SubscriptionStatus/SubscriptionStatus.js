import React, { Component } from "react";
import {
  withStyles,
  Grid,
  Typography,
  Paper,
  Card,
  CardHeader,
  Divider,
  CardContent,
} from "@material-ui/core";
import PropTypes from "prop-types";
import ReactScoreIndicator from "./components/ReactScoreIndicatorBeta";
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
  }

  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Grid item>
          <Card className={classes.infoCard}>
            <CardHeader
              title="Current plan: Student"
              titleTypographyProps={{ variant: "h2" }}
            />
            <Divider />
            <CardContent
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <ReactScoreIndicator
                value={30}
                maxValue={100}
                width={300}
                lineGap={0}
                stepsColors={doughnutColors}
              />
              <div
                style={{
                  top: 400,
                  left: 1050,
                  position: "absolute",
                  zIndex: 10,
                }}
              >
                <h1>test</h1>
              </div>
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
