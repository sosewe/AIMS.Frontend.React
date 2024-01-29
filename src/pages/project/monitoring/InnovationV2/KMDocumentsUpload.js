import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, Trash as TrashIcon, Eye as ViewIcon } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";
import { getLookupMasterItemsByName } from "../../../../api/lookup";
import {
  newInnovationMonitoringUpdateDocument,
  getInnovationMonitoringUpdateDocumentByInnovationId,
  deleteInnovationMonitoringUpdateDocument,
} from "../../../../api/innovation-monitoring-document";
import { SHARED_DIRECTORY } from "../../../../constants";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {};

const DocumentDetailsForm = ({ handleClick }) => {
  const MAX_COUNT = 5;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);

  const { isLoading: isLoadingDocumentCategory, data: documentCategoryData } =
    useQuery(
      ["documentCategoryType", "DocumentCategoryType"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: isLoadingDocumentAccess, data: documentAccessData } =
    useQuery(
      ["documentAccessType", "DocumentAccessType"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  const { isLoading: isLoadingCalendarYear, data: calendarYearData } = useQuery(
    ["years", "Years"],

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

  const initialDocumentValues = {
    documentInitials: "",
    documentName: "",
    documentDescription: "",
    documentCategoryId: "",
    documentAccessId: "",
    documentYearId: "",
    documentUrl: "",
  };

  const formik = useFormik({
    initialValues: initialDocumentValues,
    validationSchema: Yup.object().shape({
      documentInitials: Yup.string().required("Required"),
      documentName: Yup.string().required("Required"),
      documentDescription: Yup.string().required("Required"),
      documentCategoryId: Yup.string().required("Required"),
      documentAccessId: Yup.string().required("Required"),
      documentYearId: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleClick(values);
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
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item md={12}>
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
            <Grid item md={12}>
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
            <Grid item md={12}>
              <TextField
                name="documentCategoryId"
                label="Document Category"
                select
                value={formik.values.documentCategoryId}
                error={Boolean(
                  formik.touched.documentCategoryId &&
                    formik.errors.documentCategoryId
                )}
                fullWidth
                helperText={
                  formik.touched.documentCategoryId &&
                  formik.errors.documentCategoryId
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
            <Grid item md={12}>
              <TextField
                name="documentAccessId"
                label="Document Accesss"
                select
                value={formik.values.documentAccessId}
                error={Boolean(
                  formik.touched.documentAccessId &&
                    formik.errors.documentAccessId
                )}
                fullWidth
                helperText={
                  formik.touched.documentAccessId &&
                  formik.errors.documentAccessId
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
                name="documentYearId"
                label="Document Year"
                select
                value={formik.values.documentYearId}
                error={Boolean(
                  formik.touched.documentYearId && formik.errors.documentYearId
                )}
                fullWidth
                helperText={
                  formik.touched.documentYearId && formik.errors.documentYearId
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

            <Grid item md={4}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                fullWidth=""
                mt={3}
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};

const KMDocumentsUploadForm = ({ id }) => {
  const [openDocumentDialog, setOpenDocumentDialog] = useState();
  const [documentsList, setDocumentsList] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: InnovationDocumentData,
    isLoading: isLoadingInnovationDocument,
  } = useQuery(
    ["getInnovationMonitoringUpdateDocumentByInnovationId", id],
    getInnovationMonitoringUpdateDocumentByInnovationId,
    {
      enabled: !!id,
    }
  );

  const handleAddDocument = (values) => {
    setDocumentsList((current) => [...current, values]);
  };
  function handleRemoveDocument(row) {
    setDocumentsList((current) =>
      current.filter((document) => document.documentName !== row.documentName)
    );
  }

  function handleViewDocument(row) {}

  const mutationDocument = useMutation({
    mutationFn: newInnovationMonitoringUpdateDocument,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const innovationDocuments = [];
        for (const item of documentsList) {
          const document = {
            innovationId: id,
            createDate: new Date(),
            documentInitials: item.documentInitials,
            documentName: item.documentName,
            documentDescription: item.documentDescription,
            documentCategoryId: item.documentCategoryId,
            documentAccessId: item.documentAccessId,
            documentYearId: item.documentYearId,
            documentUrl: SHARED_DIRECTORY.INNOVATION,
          };
          innovationDocuments.push(document);
        }
        await mutationDocument.mutateAsync(innovationDocuments);

        toast("Successfully Updated Documents", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getInnovations"]);
        navigate(`/project/monitoring/innovation-monitoring-detail/${id}`);
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
        !isLoadingInnovationDocument &&
        InnovationDocumentData.data &&
        InnovationDocumentData.data.length > 0
      ) {
        const allDocuments = [];
        for (const item of InnovationDocumentData.data) {
          const document = {
            documentInitials: item.documentInitials,
            documentName: item.documentName,
            documentDescription: item.documentDescription,
            documentCategoryId: item.documentCategoryId,
            documentAccessId: item.documentAccessId,
            documentYearId: item.documentYearId,
            documentUrl: SHARED_DIRECTORY.INNOVATION,
          };
          allDocuments.push(document);
        }
        setDocumentsList(allDocuments);
      }
    }
    setCurrentFormValues();
  }, [InnovationDocumentData, isLoadingInnovationDocument]);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setOpenDocumentDialog(true)}
              >
                <AddIcon /> Add Document
              </Button>
            </Grid>
          </Grid>
          <Grid item md={12}>
            <Paper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Document Name</TableCell>
                    <TableCell align="left">Document Description</TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {documentsList.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell align="left">{row.documentName}</TableCell>
                      <TableCell align="left">
                        {row.documentDescription}
                      </TableCell>
                      <TableCell align="left">
                        <Button
                          startIcon={<ViewIcon />}
                          size="small"
                          onClick={() => handleRemoveDocument(row)}
                        ></Button>
                        <Button
                          startIcon={<TrashIcon />}
                          size="small"
                          onClick={() => handleRemoveDocument(row)}
                        ></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item mt={5} md={12}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </Grid>

          <Dialog
            fullWidth={true}
            maxWidth="md"
            open={openDocumentDialog}
            onClose={() => setOpenDocumentDialog(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Add Document Details
            </DialogTitle>
            <DialogContent>
              <DocumentDetailsForm handleClick={handleAddDocument} />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setOpenDocumentDialog(false)}
                color="primary"
              >
                Close
              </Button>
            </DialogActions>
          </Dialog>
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
