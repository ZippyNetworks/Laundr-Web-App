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
import {
  Chart,
  PieSeries,
  Title,
} from "@devexpress/dx-react-chart-material-ui";
import { Animation } from "@devexpress/dx-react-chart";
import {
  Template,
  Plugin,
  TemplatePlaceholder,
  TemplateConnector,
} from "@devexpress/dx-react-core";
import PropTypes from "prop-types";
import subscriptionStatusStyles from "../../../../styles/User/Subscription/components/subscriptionStatusStyles";

const data = [
  { region: "1", val: 5 },
  { region: "2", val: 5 },
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
              <Chart data={data} height={400} width={400}>
                <PieSeries
                  valueField="val"
                  argumentField="region"
                  innerRadius={0.8}
                />
                <Plugin name="innerText">
                  <Template name="series">
                    <TemplatePlaceholder />
                    <TemplateConnector>
                      {() => {
                        return (
                          <Typography
                            variant="h1"
                            style={{
                              left: 250,
                              top: 50,
                              position: "absolute",
                            }}
                          >
                            Subscription
                          </Typography>
                        );
                      }}
                    </TemplateConnector>
                  </Template>
                </Plugin>
                <Animation />
              </Chart>
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
