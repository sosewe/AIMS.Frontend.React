import React from "react";
import { TableContainer, Paper, Grid } from "@mui/material";

import LocationTable from "./LocationTable";

const GroupedTable = ({
  DCAResults,
  processLevelItemId,
  implementationYearId,
}) => {
  // Group the data by location
  const groupedData = DCAResults.reduce((acc, curr) => {
    if (!acc[curr.location]) {
      acc[curr.location] = [];
    }
    acc[curr.location].push(curr);
    return acc;
  }, {});

  return (
    <React.Fragment>
      {Object.keys(groupedData).map((location, index) => (
        <Grid container spacing={6} my={5} key={index}>
          <Grid item md={12}>
            <TableContainer component={Paper}>
              <LocationTable
                locationData={groupedData[location]}
                processLevelItemId={processLevelItemId}
                implementationYearId={implementationYearId}
              />
            </TableContainer>
          </Grid>
        </Grid>
      ))}
    </React.Fragment>
  );
};

export default GroupedTable;
