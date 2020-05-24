import React, { Component } from "react";
import { Grid, withStyles, Paper, Typography } from "@material-ui/core";
import PropTypes from "prop-types";
import axios from "axios";
import jwtDecode from "jwt-decode";
import baseURL from "../../baseURL";
import NewOrder from "./NewOrder/NewOrder";
import OrderStatus from "./OrderStatus/OrderStatus";
import AutoRotatingCarousel from "./components/Carousel/AutoRotatingCarousel";
import Slide from "./components/Carousel/Slide";
import dashboardStyles from "../../styles/User/dashboardStyles";
import sectionBorder from "../../images/UserDashboard/sectionBorder.png";
import sectionBorderWhite from "../../images/UserDashboard/sectionBorderWhite.jpeg";
import StudentPlanLogo from "../../images/UserDashboard/StudentPlanLogo.png";
import LaundrBombsLogo from "../../images/UserDashboard/LaundrBombsLogo.png";
import InstagramLogo from "../../images/UserDashboard/InstagramLogo.png";
import SupportLogo from "../../images/UserDashboard/SupportLogo.png";

//todo: add loading backdrop, other dashboards (order related) already have it
//todo: implement status 8 feature for order status when order is delivered
//todo: test button gradients, normal vs login one
//todo: change time picker in scheduling so no scrollbar on desktop view
//todo: !!!change laundr bomb logo to less horizontal, or else scrollbar appears on mobile
//todo: !!!configure rest of pages for mobile, for login and register use vw vh
//todo: fix white line appearing when small mobile
//todo: post vs put? ehh...see hhh.docx for conventions, maybe apply it to controllers
//todo: implement admin stuff...later
//todo: can also use "hidden" component to achieve the single progress icon
//todo: research efficient querying, maybe better to sort in the query rather than grab all orders?
//todo: maybe move logout button since if on mobile hitting sidebar button is close
//todo: add isUser? maybe when im less lazy
//todo: maybe refactor loading to load EVERYTHING first, atm for dashboards its just for the order fetching
//todo: maybe remove help slide and on help pg just have call, chat, dm, ticket?
//todo: add color scheme to gradients
//todo: reorganize user folder, have a folder for each page on left
//todo: make all errors show up on dialog, .catch errors show in alert. every error should have a "please contact us". maybe a please try again
//todo: stripe self-serve portal handles all the payment info stuff??
//todo: maybe just store their payment id, check if it exists every time a on-demand charge is made, use the id to modify method. sub is separate card?

class Dashboard extends Component {
  constructor(props) {
    super(props);

    let token = localStorage.getItem("token");
    const data = jwtDecode(token);

    this.state = {
      orderComponent: null,
      orderComponentName: "",
      userFname: data.fname,
    };
  }

  componentDidMount = () => {
    this.renderOrderInfo();
  };

  renderOrderInfo = async () => {
    let token = localStorage.getItem("token");
    const data = jwtDecode(token);
    let userEmail = data.email;

    let component = null;
    let componentName = "";

    await axios
      .post(baseURL + "/order/getCurrentOrder", { userEmail })
      .then((res) => {
        if (res.data.success) {
          if (res.data.message === "N/A") {
            component = <NewOrder />;
            componentName = "New Order";
          } else {
            component = <OrderStatus order={res.data.message} />;
            componentName = "Order Status";
          }
        } else {
          alert("Error with fetching orders, please contact us.");
        }
      })
      .catch((error) => {
        alert("Error: " + error);
      });

    this.setState({
      orderComponent: component,
      orderComponentName: componentName,
    });
  };

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
            <Paper elevation={3} className={classes.welcomeCard}>
              <Typography variant="h3" className={classes.welcomeText}>
                {`Welcome, ${this.state.userFname}`}
              </Typography>
            </Paper>
          </Grid>
          <Grid item>
            <Typography variant="h1" className={classes.orderComponentName}>
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
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src={sectionBorder}
            style={{ width: "100%", height: "100%", paddingTop: 8 }}
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
          <Grid item>{this.state.orderComponent}</Grid>
        </Grid>
        <Grid
          container
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src={sectionBorderWhite}
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
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
          style={{ backgroundColor: "#21d0e5" }}
        >
          <Grid item>
            <Typography
              variant="h1"
              className={classes.carouselTitle}
              style={{ marginBottom: -25 }}
            >
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
                    media={<img src={LaundrBombsLogo} alt="Laundr Bombs" />}
                    mediaBackgroundStyle={{ backgroundColor: "#DC3825" }}
                    style={{ backgroundColor: "#A2261D" }}
                    title="Try our new Laundr Bombs"
                    subtitle="Freshen up your laundry with specialized scents!"
                    buttonText="Learn more"
                    buttonLink="https://www.laundr.io/laundr-bombs/"
                  />
                  <Slide
                    media={
                      <img src={StudentPlanLogo} alt="Student Subscriptions" />
                    }
                    mediaBackgroundStyle={{ backgroundColor: "#2F92EA" }}
                    style={{ backgroundColor: "#0E62AE" }}
                    title="Student Subscriptions now available"
                    subtitle="If you're a student, you can get a discount on a Laundr subscription!"
                    buttonText="Learn more"
                    buttonLink="https://www.laundr.io/"
                  />
                  <Slide
                    media={<img src={InstagramLogo} alt="Instagram" />}
                    mediaBackgroundStyle={{ backgroundColor: "#C560D2" }}
                    style={{ backgroundColor: "#8D2B9A" }}
                    title="Check us out on Instagram"
                    subtitle="Visit our Instagram for the latest updates and chances for free stuff!"
                    buttonText="Go"
                    buttonLink="https://www.instagram.com/laundrofficial/"
                  />
                  <Slide
                    media={<img src={SupportLogo} alt="Customer Support" />}
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
          spacing={2}
          direction="column"
          justify="center"
          alignItems="center" /*main page column*/
        >
          <img
            src={sectionBorder}
            style={{ width: "100%", height: "100%", paddingTop: 8 }}
            alt="Section border"
          />
        </Grid>
      </React.Fragment>
    );
  }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(dashboardStyles)(Dashboard);

//old layout with welcome at top right and then columns:
// <React.Fragment>
//   <Grid container spacing={1} direction="column" /*main page column*/>
//     <Grid item>
//       <Grid container spacing={1} direction="row" /*first row*/>
//         <Grid item>
//           <Card className={classes.hoverCard}>
//             <CardHeader
//               title={`Welcome, ${this.userFname}`}
//               titleTypographyProps={{ variant: "h1" }}
//               classes={{ title: classes.welcomeText }}
//             />
//           </Card>
//         </Grid>
//       </Grid>
//     </Grid>
//     <Grid item>
//       <Grid container spacing={1} direction="row" /*second row*/>
//         <Grid item>
//           <Grid
//             container
//             spacing={1}
//             direction="column"
//             justify="space-evenly"
//             alignItems="flex-start"
//             /*first column*/
//           >
//             <Grid item>{this.state.orderComponent}</Grid>
//           </Grid>
//         </Grid>
//         <Grid item>
//           <Grid
//             container
//             spacing={1}
//             direction="column"
//             justify="space-evenly"
//             alignItems="flex-start"
//             /*second column*/
//           >
//             <Grid item xs={12}>
//               <Card className={classes.root}>
//                 <CardContent id="carouselContainer">
//                   <AutoRotatingCarousel
//                     label="Get started"
//                     open={true}
//                     autoplay={true}
//                     mobile={false}
//                     style={{ position: "absolute" }}
//                   >
//                     <Slide
//                       media={
//                         <img src="http://www.icons101.com/icon_png/size_256/id_79394/youtube.png" />
//                       }
//                       mediaBackgroundStyle={{ backgroundColor: "red" }}
//                       style={{ backgroundColor: "blue" }}
//                       title="This is a very cool feature"
//                       subtitle="Just using this will blow your mind."
//                     />
//                     <Slide
//                       media={
//                         <img src="http://www.icons101.com/icon_png/size_256/id_80975/GoogleInbox.png" />
//                       }
//                       mediaBackgroundStyle={{ backgroundColor: "red" }}
//                       style={{ backgroundColor: "blue" }}
//                       title="Ever wanted to be popular?"
//                       subtitle="Well just mix two colors and your are good to go!"
//                     />
//                     <Slide
//                       media={
//                         <img src="http://www.icons101.com/icon_png/size_256/id_76704/Google_Settings.png" />
//                       }
//                       mediaBackgroundStyle={{ backgroundColor: "red" }}
//                       style={{ backgroundColor: "blue" }}
//                       title="May the force be with you"
//                       subtitle="The Force is a metaphysical and ubiquitous power in the Star Wars fictional universe."
//                     />
//                   </AutoRotatingCarousel>
//                 </CardContent>
//               </Card>
//             </Grid>
//           </Grid>
//         </Grid>
//       </Grid>
//     </Grid>
//   </Grid>
// </React.Fragment>;
