import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  FormControl as MuiFormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  OutlinedInput,
  Paper as MuiPaper,
  Select,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteProgrammeById, getProgrammes } from "../../api/programmes";
import { Trash as TrashIcon, PlusCircle, Eye, Edit2 } from "react-feather";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllThematicAreas } from "../../api/thematic-area";
import { getAllSubThemesByThematicAreaId } from "../../api/thematic-area-sub-theme";
import { addProgrammeThematicAreaSubTheme } from "../../api/programme-thematic-area-sub-theme";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const FormControl = styled(MuiFormControl)(spacing);

const addThematicAreaInitial = {
  selectedThematicArea: "",
  selectedSubTheme: [],
};

const AddThematicAreaForm = ({ handleClick, handleCloseThematicAreaPopup }) => {
  const [thematicAreaId, setThematicAreaId] = useState();
  const { data, isLoading, isError } = useQuery(
    ["getAllThematicAreas"],
    getAllThematicAreas
  );
  const {
    data: subThemesData,
    isLoading: isLoadingSubThemes,
    isError: isErrorSubThemes,
  } = useQuery(
    ["getAllSubThemesByThematicAreaId", thematicAreaId],
    getAllSubThemesByThematicAreaId,
    { enabled: !!thematicAreaId }
  );
  const formik = useFormik({
    initialValues: addThematicAreaInitial,
    validationSchema: Yup.object().shape({
      selectedThematicArea: Yup.string().required("Required"),
      selectedSubTheme: Yup.array().required("Required"),
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

  const handleSelectedThematicAreaChange = (event) => {
    setThematicAreaId(event.target.value);
    formik.setFieldValue("selectedSubTheme", []);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={6}>
              <FormControl fullWidth my={2} variant="outlined">
                <InputLabel id="selectedThematicArea">
                  Select Thematic Area
                </InputLabel>
                <Select
                  labelId="selectedThematicArea"
                  id="selectedThematicArea"
                  name="selectedThematicArea"
                  value={formik.values.selectedThematicArea}
                  label="Select Thematic Area"
                  error={Boolean(
                    formik.touched.selectedThematicArea &&
                      formik.errors.selectedThematicArea
                  )}
                  onBlur={formik.handleBlur}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleSelectedThematicAreaChange(e);
                  }}
                  fullWidth
                  variant="outlined"
                  my={2}
                >
                  <MenuItem disabled value="">
                    Select Thematic Area
                  </MenuItem>
                  {!isLoading && !isError
                    ? data.data.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.name}
                        </MenuItem>
                      ))
                    : []}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6}>
              <FormControl fullWidth my={2} variant="outlined">
                <InputLabel id="selectedSubTheme">
                  Select Sub Theme(Multiple)
                </InputLabel>
                <Select
                  labelId="selectedSubTheme"
                  id="selectedSubTheme"
                  name="selectedSubTheme"
                  multiple
                  value={formik.values.selectedSubTheme}
                  onChange={(e) => {
                    formik.handleChange(e);
                  }}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Select Sub Theme(Multiple)"
                    />
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
                    Select Sub Theme(Multiple)
                  </MenuItem>
                  {!isLoadingSubThemes && !isErrorSubThemes
                    ? subThemesData.data.map((option) => (
                        <MenuItem key={option.id} value={option}>
                          {option.code + "-" + option.name}
                        </MenuItem>
                      ))
                    : []}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={5}>
              &nbsp;
            </Grid>
            <Grid item md={3}>
              &nbsp;
            </Grid>
            <Grid item md={2}>
              <Button
                type="button"
                variant="contained"
                color="secondary"
                mt={3}
                onClick={handleCloseThematicAreaPopup}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item md={2}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                mt={3}
              >
                Save Changes
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};
const ProgrammesData = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [openThematicAreaPopup, setOpenThematicAreaPopup] = useState(false);
  const [id, setId] = useState();
  // const navigate = useNavigate();
  const queryClient = useQueryClient();
  // fetch Administrative Programmes
  const { data, isLoading, isError, error } = useQuery(
    ["programmes"],
    getProgrammes,
    {
      retry: 0,
    }
  );

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const { refetch } = useQuery(
    ["deleteProgrammeById", id],
    deleteProgrammeById,
    { enabled: false }
  );

  const mutationProgrammeThematicAreaSubTheme = useMutation({
    mutationFn: addProgrammeThematicAreaSubTheme,
  });

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClickOpenThematicAreaPopup(id) {
    setOpenThematicAreaPopup(true);
    setId(id);
  }

  function handleCloseThematicAreaPopup() {
    setOpenThematicAreaPopup(false);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteProgramme = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["programmes"]);
  };

  const handleClick = async (values) => {
    for (const selectedSubThemeElement of values.selectedSubTheme) {
      const programmeThematicAreaSubTheme = {
        createDate: new Date(),
        programmeId: id,
        subThemeId: selectedSubThemeElement.id,
        thematicAreaId: values.selectedThematicArea,
        void: false,
      };

      await mutationProgrammeThematicAreaSubTheme.mutateAsync(
        programmeThematicAreaSubTheme
      );
    }
    toast("Successfully Added Programme Thematic Area Sub Theme", {
      type: "success",
    });
    setOpenThematicAreaPopup(false);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/programme/new-programme")}
        >
          <AddIcon /> New Programme
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 600, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={isLoading || isError ? [] : data ? data.data : []}
            columns={[
              {
                field: "name",
                headerName: "Name",
                editable: false,
                flex: 1,
              },
              {
                field: "initials",
                headerName: "Initials",
                editable: false,
                flex: 1,
              },
              {
                field: "code",
                headerName: "Code",
                editable: false,
                flex: 1,
              },
              {
                field: "description",
                headerName: "Description",
                editable: false,
                flex: 1,
              },
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 2,
                renderCell: (params) => (
                  <>
                    <NavLink to={`/programme/new-programme/${params.id}`}>
                      <Button startIcon={<Edit2 />} size="small"></Button>
                    </NavLink>
                    <NavLink to={`/programme/view-programme/${params.id}`}>
                      <Button startIcon={<Eye />} size="small"></Button>
                    </NavLink>
                    <Button
                      startIcon={<TrashIcon />}
                      size="small"
                      onClick={() => handleClickOpen(params.id)}
                    ></Button>
                    <Button
                      startIcon={<PlusCircle />}
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() =>
                        handleClickOpenThematicAreaPopup(params.id)
                      }
                    >
                      Add Thematic Area
                    </Button>
                  </>
                ),
              },
            ]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            loading={isLoading}
            components={{ Toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
            density="compact"
          />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Programme</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Programme?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteProgramme} color="primary">
              Yes
            </Button>
            <Button onClick={handleClose} color="error" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          fullWidth={true}
          maxWidth="md"
          open={openThematicAreaPopup}
          onClose={handleCloseThematicAreaPopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Add Thematic Area
            <Divider my={6} />
          </DialogTitle>
          <DialogContent>
            <AddThematicAreaForm
              handleClick={handleClick}
              handleCloseThematicAreaPopup={handleCloseThematicAreaPopup}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Card>
  );
};
const Programmes = () => {
  return (
    <React.Fragment>
      <Helmet title="Programmes" />
      <Typography variant="h3" gutterBottom display="inline">
        Programmes
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/administrative-programmes">
          Programmes
        </Link>
        <Typography>Programmes List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ProgrammesData />
    </React.Fragment>
  );
};
export default Programmes;
