import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { NavLink, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2, Eye, PlusCircle, Trash as TrashIcon } from "react-feather";
import { Add as AddIcon } from "@mui/icons-material";
import {
  deleteThematicArea,
  getAllThematicAreas,
} from "../../api/thematic-area";
import { useFormik } from "formik";
import * as Yup from "yup";
import { getAllSubThemes } from "../../api/sub-theme";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { saveThematicAreaSubTheme } from "../../api/thematic-area-sub-theme";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);
const FormControl = styled(MuiFormControl)(spacing);

const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

const addSubThemeInitial = {
  selectedSubTheme: [],
};

const AddSubThemeForm = ({ handleClick, handleCloseSubThemePopup }) => {
  const { data, isLoading, isError } = useQuery(
    ["getAllSubThemes"],
    getAllSubThemes
  );
  const formik = useFormik({
    initialValues: addSubThemeInitial,
    validationSchema: Yup.object().shape({
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={2}>
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
                  {!isLoading && !isError
                    ? data.data.map((option) => (
                        <MenuItem key={option.id} value={option}>
                          {option.code + "-" + option.name}
                        </MenuItem>
                      ))
                    : []}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={6}>
              &nbsp;
            </Grid>
            <Grid item md={5}>
              &nbsp;
            </Grid>
            <Grid item md={2}>
              &nbsp;
            </Grid>
            <Grid item md={2}>
              <ThemeProvider theme={theme}>
                <Button
                  type="button"
                  variant="contained"
                  color="neutral"
                  mt={3}
                  onClick={handleCloseSubThemePopup}
                >
                  Cancel
                </Button>
              </ThemeProvider>
            </Grid>
            <Grid item md={3}>
              <ThemeProvider theme={theme}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  mt={3}
                >
                  Save Changes
                </Button>
              </ThemeProvider>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </form>
  );
};
const ThematicAreasData = () => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [openSubThemePopup, setOpenSubThemePopup] = useState(false);
  const [id, setId] = useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // fetch Thematic Areas
  const { data, isLoading, isError, error } = useQuery(
    ["getAllThematicAreas"],
    getAllThematicAreas,
    {
      retry: 0,
    }
  );

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const { refetch } = useQuery(["deleteThematicArea", id], deleteThematicArea, {
    enabled: false,
  });

  const mutationThematicAreaSubTheme = useMutation({
    mutationFn: saveThematicAreaSubTheme,
  });

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClickOpenSubThemePopup(id) {
    setOpenSubThemePopup(true);
    setId(id);
  }

  function handleCloseSubThemePopup() {
    setOpenSubThemePopup(false);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteThematicArea = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getAllThematicAreas"]);
  };

  const handleClick = async (values) => {
    for (const selectedSubThemeElement of values.selectedSubTheme) {
      const thematicAreaSubTheme = {
        createDate: new Date(),
        subThemeId: selectedSubThemeElement.id,
        thematicAreaId: id,
        void: false,
      };
      await mutationThematicAreaSubTheme.mutateAsync(thematicAreaSubTheme);
    }
    toast("Successfully Added Thematic Area Sub Theme", {
      type: "success",
    });
    setOpenSubThemePopup(false);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/programme/new-thematic-area")}
        >
          <AddIcon /> New Thematic Area
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
                field: "initial",
                headerName: "Initial",
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
                    <NavLink to={`/programme/new-thematic-area/${params.id}`}>
                      <Button startIcon={<Edit2 />} size="small"></Button>
                    </NavLink>
                    <NavLink to={`/programme/view-thematic-area/${params.id}`}>
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
                      onClick={() => handleClickOpenSubThemePopup(params.id)}
                    >
                      Add Sub Theme
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
          <DialogTitle id="alert-dialog-title">
            Delete Thematic Area
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Thematic Area?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteThematicArea} color="primary">
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
          open={openSubThemePopup}
          onClose={handleCloseSubThemePopup}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Add Sub Theme
            <Divider my={6} />
          </DialogTitle>
          <DialogContent>
            <AddSubThemeForm
              handleClick={handleClick}
              handleCloseSubThemePopup={handleCloseSubThemePopup}
            />
          </DialogContent>
        </Dialog>
      </Paper>
    </Card>
  );
};
const ThematicAreas = () => {
  return (
    <React.Fragment>
      <Helmet title="Thematic Areas" />
      <Typography variant="h3" gutterBottom display="inline">
        Thematic Areas
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/thematic-areas">
          Thematic Areas
        </Link>
        <Typography>Thematic Areas List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ThematicAreasData />
    </React.Fragment>
  );
};
export default ThematicAreas;
