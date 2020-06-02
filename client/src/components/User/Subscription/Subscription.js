import React, { Component } from "react";
import { withStyles } from "@material-ui/core";
import PropTypes from "prop-types";
import subscriptionStyles from "../../../styles/User/Subscription/subscriptionStyles";

class Subscription extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const classes = this.props.classes;

    return <h1>this is a sub page</h1>;
  }
}

Subscription.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionStyles)(Subscription);
