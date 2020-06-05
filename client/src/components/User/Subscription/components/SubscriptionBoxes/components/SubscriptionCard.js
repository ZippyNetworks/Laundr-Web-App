import React, { Component } from "react";
import {
  withStyles,
  Typography,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Divider,
} from "@material-ui/core";
import PropTypes from "prop-types";
import subscriptionCardStyles from "../../../../../../styles/User/Subscription/components/SubscriptionBoxes/components/subscriptionCardStyles";

class SubscriptionCard extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Card className={classes.root}>
          <CardMedia className={classes.media} image={this.props.image} />
          <CardContent style={{ textAlign: "center" }}>
            <Typography gutterBottom variant="h3">
              {this.props.planName}
            </Typography>
            <Typography variant="h4" color="textSecondary" gutterBottom>
              {this.props.priceText}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {this.props.text}
            </Typography>
          </CardContent>
          <Divider variant="fullWidth" />
          <CardActions style={{ justifyContent: "center" }}>
            <Button
              size="small"
              variant="contained"
              className={classes.gradientButton}
            >
              Purchase
            </Button>
          </CardActions>
        </Card>
      </React.Fragment>
    );
  }
}

SubscriptionCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(subscriptionCardStyles)(SubscriptionCard);
