import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import jwtDecode from "jwt-decode";
import baseURL from "../../../baseURL";
import axios from "axios";
import AccountInfo from "./components/AccountInfo";
import accountStyles from "../../../styles/User/Account/accountStyles";
import sectionBorder from "../../../images/UserDashboard/sectionBorder.png";

class Account extends Component {
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
              Account
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
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <AccountInfo />
        </Grid>
      </React.Fragment>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(accountStyles)(Account);
