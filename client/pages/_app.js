import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { ThemeProvider } from "@material-ui/core/styles";
import PropTypes from "prop-types";
import Head from "next/head";
import CssBaseline from "@material-ui/core/CssBaseline";
import MainAppContext from "../src/contexts/MainAppContext";
import theme from "../src/theme";

const MyApp = (props) => {
  const { Component, pageProps } = props;
  const [showAlertDialog, setShowAlertDialog] = useState(false);
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
        {/*todo: make zindex of this high enough to be able to click out of it if youre also in the middle of loading */}
        <Dialog
          open={showAlertDialog}
          onClose={closeAlertDialog}
          aria-labelledby="form-dialog-title"
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
        <MainAppContext.Provider value={{ showAlert: showAlert }}>
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
