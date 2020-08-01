import React from "react";
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
import theme from "../src/theme";

const MyApp = (props) => {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

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
        {/* <Dialog
          open={true}
          // onClose={this.toggleDialog}
          PaperProps={{
            style: {
              backgroundColor: "transparent",
              boxShadow: "none",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          container={() => document.getElementById("mainAppContainer")}
          style={{
            position: "absolute",
            zIndex: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <DialogContent>
            <CircularProgress size={50} thickness={5} />
          </DialogContent>
        </Dialog> */}
        <Component {...pageProps} />
      </ThemeProvider>
    </React.Fragment>
  );
};

MyApp.propTypes = {
  Component: PropTypes.func.isRequired,
  pageProps: PropTypes.object.isRequired,
};

export default MyApp;
