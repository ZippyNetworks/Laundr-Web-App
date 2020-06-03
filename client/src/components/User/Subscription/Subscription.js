import React, { Component } from "react";
import { withStyles, Grid, Typography, Paper } from "@material-ui/core";
import PropTypes from "prop-types";
import SubscriptionCard from "./components/SubscriptionCard";
import subscriptionStyles from "../../../styles/User/Subscription/subscriptionStyles";
import sectionBorder from "../../../images/UserDashboard/sectionBorder.png";
import Standard from "../../../images/Subscription/Standard.png";
import Plus from "../../../images/Subscription/Plus.png";
import Family from "../../../images/Subscription/Family.png";
import Student from "../../../images/Subscription/Student.png";

class Subscription extends Component {
  constructor(props) {
    super(props);
  }

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
              Subscription
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
        <Grid
          container
          spacing={2}
          direction="row"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <Grid item>
            <SubscriptionCard
              planName="Standard"
              image={Standard}
              priceText="$15/week"
              text="48 lbs/month"
            />
          </Grid>
          <Grid item>
            <SubscriptionCard
              planName="Plus"
              image={Plus}
              priceText="$20/week"
              text="66 lbs/month"
            />
          </Grid>
          <Grid item>
            <SubscriptionCard
              planName="Family"
              image={Family}
              priceText="$25/week"
              text="84 lbs/month"
            />
          </Grid>
          <Grid item>
            <SubscriptionCard
              planName="Student"
              image={Student}
              priceText="$10/week"
              text="40 lbs/month"
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionStyles)(Subscription);
