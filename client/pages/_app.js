import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Grid,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainAppContext from "../src/contexts/MainAppContext";
import theme from "../src/theme";

const MyApp = (props) => {
  const { Component, pageProps } = props;
  const isDesktop = useMediaQuery(() => theme.breakpoints.up("lg"), {
    defaultMatches: true,
  });

  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [showLoadingDialog, setShowLoadingDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  const closeAlertDialog = () => {
    setShowAlertDialog(false);
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setShowAlertDialog(true);
  };

  const showLoading = () => {
    setShowLoadingDialog(true);
  };

  const hideLoading = () => {
    setShowLoadingDialog(false);
  };

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        {/*todo: make zindex of this high enough to be able to click out of it if youre also in the middle of loading, also maybe center it inside the component (for sidebar stuff) */}
        {/*ALERT DIALOG*/}
        <Dialog
          open={showAlertDialog}
          onClose={closeAlertDialog}
          aria-labelledby="form-dialog-title"
          style={{
            left: isDesktop ? "13%" : "",
          }}
        >
          <DialogTitle id="form-dialog-title">Alert</DialogTitle>
          <DialogContent>
            <DialogContentText>{alertMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeAlertDialog} color="primary">
              Okay
            </Button>
          </DialogActions>
        </Dialog>
        {/*LOADING DIALOG (for component pages, not fullscreen)*/}
        <Dialog
          open={showLoadingDialog}
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
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="center"
            >
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
        <MainAppContext.Provider
          value={{
            showAlert: showAlert,
            showLoading: showLoading,
            hideLoading: hideLoading,
          }}
        >
          <Component {...pageProps} />
        </MainAppContext.Provider>
      </ThemeProvider>
    </React.Fragment>
  );
};

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
