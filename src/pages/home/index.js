import React from "react";
import { Helmet } from "react-helmet-async";
import { Grid } from "@mui/material";

const Home = () => {
  return (
    <React.Fragment>
      <Helmet title="Home" />
      <Grid
        container
        justifyContent="center"
        spacing={1}
        alignItems="stretch"
        sx={{ minHeight: "800px" }}
      >
        <Grid item md={12} zeroMinWidth>
          <iframe
            title="Project Summary"
            width="100%"
            height="100%"
            src="https://qlik.amref.org:8443/single/?appid=dcc2ed8b-67c4-472a-acac-7f6a0128559c&sheet=6931ed03-c2d1-4ea6-aa74-1b801a0aa2f8&theme=breeze&opt=ctxmenu&select=clearall"
            frameBorder="0"
            allowFullScreen={true}
          ></iframe>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Home;
