import React, { Component } from "react";
import { withStyles, Grid, Typography, Paper } from "@material-ui/core";
import PropTypes from "prop-types";
import subscriptionStyles from "../../../styles/User/Subscription/subscriptionStyles";
import sectionBorder from "../../../images/UserDashboard/sectionBorder.png";

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
            <h1>1</h1>
          </Grid>
          <Grid item>
            <h1>2</h1>
          </Grid>
          <Grid item>
            <h1>3</h1>
          </Grid>
          <Grid item>
            <h1>4</h1>
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
