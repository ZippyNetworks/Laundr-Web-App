import React, { Component } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import accountInfoStyles from "../../../../styles/User/Account/components/accountInfoStyles";

class AccountInfo extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <h1>account info</h1>
      </React.Fragment>
    );
  }
}

AccountInfo.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(accountInfoStyles)(AccountInfo);
