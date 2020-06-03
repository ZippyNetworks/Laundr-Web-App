import React, { Component } from "react";
import { Grid } from "@material-ui/core";
import SubscriptionCard from "./components/SubscriptionCard";
import Standard from "../../../../../images/Subscription/Standard.png";
import Plus from "../../../../../images/Subscription/Plus.png";
import Family from "../../../../../images/Subscription/Family.png";
import Student from "../../../../../images/Subscription/Student.png";

class SubscriptionBoxes extends Component {
  render() {
    return (
      <React.Fragment>
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
      </React.Fragment>
    );
  }
}

export default SubscriptionBoxes;
