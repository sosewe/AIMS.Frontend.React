import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  Typography,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Box,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
} from "@mui/material";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import CancelIcon from "@mui/icons-material/Cancel";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import {
  newAdvocacyProgressUpdate,
  getAdvocacyProgressUpdateByProgressId,
} from "../../../../api/advocacy-progress";
import { newAdvocacyPartner } from "../../../../api/advocacy-partner";
import { newAdvocacyContribution } from "../../../../api/advocacy-contribution";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  implementationYearId: "",
  quarterId: "",
  ragStatusId: "",
  progress: "",
  actualChangeInStatusId: "",
  actorsInvolved: [],
  amrefContribution: [],
};

const AdvocacyUpdateForm = ({ id, editId }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const {
    data: AdvocacyUpdateData,
    isLoading: isLoadingAdvocacyUpdateData,
    isError: isErrorAdvocacyUpdateData,
  } = useQuery(
    ["getAdvocacyProgressUpdateByProgressId", editId],
    getAdvocacyProgressUpdateByProgressId,
    {
      enabled: !!editId,
    }
  );

  const { isLoading: isLoadingYears, data: yearsData } = useQuery(
    ["years", "Years"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingQuarters, data: quartersData } = useQuery(
    ["quarters", "quarters"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingStatuses, data: statusesData } = useQuery(
    ["status", "Status"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingStatusChange, data: statusChangeData } = useQuery(
    ["statuschange", "StatusChange"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingAmrefContribution, data: amrefContributionData } =
    useQuery(
      ["amrefcontribution", "AmrefContribution"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: isLoadingPartner, data: partnerData } = useQuery(
    ["partnerType", "PartnerType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { isLoading: isLoadingBragStatuses, data: bragStatusesData } = useQuery(
    ["bragstatus", "bragStatus"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const mutation = useMutation({ mutationFn: newAdvocacyProgressUpdate });
  const mutationPartner = useMutation({ mutationFn: newAdvocacyPartner });
  const mutationContribution = useMutation({
    mutationFn: newAdvocacyContribution,
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      implementationYearId: Yup.object().required("Required"),
      quarterId: Yup.object().required("Required"),
      ragStatusId: Yup.object().required("Required"),
      progress: Yup.string().required("Required"),
      actualChangeInStatusId: Yup.string().required("Required"),
      amrefContribution: Yup.array().required("Required"),
      actorsInvolved: Yup.array().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveAdvocacyUpdate = {
          id: editId ? editId : new Guid(),
          createDate: new Date(),
          implementationYearId: values.implementationYearId.lookupItemId,
          implementationYear: values.implementationYearId.lookupItemName,
          quarterId: values.quarterId.lookupItemId,
          quarter: values.quarterId.lookupItemName,
          ragStatusId: values.ragStatusId.lookupItemId,
          ragStatus: values.ragStatusId.lookupItemName,
          progress: values.progress,
          actualChangeInStatusId: values.actualChangeInStatusId,
          advocacyId: id,
        };
        const advocacyUpdate = await mutation.mutateAsync(saveAdvocacyUpdate);

        let amrefContributions = [];
        for (const contribution of values.amrefContribution) {
          const advocacyContribution = {
            contributionId: contribution.id,
            advocacyId: id,
            advocacyProgressUpdateId: advocacyUpdate.data.id,
            createDate: new Date(),
          };
          amrefContributions.push(advocacyContribution);
        }
        await mutationContribution.mutateAsync(amrefContributions);

        let actorsInvolved = [];
        for (const actor of values.actorsInvolved) {
          const advocacyPartner = {
            actorId: actor.id,
            advocacyId: id,
            advocacyProgressUpdateId: advocacyUpdate.data.id,
            createDate: new Date(),
          };
          actorsInvolved.push(advocacyPartner);
        }
        await mutationPartner.mutateAsync(actorsInvolved);

        toast("Successfully Created an Advocacy Update", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getAdvocacyProgressUpdateByProgressId",
        ]);

        navigate(`/project/monitoring/advocacy-monitoring-detail/${id}`);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingAdvocacyUpdateData &&
        !isErrorAdvocacyUpdateData &&
        AdvocacyUpdateData &&
        AdvocacyUpdateData.data
      ) {
        let monitoringYear;
        if (!isLoadingYears) {
          monitoringYear = yearsData.data.find(
            (obj) =>
              obj.lookupItemId === AdvocacyUpdateData.data.implementationYearId
          );
        }

        let monitoringQuarter;
        if (!isLoadingQuarters) {
          monitoringQuarter = quartersData.data.find(
            (obj) => obj.lookupItemId === AdvocacyUpdateData.data.quarterId
          );
        }

        let monitoringRAGStatusId;
        if (!isLoadingBragStatuses) {
          monitoringRAGStatusId = bragStatusesData.data.find(
            (obj) => obj.lookupItemId === AdvocacyUpdateData.data.ragStatusId
          );
        }

        let contributionsList = [];
        if (!isLoadingAmrefContribution) {
          for (const contribution of AdvocacyUpdateData.data.contributions) {
            const result = amrefContributionData.data.find(
              (obj) => obj.id === contribution.contributionId
            );
            if (result) {
              contributionsList.push(result);
            }
          }
        }

        let partnersList = [];
        if (!isLoadingPartner) {
          for (const partner of AdvocacyUpdateData.data.partners) {
            const result = partnerData.data.find(
              (obj) => obj.id === partner.actorId
            );
            if (result) {
              partnersList.push(result);
            }
          }
        }

        formik.setValues({
          implementationYearId: monitoringYear ? monitoringYear : "",
          quarterId: monitoringQuarter ? monitoringQuarter : "",
          ragStatusId: monitoringRAGStatusId ? monitoringRAGStatusId : "",
          actualChangeInStatusId:
            AdvocacyUpdateData.data.actualChangeInStatusId,
          amrefContribution: contributionsList,
          actorsInvolved: partnersList,
          progress: AdvocacyUpdateData.data.progress,
        });
      }
    }
    setCurrentFormValues();
  }, [
    isLoadingQuarters,
    isLoadingYears,
    isLoadingBragStatuses,
    isErrorAdvocacyUpdateData,
    isLoadingAdvocacyUpdateData,
    AdvocacyUpdateData,
  ]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid item md={6}>
            <TextField
              name="implementationYearId"
              label="Implimentation Year"
              select
              value={formik.values.implementationYearId}
              error={Boolean(
                formik.touched.implementationYearId &&
                  formik.errors.implementationYearId
              )}
              fullWidth
              helperText={
                formik.touched.implementationYearId &&
                formik.errors.implementationYearId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Implimentation Year
              </MenuItem>
              {!isLoadingYears
                ? yearsData.data.map((option) => (
                    <MenuItem key={option.lookupItemId} value={option}>
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="quarterId"
              label="Quarter"
              select
              value={formik.values.quarterId}
              error={Boolean(
                formik.touched.quarterId && formik.errors.quarterId
              )}
              fullWidth
              helperText={formik.touched.quarterId && formik.errors.quarterId}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select Quarter
              </MenuItem>
              {!isLoadingQuarters
                ? quartersData.data.map((option) => (
                    <MenuItem key={option.lookupItemId} value={option}>
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={6}>
            <TextField
              name="actualChangeInStatusId"
              label="Actual Change in Status of Advocacy/Policy"
              select
              value={formik.values.actualChangeInStatusId}
              error={Boolean(
                formik.touched.actualChangeInStatusId &&
                  formik.errors.actualChangeInStatusId
              )}
              fullWidth
              helperText={
                formik.touched.actualChangeInStatusId &&
                formik.errors.actualChangeInStatusId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select
              </MenuItem>
              {!isLoadingStatusChange
                ? statusChangeData.data.map((option) => (
                    <MenuItem
                      key={option.lookupItemId}
                      value={option.lookupItemId}
                    >
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>

          <Grid item md={6}>
            <TextField
              name="ragStatusId"
              label="Brag Status"
              select
              value={formik.values.ragStatusId}
              error={Boolean(
                formik.touched.ragStatusId && formik.errors.ragStatusId
              )}
              fullWidth
              helperText={
                formik.touched.ragStatusId && formik.errors.ragStatusId
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Status
              </MenuItem>
              {!isLoadingBragStatuses
                ? bragStatusesData.data.map((option) => (
                    <MenuItem key={option.lookupItemId} value={option}>
                      {option.lookupItemName}
                    </MenuItem>
                  ))
                : []}
            </TextField>
          </Grid>
          <Grid item md={12}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Amref Contribution</InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.amrefContribution}
                onChange={(e) => {
                  const selectedAmrefContribution = Array.isArray(
                    e.target.value
                  )
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue(
                    "amrefContribution",
                    selectedAmrefContribution
                  );
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.lookupItemId}
                        label={value.lookupItemName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "amrefContribution",
                            formik.values.amrefContribution.filter(
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
                my={2}
              >
                {!isLoadingAmrefContribution
                  ? amrefContributionData.data.map((option) => (
                      <MenuItem key={option.lookupItemId} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </Grid>
          <Grid item md={12}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel>Actors Involved</InputLabel>
              <Select
                fullWidth
                multiple
                value={formik.values.actorsInvolved}
                onChange={(e) => {
                  const selectedActorsInvolved = Array.isArray(e.target.value)
                    ? e.target.value
                    : [e.target.value]; // Ensure it's always an array
                  formik.setFieldValue(
                    "actorsInvolved",
                    selectedActorsInvolved
                  );
                }}
                input={<OutlinedInput label="Multiple Select" />}
                renderValue={(selected) => (
                  <Stack gap={1} direction="row" flexWrap="wrap">
                    {selected.map((value) => (
                      <Chip
                        key={value.lookupItemId}
                        label={value.lookupItemName}
                        onDelete={() =>
                          formik.setFieldValue(
                            "actorsInvolved",
                            formik.values.actorsInvolved.filter(
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
                my={2}
              >
                {!isLoadingPartner
                  ? partnerData.data.map((option) => (
                      <MenuItem key={option.lookupItemId} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </Select>
            </FormControl>
          </Grid>

          <Grid item md={12}>
            <TextField
              name="progress"
              label="Additional description of policy/advocacy progress"
              value={formik.values.progress}
              error={Boolean(formik.touched.progress && formik.errors.progress)}
              fullWidth
              helperText={formik.touched.progress && formik.errors.progress}
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
              rows={3}
            />
          </Grid>

          <Grid item md={12}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </Grid>
        </Grid>
      )}
    </form>
  );
};

const AdvocacyUpdate = () => {
  let { id, editId } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Advocacy Update" />
      <Typography variant="h3" gutterBottom display="inline">
        Advocacy Update
      </Typography>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <AdvocacyUpdateForm id={id} editId={editId} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default AdvocacyUpdate;
