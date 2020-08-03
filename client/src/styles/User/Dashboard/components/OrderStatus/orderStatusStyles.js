const orderStatusStyles = (theme) => ({
  root: {
    width: "100%",
    position: "relative",
  },
  infoCard: {
    width: 300,
    textAlign: "center",
  },
  layout: {
    marginLeft: "auto",
    marginRight: "auto",
    [theme.breakpoints.up(649)]: {
      width: 600,
    },
    [theme.breakpoints.down(650)]: {
      width: "90vw",
    },
  },
  gradient: {
    backgroundImage:
      "linear-gradient( 136deg, rgb(1, 201, 226) 15%, rgb(0, 153, 255) 50%, rgb(1, 201, 226) 100%)",
    color: "white",
  },
});

export default orderStatusStyles;
