import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasters } from "../../api/lookup-master";
import { useLookupItems } from "../../api/lookup";
import {
  Box,
  Button as MuiButton,
  Chip,
  FormControl as MuiFormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField as MuiTextField,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import * as Yup from "yup";
import { useFormik } from "formik";
import { saveLookupMasterItem } from "../../api/lookup-master-item";
import { Guid } from "../../utils/guid";

const TextField = styled(MuiTextField)(spacing);
const FormControl = styled(MuiFormControl)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  selectedLookupMaster: "",
  selectedLookupItem: [],
};

const ManageLookup = ({ handleClick }) => {
  const { data, isLoading, isError } = useQuery(
    ["getLookupMasters"],
    getLookupMasters
  );
  const {
    data: lookupItemsData,
    isLoading: isLoadingLookupItems,
    isError: isErrorLookupItems,
  } = useQuery(["lookupItems"], useLookupItems);
  const mutation = useMutation({ mutationFn: saveLookupMasterItem });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      selectedLookupMaster: Yup.string().required("Required"),
      selectedLookupItem: Yup.array().required("Required"),
    }),
    onSubmit: async (values) => {
      const lookupItems = values.selectedLookupItem;
      for (const lookupItem of lookupItems) {
        const newLookupMasterItem = {
          id: new Guid().toString(),
          createDate: new Date(),
          lookupMasterId: values.selectedLookupMaster,
          lookupItemId: lookupItem.id,
        };
        await mutation.mutateAsync(newLookupMasterItem);
      }
      handleClick();
    },
  });

  const handleAttributeTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue("selectedLookupItem", value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={6}>
        <Grid item md={6}>
          <TextField
            name="selectedLookupMaster"
            label="Select Lookup Master"
            select
            value={formik.values.selectedLookupMaster}
            error={Boolean(
              formik.touched.selectedLookupMaster &&
                formik.errors.selectedLookupMaster
            )}
            fullWidth
            helperText={
              formik.touched.selectedLookupMaster &&
              formik.errors.selectedLookupMaster
            }
            onBlur={formik.handleBlur}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            variant="outlined"
            my={2}
          >
            <MenuItem disabled value="">
              Select Lookup Master
            </MenuItem>
            {!isLoading && !isError
              ? data.data.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))
              : []}
          </TextField>
        </Grid>
        <Grid item md={6}>
          <FormControl fullWidth my={2} variant="outlined">
            <InputLabel id="selectedLookupItem">
              Select Lookup Item(Select Multiple)
            </InputLabel>
            <Select
              labelId="selectedLookupItem"
              id="selectedLookupItem"
              multiple
              value={formik.values.selectedLookupItem}
              onChange={(e) => {
                formik.handleChange(e);
                handleAttributeTypeChange(e);
              }}
              input={
                <OutlinedInput id="select-multiple-chip" label="Lookup Item" />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value.id} label={value.name} />
                  ))}
                </Box>
              )}
            >
              <MenuItem disabled value="">
                Select Lookup Item(Select Multiple)
              </MenuItem>
              {!isLoadingLookupItems && !isErrorLookupItems
                ? lookupItemsData.data.map((option) => (
                    <MenuItem key={option.id} value={option}>
                      {option.name}
                    </MenuItem>
                  ))
                : []}
            </Select>
          </FormControl>
        </Grid>
        <Grid item md={6}>
          <Button type="submit" variant="contained" color="primary" mt={3}>
            Save changes
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default ManageLookup;
