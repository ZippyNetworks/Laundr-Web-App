import React, { Component } from "react";
import { Grid, withStyles, Paper, Typography } from "@material-ui/core";
import { Layout } from "../../src/layouts";
import { getCurrentUser } from "../../src/helpers/session";
import { showDefaultError } from "../../src/helpers/errors";
import { Loading } from "../../src/utility";
import PropTypes from "prop-types";
import axios from "axios";
import baseURL from "../../src/baseURL";
import NewOrder from "../../src/components/User/Dashboard/components/NewOrder/NewOrder";
import OrderStatus from "../../src/components/User/Dashboard/components/OrderStatus/OrderStatus";
import AutoRotatingCarousel from "../../src/components/User/Dashboard/components/Carousel/AutoRotatingCarousel";
import Slide from "../../src/components/User/Dashboard/components/Carousel/Slide";
import dashboardStyles from "../../src/styles/User/Dashboard/dashboardStyles";

//refactor priorities:
//!!!map multiple routes to single component
//-add loading...only to components that need to fetch data from the user? for example login doesnt have it and uses localstorage, but not while rendering i guess? whereas dashboard needs it to prevent localstorage error.
//^^ figure out, also use getstaticprops for fetching something like orders? keep loading until everything is fetched, so if theres an error the loading stays
//^^also, loading on only main pages (after logged in, before main component rendered aka sidebar and topbar are there tho)? or different loading for individual components/fullscreen (like from login)
//findOneAndUpdate where possible, add ${error} to caughtError string and also shown error

//-individual components (use helpers and loading component)
//-change error messages to use console and default error/restructure frontend error messages properly
//-implement update token helper
//-fix places autocomplete on address
//-imports (use index.js) from root for images, styles, deep components, etc.
//-styles as named exports, restructure folders and change file names?
//-server stuff: error messages (need to update frontend to consume them), middleware, remove chained promises, put/post/get
//fix MUI grid spacing causing negative margin (horizontal scrollbar)

//todo: implement status 8 feature for order status when order is delivered
//todo: !!!change laundr bomb logo to less horizontal, or else scrollbar appears on mobile
//todo: !!!configure rest of pages for mobile, for login and register use vw vh
//todo: fix white line appearing when small mobile
//todo: implement admin stuff...later
//todo: research efficient querying, maybe better to sort in the query rather than grab all orders?
//todo: maybe move logout button since if on mobile hitting sidebar button is close
//todo: add isUser? maybe when im less lazy
//todo: maybe remove help slide and on help pg just have call, chat, dm, ticket?
//todo: add color scheme to gradients
//todo: stripe self-serve portal handles all the payment info stuff??
//todo: maybe just store their payment id, check if it exists every time a on-demand charge is made, use the id to modify method. sub is separate card?
//todo: !!!cannot edit card #, so if user updates payment method then delete the old one and add the new one, also updating the user property id
//todo: 10lb minimum on orders - so if you send one sock you get charged 10 lbs. (add to new order notes)
//todo: sort out customer email thing (different: login vs stripe - can be changed with checkout session)
//todo: move moment to higher level package.json
//todo: add button styling to ALL dialogs
//todo: add progress circle to buttons for submission actions

class Dashboard extends Component {
  state = {
    loading: true,
    orderComponent: null,
    orderComponentName: "",
    userFname: "",
  };

  componentDidMount = async () => {
    await this.fetchOrderInfo();
  };

  fetchOrderInfo = async () => {
    try {
      const currentUser = getCurrentUser();

      const response = await axios.get(`${baseURL}/order/getExistingOrder`, {
        params: {
          email: currentUser.email,
        },
      });

      if (response.data.success) {
        let component;
        let componentName;

        if (response.data.message === "N/A") {
          component = <NewOrder />;
          componentName = "New Order";
        } else {
          component = <OrderStatus order={response.data.message} />;
          componentName = "Order Status";
        }

        this.setState({
          orderComponent: component,
          orderComponentName: componentName,
          userFname: currentUser.fname,
          loading: false,
        });
      } else {
        //todo: this will be the error message from the server. like in eat me
        showDefaultError("fetching orders", 1);
      }
    } catch (error) {
      console.log("Error with fetching order info: ", error);
      showDefaultError("fetching order info", 2);
    }
  };

  render() {
    const { classes } = this.props;

    return (
      <Layout>
        {this.state.loading && <Loading />}
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{
            paddingTop: 8,
            backgroundColor: "#21d0e5",
          }}
        >
          <Grid item>
            <Paper elevation={3} className={classes.welcomeCard}>
              <Typography
                variant="h3"
                className={classes.welcomeText}
                gutterBottom
              >
                {`Welcome, ${this.state.userFname}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Typography
              variant="h1"
              className={classes.orderComponentName}
              gutterBottom
            >
              {this.state.orderComponentName}
            </Typography>
            {/* <CardHeader
              title={this.state.orderComponentName}
              titleTypographyProps={{ variant: "h1", align: "center" }}
              classes={{ title: classes.orderComponentName }}
            /> */}
          </Grid>
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src="/images/UserDashboard/sectionBorder.png"
            style={{ width: "100%", height: "100%" }}
            alt="Section border"
          />
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <Grid item>{this.state.orderComponent}</Grid>
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src="/images/UserDashboard/sectionBorderWhite.jpeg"
            style={{
              width: "100%",
              height: "100%",
              transform: "rotate(180deg)",
            }}
            alt="Section border"
          />
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{ backgroundColor: "#21d0e5" }}
        >
          <Grid item>
            <Typography variant="h1" className={classes.carouselTitle}>
              Check these out!
            </Typography>
          </Grid>
          <Grid item>
            <div className={classes.layout}>
              <div id="carouselContainer">
                <AutoRotatingCarousel
                  open={true}
                  autoplay={true}
                  mobile={false}
                  interval={6000}
                  style={{ position: "absolute" }}
                >
                  <Slide
                    media={
                      <img
                        src="/images/UserDashboard/LaundrBombsLogo.png"
                        alt="Laundr Bombs"
                      />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#DC3825" }}
                    style={{ backgroundColor: "#A2261D" }}
                    title="Try our new Laundr Bombs"
                    subtitle="Freshen up your laundry with specialized scents!"
                    buttonText="Learn more"
                    buttonLink="https://www.laundr.io/laundr-bombs/"
                  />
                  <Slide
                    media={
                      <img
                        src="/images/UserDashboard/StudentPlanLogo.png"
                        alt="Student Subscriptions"
                      />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#2F92EA" }}
                    style={{ backgroundColor: "#0E62AE" }}
                    title="Student Subscriptions now available"
                    subtitle="If you're a student, you can get a discount on a Laundr subscription!"
                    buttonText="Learn more"
                    buttonLink="https://www.laundr.io/"
                  />
                  <Slide
                    media={
                      <img
                        src="/images/UserDashboard/InstagramLogo.png"
                        alt="Instagram"
                      />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#C560D2" }}
                    style={{ backgroundColor: "#8D2B9A" }}
                    title="Check us out on Instagram"
                    subtitle="Visit our Instagram for the latest updates and chances for free stuff!"
                    buttonText="Go"
                    buttonLink="https://www.instagram.com/laundrofficial/"
                  />
                  <Slide
                    media={
                      <img
                        src="/images/UserDashboard/SupportLogo.png"
                        alt="Customer Support"
                      />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#817A7A" }}
                    style={{ backgroundColor: "#695F5F" }}
                    title="Need help?"
                    subtitle="Feel free to call us at 352-363-5211 or click below to chat with a representative!"
                    buttonText="Go"
                    buttonLink="https://www.messenger.com/t/laundrofficial"
                  />
                </AutoRotatingCarousel>
              </div>
            </div>
          </Grid>
        </Grid>
        <Grid
          container
          spacing={0}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src="/images/UserDashboard/sectionBorder.png"
            style={{ width: "100%", height: "100%" }}
            alt="Section border"
          />
        </Grid>
      </Layout>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyles)(Dashboard);
