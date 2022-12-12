import React from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Delete as DeleteIcon } from "@mui/icons-material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";
import { getAdministrativeUnitTopLevel } from "../../../api/administrative-unit";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const getFocusInitial = {
  selectedCountry: "",
  firstLevel: "",
  secondLevel: "",
  thirdLevel: "",
  fourthLevel: "",
};

const GeoFocus = ({ id }) => {
  console.log(id);
  const formik = useFormik({
    initialValues: getFocusInitial,
    validationSchema: Yup.object().shape({
      selectedCountry: Yup.string().required("Required"),
      firstLevel: Yup.string().required("Required"),
      secondLevel: Yup.string().required("Required"),
      thirdLevel: Yup.string().required("Required"),
      fourthLevel: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      } finally {
        resetForm();
        setSubmitting(false);
      }
    },
  });
  const { data, isLoading, isError } = useQuery(
    ["topLevelAdminUnit"],
    getAdministrativeUnitTopLevel,
    {
      refetchOnWindowFocus: false,
    }
  );
  let staffDetailsArray = [];

  function removeStaff(row) {}

  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={12}>
            <Typography variant="h3" gutterBottom display="inline">
              Project Locations
            </Typography>
          </Grid>
          <Grid item md={12}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Administrative Unit</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {staffDetailsArray.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.staffDetailsName}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => removeStaff(row)}
                        >
                          <DeleteIcon />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item md={12}>
            <form onSubmit={formik.handleSubmit}>
              <Grid item md={2}>
                <TextField
                  name="selectedCountry"
                  label="Select Country"
                  select
                  value={formik.values.selectedCountry}
                  error={Boolean(
                    formik.touched.selectedCountry &&
                      formik.errors.selectedCountry
                  )}
                  fullWidth
                  helperText={
                    formik.touched.selectedCountry &&
                    formik.errors.selectedCountry
                  }
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Select Country
                  </MenuItem>
                  {!isLoading && !isError && data.data && data.data.length > 0
                    ? data.data.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.parent}
                        </MenuItem>
                      ))
                    : []}
                </TextField>
              </Grid>
              <Grid item md={2}></Grid>
              <Grid item md={2}></Grid>
              <Grid item md={2}></Grid>
              <Grid item md={2}></Grid>
            </form>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default GeoFocus;
