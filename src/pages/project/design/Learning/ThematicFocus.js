import React, { useEffect, useState, useCallback } from "react";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import styled from "@emotion/styled";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllThematicAreas,
  getThematicArea,
} from "../../../../api/thematic-area";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { getSubThemesByThematicAreaId } from "../../../../api/thematic-area-sub-theme";
import { Check, Trash as TrashIcon, ChevronLeft } from "react-feather";
import { Guid } from "../../../../utils/guid";
import { Helmet } from "react-helmet-async";

import {
  deleteLearningThematicFocusById,
  getLearningThematicFocusByLearningId,
  newLearningThematicFocus,
} from "../../../../api/learning-thematic-focus";
import { DataGrid } from "@mui/x-data-grid";
import { getSubTheme } from "../../../../api/sub-theme";
import {
  getUniqueProgrammesByThematicAreaId,
  getUniqueThematicAreasByProgrammeId,
} from "../../../../api/programme-thematic-area-sub-theme";
import { getProgrammes } from "../../../../api/programmes";
import useKeyCloakAuth from "../../../../hooks/useKeyCloakAuth";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
  thematicArea: "",
};

const ThematicFocus = (props) => {
  const id = props.id;
  const onActionChange = props.onActionChange;
  const queryClient = useQueryClient();
  const [strategicObjectiveId, setStrategicObjectiveId] = useState();
  const [thematicAreaId, setThematicAreaId] = useState();
  const [open, setOpen] = React.useState(false);
  const [thematicFocusId, setThematicFocusId] = React.useState();
  const [pageSize, setPageSize] = useState(5);
  const user = useKeyCloakAuth();

  const {
    isLoading: isLoadingStrategicObjectives,
    isError: isErrorStrategicObjectives,
    data: strategicObjectivesData,
  } = useQuery(["objectivesList"], getProgrammes, {
    refetchOnWindowFocus: false,
    retry: 0,
  });

  const { data, isLoading } = useQuery(
    ["getAllThematicAreas"],
    getAllThematicAreas,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: themesData, isLoading: isLoadingThemes } = useQuery(
    ["getUniqueThematicAreasByProgrammeId", strategicObjectiveId],
    getUniqueThematicAreasByProgrammeId,
    { enabled: !!strategicObjectiveId }
  );

  const { data: subThemesData, isLoading: isLoadingSubThemes } = useQuery(
    ["getSubThemesByThematicAreaId", thematicAreaId],
    getSubThemesByThematicAreaId,
    { enabled: !!thematicAreaId }
  );

  const {
    data: projectThematicFocusData,
    isLoading: isLoadingProjectThematicFocus,
  } = useQuery(
    ["getLearningThematicFocusByLearningId", id],
    getLearningThematicFocusByLearningId,
    { enabled: !!id }
  );
  const mutation = useMutation({ mutationFn: newLearningThematicFocus });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      thematicArea: Yup.object().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        for (const subThemesDatum of subThemesData.data) {
          if (
            values.hasOwnProperty(subThemesDatum.subThemeId) &&
            values[subThemesDatum.subThemeId].length > 0
          ) {
            const innovationThematicFocus = {
              researchId: id,
              createDate: new Date(),
              subThemeId: subThemesDatum.subThemeId,
              thematicAreaId: subThemesDatum.thematicAreaId,
              id: new Guid().toString(),
              userId: user.sub,
            };
            await mutation.mutateAsync(innovationThematicFocus);
          }
        }
        await queryClient.invalidateQueries([
          "getLearningThematicFocusByLearningId",
        ]);
        toast("Successfully Updated Learning Thematic Focus", {
          type: "success",
        });
      } catch (error) {
        if (error.response !== undefined) {
          toast(error.response.data, {
            type: "error",
          });
        } else {
          toast(error, {
            type: "error",
          });
        }
      }
    },
  });

  function HandleStrategicObjectiveChange(e) {
    const strategicObjectiveId = e.target.value.id;
    setStrategicObjectiveId(strategicObjectiveId);
    HandleThematicAreaChange(e);
  }

  function HandleThematicAreaChange(e) {
    const thematicAreaId = e.target.value.id;
    setThematicAreaId(thematicAreaId);
  }

  function GetStrategicObjective(params) {
    const thematicAreaId = params.row.thematicAreaId;
    const resultProgrammeThematicAreaSubTheme = useQuery(
      ["getUniqueProgrammesByThematicAreaId", thematicAreaId],
      getUniqueProgrammesByThematicAreaId
    );

    if (
      resultProgrammeThematicAreaSubTheme &&
      resultProgrammeThematicAreaSubTheme.data
    ) {
      let returnVal = `${resultProgrammeThematicAreaSubTheme.data.data[0].name}`;
      return returnVal;
    }
  }

  function GetSubTheme(params) {
    const subThemeId = params.row.subThemeId;
    const thematicAreaId = params.row.thematicAreaId;
    const result = useQuery(["getSubTheme", subThemeId], getSubTheme);
    const resultThematic = useQuery(
      ["getThematicArea", thematicAreaId],
      getThematicArea
    );
    const resultProgrammeThematicAreaSubTheme = useQuery(
      ["getUniqueProgrammesByThematicAreaId", thematicAreaId],
      getUniqueProgrammesByThematicAreaId
    );
    if (result && result.data && resultThematic && resultThematic.data) {
      let returnVal = `${result.data.data.name} [${resultThematic.data.data.name}]`;
      return returnVal;
    }
  }

  function handleClickOpen(thematicFocusId) {
    setOpen(true);
    setThematicFocusId(thematicFocusId);
  }

  function handleClose() {
    setOpen(false);
  }

  const { refetch } = useQuery(
    ["deleteLearningThematicFocusById", thematicFocusId],
    deleteLearningThematicFocusById,
    { enabled: false }
  );

  const handleDeleteLearningThematicFocus = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries([
      "getInnovationThematicFocusByInnovationId",
    ]);
  };

  const handleActionChange = useCallback(
    (event) => {
      onActionChange({ id: 0, status: 1 });
    },
    [onActionChange]
  );

  return (
    <React.Fragment>
      <Grid item md={12}>
        <Typography variant="h3" gutterBottom display="inline">
          Thematic Focus
        </Typography>
      </Grid>
      <Grid item md={12} mt={5}>
        <Divider my={6} />
      </Grid>
      <Card mb={12}>
        <CardContent>
          <Grid container>
            <Grid item md={12}>
              <CardContent pb={1}>
                <form onSubmit={formik.handleSubmit}>
                  <Grid container item spacing={2}>
                    <Grid item md={12} mb={5}>
                      <TextField
                        name="strategicObjective"
                        label="Strategic Objective"
                        required
                        select
                        value={formik.values.strategicObjective}
                        error={Boolean(
                          formik.touched.strategicObjective &&
                            formik.errors.strategicObjective
                        )}
                        fullWidth
                        helperText={
                          formik.touched.strategicObjective &&
                          formik.errors.strategicObjective
                        }
                        onBlur={formik.handleBlur}
                        onChange={(e) => {
                          formik.handleChange(e);
                          HandleStrategicObjectiveChange(e);
                        }}
                        variant="outlined"
                      >
                        <MenuItem disabled value="">
                          Select Strategic Objective
                        </MenuItem>
                        {!isLoadingStrategicObjectives
                          ? strategicObjectivesData.data.map((option) => (
                              <MenuItem key={option.id} value={option}>
                                {option.name}
                              </MenuItem>
                            ))
                          : []}
                      </TextField>
                    </Grid>

                    <Grid item md={12}>
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
                        onChange={(e) => {
                          formik.handleChange(e);
                          HandleThematicAreaChange(e);
                        }}
                        variant="outlined"
                      >
                        <MenuItem disabled value="">
                          Select Thematic Area
                        </MenuItem>
                        {!isLoadingThemes
                          ? themesData.data.map((option) => (
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
                          <Grid item md={12}>
                            {!isLoadingSubThemes &&
                              subThemesData.data.map((value, index) => {
                                return (
                                  <Grid container item spacing={2} key={index}>
                                    <Grid item md={12}>
                                      <FormGroup>
                                        <FormControlLabel
                                          control={
                                            <Checkbox
                                              onChange={formik.handleChange}
                                              name={value.subTheme.id}
                                            />
                                          }
                                          label={value.subTheme.name}
                                        />
                                      </FormGroup>
                                    </Grid>
                                  </Grid>
                                );
                              })}
                          </Grid>
                          <Grid item md={12}>
                            <Button
                              type="submit"
                              variant="contained"
                              color="primary"
                              mt={3}
                            >
                              <Check /> Save Sub-Theme
                            </Button>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  <br />
                  <br />
                  <br />
                  <Grid container item spacing={2}>
                    <Grid item md={12}>
                      <Paper style={{ height: 400, width: "100%" }}>
                        <DataGrid
                          rowsPerPageOptions={[5, 10, 25]}
                          rows={
                            isLoadingProjectThematicFocus
                              ? []
                              : projectThematicFocusData
                              ? projectThematicFocusData.data
                              : []
                          }
                          columns={[
                            {
                              field: "thematicAreaId",
                              colId: "subThemeId&thematicAreaId",
                              headerName: "STRATEGIC OBJECTIVE",
                              editable: false,
                              flex: 1,
                              renderCell: GetStrategicObjective,
                            },
                            {
                              field: "subThemeId",
                              colId: "subThemeId&thematicAreaId",
                              headerName: "SUB-THEME [THEMATIC AREA]",
                              editable: false,
                              flex: 1,
                              renderCell: GetSubTheme,
                            },
                            {
                              field: "action",
                              headerName: "ACTION",
                              sortable: false,
                              flex: 1,
                              renderCell: (params) => (
                                <>
                                  <Button
                                    startIcon={<TrashIcon />}
                                    size="small"
                                    onClick={(e) => handleClickOpen(params.id)}
                                  ></Button>
                                </>
                              ),
                            },
                          ]}
                          pageSize={pageSize}
                          onPageSizeChange={(newPageSize) =>
                            setPageSize(newPageSize)
                          }
                          loading={isLoadingProjectThematicFocus}
                          getRowHeight={() => "auto"}
                        />
                      </Paper>
                      <Dialog
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                      >
                        <DialogTitle id="alert-dialog-title">
                          Delete Project Thematic Focus
                        </DialogTitle>
                        <DialogContent>
                          <DialogContentText id="alert-dialog-description">
                            Are you sure you want to delete Learning Thematic
                            Focus?
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            onClick={handleDeleteLearningThematicFocus}
                            color="primary"
                          >
                            Yes
                          </Button>
                          <Button onClick={handleClose} color="error" autoFocus>
                            No
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Grid>
                  </Grid>
                </form>
                <Grid item mt={5} md={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    mt={3}
                    onClick={() => handleActionChange()}
                  >
                    <ChevronLeft /> Back
                  </Button>
                </Grid>
              </CardContent>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default ThematicFocus;
