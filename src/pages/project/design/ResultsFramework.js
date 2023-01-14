import React from "react";
import { Grid, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

const ResultsFramework = ({ id, processLevelTypeId }) => {
  return (
    <Grid
      container
      direction="column"
      justifyContent="center"
      alignItems="center"
      spacing={12}
    >
      <Grid item>
        <NavLink
          to={`/project/enter-target-quantitative-results-framework/${id}/${processLevelTypeId}`}
        >
          <Typography variant="h1">Quantitative</Typography>
        </NavLink>
      </Grid>
      <Grid item>
        <NavLink to={``}>
          <Typography variant="h1">Qualitative</Typography>
        </NavLink>
      </Grid>
    </Grid>
  );
};
export default ResultsFramework;
