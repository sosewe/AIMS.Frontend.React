import React from "react";
import { Grid, TextField as MuiTextField } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";

const TextField = styled(MuiTextField)(spacing);

const ResultChainIndicatorField = ({ resultChainIndicator, register }) => {
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item md={12}>
          <TextField
            name={resultChainIndicator.id}
            fullWidth
            {...register(resultChainIndicator.id)}
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
