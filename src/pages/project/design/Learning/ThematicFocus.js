import React, { useEffect, useState } from "react";
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
  TextField as MuiTextField,
  Typography,
  Paper as MuiPaper,
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
import { Check, Trash as TrashIcon } from "react-feather";
import CancelIcon from "@mui/icons-material/Cancel";
import { Guid } from "../../../../utils/guid";
import {
  newLearningThematicFocus,
  getLearningThematicFocusByLearningId,
  deleteLearningThematicFocusById,
} from "../../../../api/learning-thematic-focus";
import { DataGrid } from "@mui/x-data-grid";
import { getSubTheme } from "../../../../api/sub-theme";
import { getUniqueProgrammesByThematicAreaId } from "../../../../api/programme-thematic-area-sub-theme";
import { getObjectives } from "../../../../api/project-objectives";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
  strategicObjectiveId: "",
  thematicArea: "",
};

const ThematicFocus = ({ id, processLevelTypeId }) => {
  const queryClient = useQueryClient();
  const [thematicAreaId, setThematicAreaId] = useState();
  const [open, setOpen] = React.useState(false);
  const [thematicFocusId, setThematicFocusId] = React.useState();
  const [pageSize, setPageSize] = useState(5);
  const { data, isLoading } = useQuery(
    ["getAllThematicAreas"],
    getAllThematicAreas,
    {
      refetchOnWindowFocus: false,
    }
  );
  const { data: subThemesData, isLoading: isLoadingSubThemes } = useQuery(
    ["getSubThemesByThematicAreaId", thematicAreaId],
    getSubThemesByThematicAreaId,
    { enabled: !!thematicAreaId }
  );

  const {
    data: LearningThematicFocusData,
    isLoading: isLoadingLearningThematicFocus,
  } = useQuery(
    ["getLearningThematicFocusByLearningId", id],
    getLearningThematicFocusByLearningId,
    { enabled: !!id }
  );

  const { isLoading: isLoadingAmrefObjectives, data: amrefObjectivesData } =
    useQuery(["getObjectives"], getObjectives, {
      refetchOnWindowFocus: false,
    });

  const mutation = useMutation({
    mutationFn: newLearningThematicFocus,
  });

  const formik = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: Yup.object().shape({
      strategicObjectiveId: Yup.object().required("Required"),
      thematicArea: Yup.object().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        for (const subThemesDatum of subThemesData.data) {
          if (
            values.hasOwnProperty(subThemesDatum.subThemeId) &&
            values[subThemesDatum.subThemeId].length > 0
          ) {
            const learningThematicFocus = {
              processLevelItemId: id,
              processLevelTypeId: processLevelTypeId,
              createDate: new Date(),
              subThemeId: subThemesDatum.subThemeId,
              thematicAreaId: subThemesDatum.thematicAreaId,
              strategicObjectiveId: values.strategicObjectiveId.id,
              researchId: id,
              id: new Guid().toString(),
            };
            await mutation.mutateAsync(learningThematicFocus);
          }
        }

        await queryClient.invalidateQueries([
          "getLearningThematicFocusByLearningId",
        ]);

        await queryClient.invalidateQueries([
          "getTechnicalAssistanceStrategicObjectiveByLearningId",
        ]);

        toast("Successfully Updated Research Thematic Focus", {
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

  function HandleThematicAreaChange(e) {
    const thematicAreaId = e.target.value.id;
    setThematicAreaId(thematicAreaId);
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
    if (
      result &&
      result.data &&
      resultThematic &&
      resultThematic.data &&
      resultProgrammeThematicAreaSubTheme &&
      resultProgrammeThematicAreaSubTheme.data
    ) {
      let returnVal = `${result.data.data.name}(${resultThematic.data.data.name})`;
      if (resultProgrammeThematicAreaSubTheme.data.data.length > 0) {
        returnVal += `(${resultProgrammeThematicAreaSubTheme.data.data[0].name})`;
      }
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
      "getLearningThematicFocusByLearningId",
    ]);
  };

  useEffect(() => {
    function setCurrentFormValues() {}
    setCurrentFormValues();
  }, []);

  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={6}>
          <Grid item md={12}>
            <Typography variant="h3" gutterBottom display="inline">
              Thematic Focus
            </Typography>
          </Grid>
          <Grid item md={12}>
            <Divider my={6} />
          </Grid>
          <Grid item md={12}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container>
                <Grid item md={12} mb={3}>
                  <TextField
                    name="strategicObjectiveId"
                    label="Strategic Objective"
                    select
                    value={formik.values.strategicObjectiveId}
                    error={Boolean(
                      formik.touched.strategicObjectiveId &&
                        formik.errors.strategicObjectiveId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.strategicObjectiveId &&
                      formik.errors.strategicObjectiveId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select
                    </MenuItem>
                    {!isLoadingAmrefObjectives
                      ? amrefObjectivesData.data.map((option) => (
                          <MenuItem key={option.id} value={option}>
                            {option.objective}
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
                      formik.touched.thematicArea && formik.errors.thematicArea
                    )}
                    fullWidth
                    helperText={
                      formik.touched.thematicArea && formik.errors.thematicArea
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.handleChange(e);
                      HandleThematicAreaChange(e);
                    }}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Thematic Area
                    </MenuItem>
                    {!isLoading
                      ? data.data.map((option) => (
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
                  <Paper style={{ height: 250, width: "100%" }}>
                    <DataGrid
                      rowsPerPageOptions={[5, 10, 25]}
                      rows={
                        isLoadingLearningThematicFocus
                          ? []
                          : LearningThematicFocusData
                          ? LearningThematicFocusData.data
                          : []
                      }
                      columns={[
                        {
                          field: "subThemeId",
                          colId: "subThemeId&thematicAreaId",
                          headerName: "SUB-THEME(THEMATIC AREA)",
                          editable: false,
                          flex: 1,
                          valueGetter: GetSubTheme,
                        },
                        {
                          field: "action",
                          headerName: "Action",
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
                      loading={isLoadingLearningThematicFocus}
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
                      Delete Technical Assistance Thematic Focus
                    </DialogTitle>
                    <DialogContent>
                      <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete Technical Assistance
                        Thematic Focus?
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
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default ThematicFocus;
