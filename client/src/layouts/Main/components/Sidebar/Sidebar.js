import React, { Component } from "react";
import clsx from "clsx";
import PropTypes from "prop-types";
import { Divider, Drawer, withStyles } from "@material-ui/core";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import HistoryIcon from "@material-ui/icons/History";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import LocalLaundryServiceIcon from "@material-ui/icons/LocalLaundryService";
import { Profile, SidebarNav /*UpgradePlan*/ } from "./components";
import jwtDecode from "jwt-decode";
import sidebarStyles from "../../../../styles/layouts/Main/components/Sidebar/sidebarStyles";

const userPages = [
  {
    title: "Dashboard",
    href: "/userDashboard",
    icon: <DashboardIcon />,
  },
  {
    title: "Order History",
    href: "/placeholder",
    icon: <HistoryIcon />,
  },
  {
    title: "Subscription",
    href: "/placeholder",
    icon: <LocalLaundryServiceIcon />,
  },
  {
    title: "Account",
    href: "/placeholder",
    icon: <AccountBoxIcon />,
  },
  {
    title: "Help",
    href: "/placeholder",
    icon: <HelpOutlineIcon />,
  },
];

const driverPages = [
  {
    title: "Available Orders",
    href: "/driverAvailable",
    icon: <AssignmentIcon />,
  },
  {
    title: "Accepted Orders",
    href: "/driverAccepted",
    icon: <AssignmentTurnedInIcon />,
  },
  {
    title: "Order History",
    href: "/placeholder",
    icon: <HistoryIcon />,
  },
  {
    title: "Account",
    href: "/placeholder",
    icon: <AccountBoxIcon />,
  },
];

const washerPages = [
  {
    title: "Assigned Orders",
    href: "/washerAssigned",
    icon: <AssignmentIcon />,
  },
  {
    title: "Order History",
    href: "/placeholder",
    icon: <HistoryIcon />,
  },
  {
    title: "Account",
    href: "/placeholder",
    icon: <AccountBoxIcon />,
  },
];

class Sidebar extends Component {
  constructor(props) {
    super(props);

    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    this.state = {
      isWasher: data.isWasher,
      isDriver: data.isDriver,
      isAdmin: data.isAdmin,
    };
  }

  render() {
    const { open, variant, onClose, className, ...rest } = this.props;
    const classes = this.props.classes;
    let pagesConfig = null;

    if (this.state.isWasher) {
      pagesConfig = washerPages;
    } else if (this.state.isDriver) {
      pagesConfig = driverPages;
    } else if (this.state.isAdmin) {
      pagesConfig = washerPages;
    } else {
      pagesConfig = userPages;
    }

    return (
      <Drawer
        anchor="left"
        classes={{ paper: classes.drawer }}
        onClose={onClose}
        open={open}
        variant={variant}
      >
        <div {...rest} className={clsx(classes.root, className)}>
          <Profile />
          <Divider className={classes.divider} />
          <SidebarNav className={classes.nav} pages={pagesConfig} />
          {/* <UpgradePlan /> */}
        </div>
      </Drawer>
    );
  }
}

Sidebar.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired,
  variant: PropTypes.string.isRequired,
};

export default withStyles(sidebarStyles)(Sidebar);
