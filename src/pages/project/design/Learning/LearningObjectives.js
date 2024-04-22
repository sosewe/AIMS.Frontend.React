import React, { useEffect, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { MenuItem } from "@mui/material";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Dialog,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Breadcrumbs,
  Divider,
  Grid,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { Check, Trash as TrashIcon } from "react-feather";
import styled from "@emotion/styled";
import {
  newTechnicalAssistanceObjective,
  getTechnicalAssistanceObjectiveByTechnicalAssistanceId,
} from "../../../../api/technical-assistance-objective";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { Guid } from "../../../../utils/guid";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import useKeyCloakAuth from "../../../../hooks/useKeyCloakAuth";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const objectiveDetailsInitialValues = {
  technicalAssistanceObjectiveDescription: "",
};

const ObjectiveDetailsForm = ({ handleClick }) => {
  const formik = useFormik({
    initialValues: objectiveDetailsInitialValues,
    validationSchema: Yup.object().shape({
      technicalAssistanceObjectiveDescription:
        Yup.string().required("Required"),
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
                name="technicalAssistanceObjectiveDescription"
                label="Objective Description"
                value={formik.values.technicalAssistanceObjectiveDescription}
                error={Boolean(
                  formik.touched.technicalAssistanceObjectiveDescription &&
                    formik.errors.technicalAssistanceObjectiveDescription
                )}
                fullWidth
                helperText={
                  formik.touched.technicalAssistanceObjectiveDescription &&
                  formik.errors.technicalAssistanceObjectiveDescription
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                rows={4}
                multiline
                my={2}
              />
            </Grid>
            <Grid item md={1}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
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

const LearningObjectives = ({ id }) => {
  const [openAddObjectives, setOpenAddObjectives] = useState(false);
  const [objectivesList, setObjectivesList] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useKeyCloakAuth();

  const {
    data: technicalAssistanceObjectivesData,
    isLoading: isLoadingTechnicalAssistanceObjectivesData,
  } = useQuery(
    ["getTechnicalAssistanceObjectiveByTechnicalAssistanceId", id],
    getTechnicalAssistanceObjectiveByTechnicalAssistanceId,
    { enabled: !!id }
  );

  const mutation = useMutation({
    mutationFn: newTechnicalAssistanceObjective,
  });

  const formik = useFormik({
    initialValues: "",
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        let technicalAssistanceObjectives = [];
        for (const objective of objectivesList) {
          const technicalAssistanceObjective = {
            id: new Guid().toString(),
            objective: objective.technicalAssistanceObjectiveDescription,
            technicalAssistanceId: id,
            createDate: new Date(),
            userId: user.sub,
          };
          technicalAssistanceObjectives.push(technicalAssistanceObjective);
        }
        await mutation.mutateAsync(technicalAssistanceObjectives);

        toast("Successfully Created Learning Objective", {
          type: "success",
        });

        await queryClient.invalidateQueries([
          "getTechnicalAssistanceObjectiveByTechnicalAssistanceId",
        ]);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  function removeObjective(row) {
    setObjectivesList((current) =>
      current.filter(
        (objective) =>
          objective.technicalAssistanceObjectiveDescription !==
          row.technicalAssistanceObjectiveDescription
      )
    );
  }

  const handleObjectiveAdd = (values) => {
    setObjectivesList((current) => [...current, values]);
  };

  useEffect(() => {
    function setCurrentFormValues() {
      if (
        technicalAssistanceObjectivesData &&
        technicalAssistanceObjectivesData.data.length > 0
      ) {
        const allObjectives = [];
        for (const objectiveData of technicalAssistanceObjectivesData.data) {
          const objective = {
            id: objectiveData.id,
            technicalAssistanceId: objectiveData.technicalAssistanceId,
            technicalAssistanceObjectiveDescription: objectiveData.objective,
          };
          allObjectives.push(objective);
        }
        setObjectivesList(allObjectives);
      }
    }
    setCurrentFormValues();
  }, [technicalAssistanceObjectivesData]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container>
            <Grid item md={12}>
              <Typography variant="h3" gutterBottom display="inline">
                Objectives
              </Typography>
            </Grid>
            <Grid item md={12} mt={5}>
              <Divider my={6} />
            </Grid>

            <Grid container mt={5}>
              <Grid item md={12}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setOpenAddObjectives(true)}
                >
                  <AddIcon /> Add Objective
                </Button>
              </Grid>

              <Grid item md={12}>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Objective Description</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {objectivesList.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell component="th" scope="row">
                            {row.technicalAssistanceObjectiveDescription}
                          </TableCell>
                          <TableCell align="right">
                            <Button
                              startIcon={<TrashIcon />}
                              size="small"
                              onClick={() => removeObjective(row)}
                            ></Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>

            <br />
            <Button type="submit" variant="contained" color="primary" mt={15}>
              <Check /> Save changes
            </Button>
          </Grid>
        </CardContent>
      </Card>

      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openAddObjectives}
        onClose={() => setOpenAddObjectives(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Objective Details</DialogTitle>
        <DialogContent>
          <ObjectiveDetailsForm handleClick={handleObjectiveAdd} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddObjectives(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default LearningObjectives;
