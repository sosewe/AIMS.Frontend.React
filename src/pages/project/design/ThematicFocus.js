import React from "react";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  // Dialog,
  // DialogActions,
  // DialogContent,
  // DialogContentText,
  // DialogTitle,
  Grid,
  MenuItem,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
// import { DataGrid } from "@mui/x-data-grid";
import styled from "@emotion/styled";
import { useQuery } from "@tanstack/react-query";
import { getAllThematicAreas } from "../../../api/thematic-area";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
  thematicArea: "",
  friends: [],
};

const ThematicFocus = ({ id, processLevelTypeId }) => {
  const { data, isLoading } = useQuery(
    ["getAllThematicAreas"],
    getAllThematicAreas,
    {
      refetchOnWindowFocus: false,
    }
  );
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      thematicArea: Yup.object().required("Required"),
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

  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={12}>
            <Typography variant="h3" gutterBottom display="inline">
              Thematic Focus
            </Typography>
          </Grid>
          <Grid item md={12}>
            <CardContent pb={1}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container item spacing={2}>
                  <Grid item md={4}>
                    <TextField
                      name="thematicArea"
                      label="Thematic Area"
                      required
                      select
                      value={formik.values.thematicArea}
                      error={Boolean(
                        formik.touched.thematicArea &&
                          formik.errors.thematicArea
                      )}
                      fullWidth
                      helperText={
                        formik.touched.thematicArea &&
                        formik.errors.thematicArea
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      variant="outlined"
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select Thematic Area
                      </MenuItem>
                      {!isLoading
                        ? data.data.map((option) => (
                            <MenuItem key={option.id} value={option}>
                              {option.name}
                            </MenuItem>
                          ))
                        : []}
                    </TextField>
                  </Grid>
                  <Grid item md={4}>
                    &nbsp;
                  </Grid>
                  <Grid item md={4}>
                    &nbsp;
                  </Grid>
                  <Grid item md={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <h3>
                          THEMATIC AREA:&nbsp;
                          <strong>
                            {formik.values.thematicArea
                              ? formik.values.thematicArea.name
                              : ""}
                          </strong>
                        </h3>
                        <Grid item md={12}></Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default ThematicFocus;
