import React from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField as MuiTextField,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";

const TextField = styled(MuiTextField)(spacing);

const AttributeResponseOptionField = ({
  formik,
  attributeResponseOption,
  resultChainIndicator,
}) => {
  const option =
    attributeResponseOption.id + "/" + resultChainIndicator.id + "_check";
  const fields = [];
  fields[attributeResponseOption.id + "/" + resultChainIndicator.id] = true;
  const handleChange = (e) => {
    const nameSplit = e.target.name.split("_");
    if (e.target.checked) {
      formik.setFieldValue(nameSplit[0], 1234);
      fields[
        attributeResponseOption.id + "/" + resultChainIndicator.id
      ] = false;
    } else {
      fields[attributeResponseOption.id + "/" + resultChainIndicator.id] = true;
    }
  };
  console.log(formik.values);
  return (
    <React.Fragment>
      <Grid container spacing={2}>
        <Grid item md={6}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values[`${option}`]}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleChange(e);
                  }}
                  name={
                    attributeResponseOption.id +
                    "/" +
                    resultChainIndicator.id +
                    "_check"
                  }
                />
              }
              label={attributeResponseOption.responseOption}
            />
          </FormGroup>
        </Grid>
        <Grid item md={6}>
          <TextField
            name={attributeResponseOption.id + "/" + resultChainIndicator.id}
            value={
              formik.values[
                attributeResponseOption.id + "/" + resultChainIndicator.id
              ] || ""
            }
            error={Boolean(
              formik.touched[
                attributeResponseOption.id + "/" + resultChainIndicator.id
              ] &&
                formik.errors[
                  attributeResponseOption.id + "/" + resultChainIndicator.id
                ]
            )}
            fullWidth
            helperText={
              formik.touched[
                attributeResponseOption.id + "/" + resultChainIndicator.id
              ] &&
              formik.errors[
                attributeResponseOption.id + "/" + resultChainIndicator.id
              ]
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
            type="number"
            disabled={
              fields[attributeResponseOption.id + "/" + resultChainIndicator.id]
            }
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
export default AttributeResponseOptionField;
