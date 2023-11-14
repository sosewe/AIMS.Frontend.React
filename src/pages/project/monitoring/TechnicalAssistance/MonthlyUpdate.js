import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";

import {
  Box,
  CircularProgress,
  Grid,
  Link,
  Autocomplete as MuiAutocomplete,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  MenuItem,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import { spacing } from "@mui/system";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import { Check } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { getTechnicalAssistanceObjectiveByTechnicalAssistanceId } from "../../../../api/technical-assistance-objective";
import { Guid } from "../../../../utils/guid";

const Paper = styled(MuiPaper)(spacing);
const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  changeDescription: "",
};

const MonthlyUpdateForm = ({ id }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isLoadingObjectives, data: objectivesData } = useQuery(
    ["objectives"],
    getTechnicalAssistanceObjectiveByTechnicalAssistanceId,
    {
      refetchOnWindowFocus: false,
    }
  );

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const guid = new Guid();
        const saveMonthlyUpdate = {};

        toast("Successfully Updated an Innovation", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getTechnicalAssistanceObjectiveByTechnicalAssistanceId",
        ]);
        navigate(`/project/design/monitoring/monitoring-detail/${id}`);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {}, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid item md={12}>
            <TextField
              name="changeDescription"
              label="Describe the change for the period "
              value={formik.values.changeDescription}
              error={Boolean(
                formik.touched.changeDescription &&
                  formik.errors.changeDescription
              )}
              fullWidth
              helperText={
                formik.touched.changeDescription &&
                formik.errors.changeDescription
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mt={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Link to TA Objectives</InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.objectives}
                onChange={(e) => {
                  const selectedObjectives = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue("objectives", selectedObjectives);
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.id}
                        label={value.donorName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "objectives",
                            formik.values.objectives.filter(
                              (item) => item !== value
                            )
                          )
                        }
                        deleteIcon={
                          <CancelIcon
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        }
                      />
                    ))}
                  </Stack>
                )}
              >
                {[]}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={12} mt={2}>
            <TextField
              name="changeRelevance"
              label="Why do you think the change is relevant?"
              value={formik.values.changeRelevance}
              error={Boolean(
                formik.touched.changeRelevance && formik.errors.changeRelevance
              )}
              fullWidth
              helperText={
                formik.touched.changeRelevance && formik.errors.changeRelevance
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={6} mt={2}>
            <TextField
              name="changeLevelOfRelevance"
              label="Level of relevance"
              select
              value={formik.values.changeLevelOfRelevance}
              error={Boolean(
                formik.touched.changeLevelOfRelevance &&
                  formik.errors.changeLevelOfRelevance
              )}
              fullWidth
              helperText={
                formik.touched.changeLevelOfRelevance &&
                formik.errors.changeLevelOfRelevance
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Level of Relevance
              </MenuItem>
              {[]}
            </TextField>
          </Grid>

          <Grid item md={6} mt={2}>
            <TextField
              name="changeLevelOfContribution"
              label="Level of contribution to the change/result "
              select
              value={formik.values.changeLevelOfContribution}
              error={Boolean(
                formik.touched.changeLevelOfContribution &&
                  formik.errors.changeLevelOfContribution
              )}
              fullWidth
              helperText={
                formik.touched.changeLevelOfContribution &&
                formik.errors.changeLevelOfContribution
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Level of Contribution
              </MenuItem>
              {[]}
            </TextField>
          </Grid>

          <Grid item md={12}>
            <TextField
              name="titleOfChangeActors"
              label="Title/function of actors who contributed to change "
              value={formik.values.titleOfChangeActors}
              error={Boolean(
                formik.touched.titleOfChangeActors &&
                  formik.errors.titleOfChangeActors
              )}
              fullWidth
              helperText={
                formik.touched.titleOfChangeActors &&
                formik.errors.titleOfChangeActors
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={6} mt={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>
                Agency/department of the actors mentioned{" "}
              </InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.agencyOfChangeActors}
                onChange={(e) => {
                  const selectedAgencies = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue("objectives", selectedAgencies);
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.id}
                        label={value.donorName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "objectives",
                            formik.values.objectives.filter(
                              (item) => item !== value
                            )
                          )
                        }
                        deleteIcon={
                          <CancelIcon
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        }
                      />
                    ))}
                  </Stack>
                )}
              >
                {[]}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={6} mt={2}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Technical Assistance Modalities </InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.modalities}
                onChange={(e) => {
                  const selectedModalities = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue("modalities", selectedModalities);
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.id}
                        label={value.donorName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "modalities",
                            formik.values.modalities.filter(
                              (item) => item !== value
                            )
                          )
                        }
                        deleteIcon={
                          <CancelIcon
                            onMouseDown={(event) => event.stopPropagation()}
                          />
                        }
                      />
                    ))}
                  </Stack>
                )}
              >
                {[]}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={12} mt={2}>
            <TextField
              name="changeContribution"
              label="Contribution to the change "
              value={formik.values.changeContribution}
              error={Boolean(
                formik.touched.changeContribution &&
                  formik.errors.changeContribution
              )}
              fullWidth
              helperText={
                formik.touched.changeContribution &&
                formik.errors.changeContribution
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mt={2}>
            <TextField
              name="changeContributionOther"
              label="Other factor that contributed to the change"
              value={formik.values.changeContributionOther}
              error={Boolean(
                formik.touched.changeContributionOther &&
                  formik.errors.changeContributionOther
              )}
              fullWidth
              helperText={
                formik.touched.changeContributionOther &&
                formik.errors.changeContributionOther
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mt={2}>
            <TextField
              name="followUp"
              label="Follow up and sustainability"
              value={formik.values.followUp}
              error={Boolean(formik.touched.followUp && formik.errors.followUp)}
              fullWidth
              helperText={formik.touched.followUp && formik.errors.followUp}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              rows={3}
            />
          </Grid>

          <Grid item md={12} mt={2}>
            <Button variant="outlined" component="label">
              Attach evidence documents
              <input hidden accept="image/*" multiple type="file" />
            </Button>
          </Grid>

          <Grid item mt={5} md={12}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const MonthlyUpdate = () => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Monthly Update" />
      <Typography variant="h3" gutterBottom display="inline">
        Monthly Update
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link>Technical Assistance Monitoring</Link>
        <Typography>Monthly Update</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <MonthlyUpdateForm id={id} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default MonthlyUpdate;
