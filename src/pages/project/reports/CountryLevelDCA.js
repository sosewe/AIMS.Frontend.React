import React, { useState } from "react";
import { Paper, Table, TableCell, TableHead, TableRow } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";

const CountryLevelDCA = () => {
  return (
    <React.Fragment>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="grouped table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Amref Office
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Administrative programme
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Project
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Location
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Original Child
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Original Youth
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Original Adults
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Original Total
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Adjusted Child
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Adjusted Youth
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Adjusted Adult
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Adjusted Total
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Project Final Child
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Project Final Youth
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Project Final Adult
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Project Final Total
              </TableCell>
              <TableCell sx={{ border: "1px solid #000", textAlign: "center" }}>
                Project Comments
              </TableCell>
            </TableRow>
          </TableHead>
        </Table>
      </TableContainer>
    </React.Fragment>
  );
};
export default CountryLevelDCA;
