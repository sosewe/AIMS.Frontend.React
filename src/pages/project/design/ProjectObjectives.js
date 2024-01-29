import React from "react";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import { Plus, Edit2, Trash as TrashIcon } from "react-feather";
import styled from "@emotion/styled";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteProjectObjective,
  getObjectiveByProcessLevelItemId,
  newProjectObjectives,
} from "../../../api/project-objectives";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import EditProjectObjective from "./EditProjectObjective";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
  objective: "",
};

const ProjectObjectives = ({ id, processLevelTypeId }) => {
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [objectiveId, setObjectiveId] = React.useState();

  const { data, isLoading } = useQuery(
    ["getObjectiveByProcessLevelItemId", id],
    getObjectiveByProcessLevelItemId
  );

  const handleClickOpen = (objectiveId) => {
    setOpen(true);
    setObjectiveId(objectiveId);
  };

  const handleClickEditOpen = (objectiveId) => {
    setOpenEdit(true);
    setObjectiveId(objectiveId);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleCloseEdit = () => {
    setOpenEdit(false);
  };
  const mutation = useMutation({ mutationFn: newProjectObjectives });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      objective: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        const projectObjective = {
          code: !isLoading && data.data.length > 0 ? data.data.length + 1 : 1,
          objective: values.objective,
          processLevelItemId: id,
          processLevelTypeId: processLevelTypeId,
          createDate: new Date(),
        };
        await mutation.mutateAsync(projectObjective);
        await queryClient.invalidateQueries([
          "getObjectiveByProcessLevelItemId",
        ]);
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

  const { refetch } = useQuery(
    ["deleteProjectObjective", objectiveId],
    deleteProjectObjective,
    { enabled: false }
  );

  const handleDeleteProjectObjective = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getObjectiveByProcessLevelItemId"]);
  };

  const handleClick = async () => {
    await queryClient.invalidateQueries(["getObjectiveByProcessLevelItemId"]);
    setOpenEdit(false);
  };

  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={12}>
            <Typography variant="h3" gutterBottom display="inline">
              Objectives
            </Typography>
          </Grid>
          <Grid item md={12}>
            <CardContent pb={1}>
              <form onSubmit={formik.handleSubmit}>
                <Grid container item spacing={2}>
                  <Grid item md={10}>
                    <TextField
                      name="objective"
                      label="New Objective"
                      value={formik.values.objective}
                      error={Boolean(
                        formik.touched.objective && formik.errors.objective
                      )}
                      fullWidth
                      helperText={
                        formik.touched.objective && formik.errors.objective
                      }
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                      multiline
                      required
                      variant="outlined"
                      rows={3}
                      my={2}
                    />
                  </Grid>
                  <Grid item md={2}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      mt={3}
                    >
                      <Plus /> Add Objective
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
            <br />
            <Paper style={{ height: 400, width: "100%" }}>
              <DataGrid
                rowsPerPageOptions={[5, 10, 25]}
                rows={isLoading ? [] : data ? data.data : []}
                columns={[
                  {
                    field: "code",
                    headerName: "#",
                    editable: false,
                    flex: 1,
                  },
                  {
                    field: "objective",
                    headerName: "Project Objectives",
                    editable: false,
                    flex: 1,
                  },
                  {
                    field: "action",
                    headerName: "Action",
                    sortable: false,
                    flex: 1,
                    renderCell: (params) => (
                      <>
                        <Button
                          startIcon={<Edit2 />}
                          size="small"
                          onClick={() => handleClickEditOpen(params.id)}
                        ></Button>
                        <Button
                          startIcon={<TrashIcon />}
                          size="small"
                          onClick={() => handleClickOpen(params.id)}
                        ></Button>
                      </>
                    ),
                  },
                ]}
                loading={isLoading}
                getRowHeight={() => "auto"}
              />
            </Paper>
          </Grid>
        </Grid>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete Project Objective
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Project Objective?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteProjectObjective} color="primary">
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
          open={openEdit}
          onClose={handleCloseEdit}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Edit Project Objective
          </DialogTitle>
          <DialogContent>
            <EditProjectObjective
              objectiveId={objectiveId}
              handleClick={handleClick}
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
export default ProjectObjectives;
