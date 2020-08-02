import React from "react";
import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  withWidth,
  useMediaQuery,
  useTheme,
  Grid,
} from "@material-ui/core";

//one with logo/gif/whatecver, one with only circle?

const Loading = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"), {
    defaultMatches: true,
  });

  return (
    <Dialog
      open={true}
      // onClose={this.toggleDialog}
      PaperProps={{
        style: {
          // backgroundColor: "transparent",
          boxShadow: "none",
          justifyContent: "center",
          alignItems: "center",
          position: "fixed",
          // top: "50%",
          left: isDesktop ? "52%" : "",
        },
      }}
      style={{
        zIndex: 1,
      }}
    >
      <DialogContent>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <Typography gutterBottom>Loading...</Typography>
          </Grid>
          <Grid item>
            <CircularProgress
              size={50}
              thickness={5}
              style={{ color: "rgb(1, 201, 226)" }}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default Loading;
