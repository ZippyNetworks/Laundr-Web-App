import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import { Layout } from "../../src/layouts";
import { getCurrentUser, updateToken } from "../../src/helpers/session";
import { Loading } from "../../src/utility";
import PropTypes from "prop-types";
import AccountInfo from "../../src/components/User/Account/components/AccountInfo";
import PaymentInfo from "../../src/components/User/Account/components/PaymentInfo";
import accountStyles from "../../src/styles/User/Account/accountStyles";

class Account extends Component {
  state = {
    loading: true,
    user: null,
    accountInfoComponent: null,
    paymentInfoComponent: null,
  };

  componentDidMount = async () => {
    let currentUser = getCurrentUser();

    await updateToken(currentUser.email);

    currentUser = getCurrentUser();

    this.setState({
      accountInfoComponent: <AccountInfo user={currentUser} />,
      paymentInfoComponent: <PaymentInfo user={currentUser} />,
      loading: false,
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Layout>
        {this.state.loading && <Loading />}
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
            src="/images/UserDashboard/sectionBorder.png"
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
          <Grid item>{this.state.accountInfoComponent}</Grid>
          <Grid item>{this.state.paymentInfoComponent}</Grid>
        </Grid>
      </Layout>
    );
  }
}

Account.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(accountStyles)(Account);
