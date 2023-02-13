import React from "react";
import { Grid, TextField as MuiTextField } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";

const TextField = styled(MuiTextField)(spacing);

const ResultChainIndicatorField = ({ resultChainIndicator, formik }) => {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <TextField
            name={resultChainIndicator.id}
            value={formik.values[resultChainIndicator.id] || ""}
            error={Boolean(
              formik.touched[resultChainIndicator.id] &&
                formik.errors[resultChainIndicator.id]
            )}
            fullWidth
            helperText={
              formik.touched[resultChainIndicator.id] &&
              formik.errors[resultChainIndicator.id]
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
            type="number"
            sx={{
              "& .MuiInputBase-input.Mui-disabled": {
                backgroundColor: "#e9ecef",
              },
            }}
          />
        </Grid>
      </Grid>
    </React.Fragment>
  );
};
export default ResultChainIndicatorField;
