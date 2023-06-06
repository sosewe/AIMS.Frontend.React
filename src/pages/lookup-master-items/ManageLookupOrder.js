import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasters } from "../../api/lookup-master";
import { useLookupItems } from "../../api/lookup";
import {
  Button as MuiButton,
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
  selectedLookupItem: "",
  order: "",
};

const ManageLookupOrder = ({ handleClick }) => {
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
      selectedLookupItem: Yup.string().required("Required"),
      order: Yup.number(),
    }),
    onSubmit: async (values) => {
      const newLookupMasterItem = {
        id: new Guid().toString(),
        createDate: new Date(),
        lookupMasterId: values.selectedLookupMaster,
        lookupItemId: values.selectedLookupItem,
        order: values.order,
      };
      await mutation.mutateAsync(newLookupMasterItem);
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
        <Grid item md={3}>
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
        <Grid item md={3}>
          <TextField
            name="selectedLookupItem"
            label="selectedLookupItem"
            select
            required
            value={formik.values.selectedLookupItem}
            error={Boolean(
              formik.touched.selectedLookupItem &&
                formik.errors.selectedLookupItem
            )}
            fullWidth
            helperText={
              formik.touched.selectedLookupItem &&
              formik.errors.selectedLookupItem
            }
            onBlur={formik.handleBlur}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            variant="outlined"
            my={2}
          >
            <MenuItem disabled value="">
              Select Lookup Item
            </MenuItem>
            {!isLoadingLookupItems && !isErrorLookupItems
              ? lookupItemsData.data.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}
                  </MenuItem>
                ))
              : []}
          </TextField>
        </Grid>
        <Grid item md={3}>
          <TextField
            name="order"
            label="Order"
            required
            value={formik.values.order}
            error={Boolean(formik.touched.order && formik.errors.order)}
            fullWidth
            helperText={formik.touched.order && formik.errors.order}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          />
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
export default ManageLookupOrder;
