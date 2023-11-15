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
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, Trash as TrashIcon } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {};

const KMDocumentsUploadForm = ({ id }) => {
  const MAX_COUNT = 5;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { isLoading: isLoadingDocumentCategory, data: documentCategoryData } =
    useQuery(["currencyType", "CurrencyType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const { isLoading: isLoadingDocumentAccess, data: documentAccessData } =
    useQuery(["currencyType", "CurrencyType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const { isLoading: isLoadingCalendarYear, data: calendarYearData } = useQuery(
    ["currencyType", "CurrencyType"],
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

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const guid = new Guid();
        const saveInnovationUpdate = {};

        toast("Successfully Updated an Innovation", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getInnovations"]);
        navigate(`/project/design/innovation/innovation-detail/${id}`);
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
          <Grid item md={6}>
            <TextField
              name="documentInitials"
              label="Document Initials"
              value={formik.values.documentInitials}
              error={Boolean(
                formik.touched.documentInitials &&
                  formik.errors.documentInitials
              )}
              fullWidth
              helperText={
                formik.touched.documentInitials &&
                formik.errors.documentInitials
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              name="documentName"
              label="Document Name"
              value={formik.values.documentName}
              error={Boolean(
                formik.touched.documentName && formik.errors.documentName
              )}
              fullWidth
              helperText={
                formik.touched.documentName && formik.errors.documentName
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
            />
          </Grid>
          <Grid item md={12}>
            <TextField
              name="documentDescription"
              label="Document Description"
              value={formik.values.documentDescription}
              error={Boolean(
                formik.touched.documentDescription &&
                  formik.errors.documentDescription
              )}
              fullWidth
              helperText={
                formik.touched.documentDescription &&
                formik.errors.documentDescription
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              multiline
              variant="outlined"
              my={2}
              rows={3}
            />
          </Grid>
          <Grid item md={6}>
            <TextField
              name="documentCategory"
              label="Document Category"
              select
              value={formik.values.documentCategory}
              error={Boolean(
                formik.touched.documentCategory &&
                  formik.errors.documentCategory
              )}
              fullWidth
              helperText={
                formik.touched.documentCategory &&
                formik.errors.documentCategory
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select
              </MenuItem>
              {!isLoadingDocumentCategory
                ? documentCategoryData.data.map((option) => (
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
              name="documentAccess"
              label="Document Accesss"
              select
              value={formik.values.documentAccess}
              error={Boolean(
                formik.touched.documentAccess && formik.errors.documentAccess
              )}
              fullWidth
              helperText={
                formik.touched.documentAccess && formik.errors.documentAccess
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select
              </MenuItem>
              {!isLoadingDocumentAccess
                ? documentAccessData.data.map((option) => (
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
          <Grid item md={12}>
            <TextField
              name="documentYear"
              label="Document Year"
              select
              value={formik.values.documentYear}
              error={Boolean(
                formik.touched.documentYear && formik.errors.documentYear
              )}
              fullWidth
              helperText={
                formik.touched.documentYear && formik.errors.documentYear
              }
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              variant="outlined"
              my={2}
            >
              <MenuItem disabled value="">
                Select
              </MenuItem>
              {!isLoadingCalendarYear
                ? calendarYearData.data.map((option) => (
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

const KMDocumentsUpload = () => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        <Grid item md={12}>
          KM Documents Upload
        </Grid>
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link>Project Monitoring</Link>
        <Typography>KM Documents Upload</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <KMDocumentsUploadForm id={id} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default KMDocumentsUpload;
