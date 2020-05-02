import React, { Component } from "react";
import { Grid, Typography, Button, withStyles } from "@material-ui/core";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import PropTypes from "prop-types";
import DateFnsUtils from "@date-io/date-fns";
import schedulingStyles from "../../styles/NewOrder/schedulingStyles";

class Scheduling extends Component {
  render() {
    const classes = this.props.classes;

    return (
      <React.Fragment>
        <Typography component="h1" variant="h6" gutterBottom>
          What day would you like your order to be picked up?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={this.props.todaySelected}
              onClick={this.props.handleTodayChange}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<CalendarTodayIcon />}
            >
              Today: {this.props.today}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              disabled={this.props.tomorrowSelected}
              onClick={this.props.handleTomorrowChange}
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              startIcon={<CalendarTodayIcon />}
            >
              Tomorrow: {this.props.tomorrow}
            </Button>
          </Grid>
        </Grid>
        <Typography
          component="h1"
          variant="h6"
          gutterBottom
          className={classes.title}
        >
          What's your preferred pickup time?
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <TimePicker
                margin="normal"
                id="time-picker"
                label="Select a time"
                onChange={(value) => {
                  this.props.handleTimeChange(value);
                }}
                helperText="*Must be at least 1 hour in advance"
                value={this.props.rawTime}
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

Scheduling.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(schedulingStyles)(Scheduling);