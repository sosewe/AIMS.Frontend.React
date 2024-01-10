import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { display, spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, Trash as TrashIcon } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import {
  newInnovationMonitoringScaleUp,
  getInnovationMonitoringScaleUpByInnovationId,
  deleteInnovationMonitoringScaleUp,
} from "../../../../api/innovation-monitoring-scaleup";
import { getLookupMasterItemsByName } from "../../../../api/lookup";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {
  newCountriesScaledUp: "",
  newRegionsWithinCountries: "",
  newTargetGroups: "",
  newProportionScaledUp: "",
  innovationClosingStatus: "",
  innovationClosingReason: "",
};

const ScaleUpForm = ({ id }) => {
  const MAX_COUNT = 5;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: ScaleUpData,
    isLoading: isLoadingScaleUpData,
    isError: isErrorScaleUpData,
  } = useQuery(
    ["getInnovationMonitoringScaleUpByInnovationId", id],
    getInnovationMonitoringScaleUpByInnovationId,
    { enabled: !!id }
  );

  const {
    isLoading: isLoadingInnovationClosingStatus,
    data: InnovationClosingStatusData,
  } = useQuery(
    ["innovationClosingStatus", "InnovationClosingStatus"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const {
    isLoading: isLoadingInnovationClosingReasons,
    data: innovationClosingReasonsData,
  } = useQuery(
    ["innovationClosingReasons", "InnovationClosingReasons"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );

  const handleUploadFiles = (files) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file) => {
      if (uploaded.findIndex((f) => f.name === file.name) === -1) {
        uploaded.push(file);
        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(`You can only add a maximum of ${MAX_COUNT} files`);
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) setUploadedFiles(uploaded);
  };

  const handleFileEvent = (e) => {
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    if (status === "4803db33-d778-4530-5172-08dc11e4499b") {
      setIsOpen(true);
    }

    if (status === "1d2c305f-1f20-426a-5171-08dc11e4499b") {
      setIsOpen(false);
    }
  };

  const mutation = useMutation({
    mutationFn: newInnovationMonitoringScaleUp,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      newCountriesScaledUp: Yup.number().required("Required"),
      newRegionsWithinCountries: Yup.number().required("Required"),
      newTargetGroups: Yup.number().required("Required"),
      newProportionScaledUp: Yup.number().required("Required"),
      innovationClosingStatus: Yup.string().required("Required"),
      innovationClosingReason: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const saveScaleUp = {
          id: id ? id : new Guid().toString(),
          createDate: new Date(),
          innovationId: id,
          newCountriesScaledUp: values.newCountriesScaledUp,
          newRegionsWithinCountries: values.newRegionsWithinCountries,
          newTargetGroups: values.newTargetGroups,
          newProportionScaledUp: values.newProportionScaledUp,
          innovationClosingStatus: values.innovationClosingStatus,
          innovationClosingReason: values.innovationClosingReason,
        };
        await mutation.mutateAsync(saveScaleUp);

        toast("Successfully Updated Scale Up", {
          type: "success",
        });
        await queryClient.invalidateQueries([
          "getInnovationMonitoringScaleUpByInnovationId",
        ]);
        navigate(`/project/monitoring/innovation-monitoring-detail/${id}`);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (
        !isLoadingInnovationClosingReasons &&
        !isLoadingInnovationClosingStatus &&
        !isLoadingScaleUpData
      ) {
        formik.setValues({
          innovationId: id,
          newCountriesScaledUp: ScaleUpData.data.newCountriesScaledUp,
          newRegionsWithinCountries: ScaleUpData.data.newRegionsWithinCountries,
          newTargetGroups: ScaleUpData.data.newTargetGroups,
          newProportionScaledUp: ScaleUpData.data.newProportionScaledUp,
          innovationClosingStatus: ScaleUpData.data.innovationClosingStatus,
          innovationClosingReason: ScaleUpData.data.innovationClosingReason,
        });
      }
    }
    setCurrentFormValues();
  }, [
    isLoadingInnovationClosingReasons,
    isLoadingInnovationClosingStatus,
    isLoadingScaleUpData,
    ScaleUpData,
  ]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid container spacing={3}>
            <Grid item md={6}>
              <TextField
                name="newCountriesScaledUp"
                label="New countries scaled up to "
                value={formik.values.newCountriesScaledUp}
                type="number"
                error={Boolean(
                  formik.touched.newCountriesScaledUp &&
                    formik.errors.newCountriesScaledUp
                )}
                fullWidth
                helperText={
                  formik.touched.newCountriesScaledUp &&
                  formik.errors.newCountriesScaledUp
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              />
            </Grid>

            <Grid item md={6}>
              <TextField
                name="newRegionsWithinCountries"
                label="Number of new regions within countries"
                value={formik.values.newRegionsWithinCountries}
                type="number"
                error={Boolean(
                  formik.touched.newRegionsWithinCountries &&
                    formik.errors.newRegionsWithinCountries
                )}
                fullWidth
                helperText={
                  formik.touched.newRegionsWithinCountries &&
                  formik.errors.newRegionsWithinCountries
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              />
            </Grid>

            <Grid item md={6}>
              <TextField
                name="newTargetGroups"
                label="Number of new target groups "
                value={formik.values.newTargetGroups}
                type="number"
                error={Boolean(
                  formik.touched.newTargetGroups &&
                    formik.errors.newTargetGroups
                )}
                fullWidth
                helperText={
                  formik.touched.newTargetGroups &&
                  formik.errors.newTargetGroups
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                rows={3}
              />
            </Grid>

            <Grid item md={6}>
              <TextField
                name="newProportionScaledUp"
                label="Proportion of users where Innovation has been Scaled up"
                value={formik.values.newProportionScaledUp}
                type="number"
                error={Boolean(
                  formik.touched.newProportionScaledUp &&
                    formik.errors.newProportionScaledUp
                )}
                fullWidth
                helperText={
                  formik.touched.newProportionScaledUp &&
                  formik.errors.newProportionScaledUp
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              />
            </Grid>

            <Grid item md={12}>
              <TextField
                name="innovationClosingStatus"
                label="What is the closing status of this innovation?"
                select
                value={formik.values.innovationClosingStatus}
                error={Boolean(
                  formik.touched.innovationClosingStatus &&
                    formik.errors.innovationClosingStatus
                )}
                fullWidth
                helperText={
                  formik.touched.innovationClosingStatus &&
                  formik.errors.innovationClosingStatus
                }
                onBlur={formik.handleBlur}
                //onChange={formik.handleChange}
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("innovationClosingReason", "");
                  handleStatusChange(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select
                </MenuItem>
                {!isLoadingInnovationClosingStatus
                  ? InnovationClosingStatusData.data.map((option) => (
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

            {isOpen ? (
              <Grid item md={12}>
                <TextField
                  name="innovationClosingReason"
                  label="Reason for not continuing"
                  select
                  value={formik.values.innovationClosingReason}
                  error={Boolean(
                    formik.touched.innovationClosingReason &&
                      formik.errors.innovationClosingReason
                  )}
                  fullWidth
                  helperText={
                    formik.touched.innovationClosingReason &&
                    formik.errors.innovationClosingReason
                  }
                  onBlur={formik.handleBlur}
                  onChange={formik.handleChange}
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Select
                  </MenuItem>
                  {!isLoadingInnovationClosingReasons
                    ? innovationClosingReasonsData.data.map((option) => (
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
            ) : (
              <></>
            )}

            <Grid item md={12}>
              <Button variant="outlined" component="label">
                Attach Documents
                <input
                  hidden
                  accept="application/pdf, image/png"
                  multiple
                  type="file"
                  onChange={handleFileEvent}
                  disabled={fileLimit}
                />
              </Button>
            </Grid>
            <Grid item md={12}>
              <InputLabel>
                <div className="uploaded-files-list">
                  {uploadedFiles.map((file) => (
                    <div>{file.name}</div>
                  ))}
                </div>
              </InputLabel>
            </Grid>
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

const ScaleUp = () => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Scale Up
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link>Project Monitoring</Link>
        <Typography>Scale Up</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <ScaleUpForm id={id} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ScaleUp;
