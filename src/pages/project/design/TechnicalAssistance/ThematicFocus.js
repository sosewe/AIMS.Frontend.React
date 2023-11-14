import React, { useState } from "react";
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
  Link,
  Breadcrumbs,
  Divider,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Typography,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
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
  deleteTechnicalAssistanceThematicFocus,
  getTechnicalAssistanceThematicFocusByTechnicalAssistanceId,
  saveTechnicalAssistanceThematicFocus,
} from "../../../../api/technical-assistance-thematic-focus";
import { getDonors, getstrategicObjectives } from "../../../../api/donor";
import { DataGrid } from "@mui/x-data-grid";
import { getSubTheme } from "../../../../api/sub-theme";
import { getUniqueProgrammesByThematicAreaId } from "../../../../api/programme-thematic-area-sub-theme";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
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
    data: TechnicalAssistanceThematicFocusData,
    isLoading: isLoadingTechnicalAssistanceThematicFocus,
  } = useQuery(
    ["getTechnicalAssistanceThematicFocusByTechnicalAssistanceId", id],
    getTechnicalAssistanceThematicFocusByTechnicalAssistanceId,
    { enabled: !!id }
  );

  const { isLoading: isLoadingDonor, data: donorData } = useQuery(
    ["getDonors"],
    getDonors,
    {
      refetchOnWindowFocus: false,
    }
  );
  const mutation = useMutation({
    mutationFn: saveTechnicalAssistanceThematicFocus,
  });

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
            const TechnicalAssistanceThematicFocus = {
              processLevelItemId: id,
              processLevelTypeId: processLevelTypeId,
              createDate: new Date(),
              subThemeId: subThemesDatum.subThemeId,
              thematicAreaId: subThemesDatum.thematicAreaId,
              id: new Guid().toString(),
            };
            await mutation.mutateAsync(TechnicalAssistanceThematicFocus);
          }
        }
        await queryClient.invalidateQueries([
          "getTechnicalAssistanceThematicFocusByTechnicalAssistanceId",
        ]);
        toast("Successfully added Project Thematic Focus", {
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
    ["deleteTechnicalAssistanceThematicFocus", thematicFocusId],
    deleteTechnicalAssistanceThematicFocus,
    { enabled: false }
  );

  const handleDeleteTechnicalAssistanceThematicFocus = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries([
      "getTechnicalAssistanceThematicFocusByTechnicalAssistanceId",
    ]);
  };

  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={12}>
          <Grid item md={12}>
            <Typography variant="h3" gutterBottom display="inline">
              Thematic Focus
            </Typography>

            <Breadcrumbs aria-label="Breadcrumb" mt={6}>
              <Link>Project Design</Link>
              <Typography>Technical Assistance</Typography>
            </Breadcrumbs>

            <Divider my={0} />
          </Grid>
          <Grid item md={12}>
            <form onSubmit={formik.handleSubmit}>
              <Grid container>
                <Grid item md={12} mb={3}>
                  <FormControl sx={{ width: "100%" }}>
                    <InputLabel>Amref Strategic Objectives</InputLabel>
                    <Select
                      fullWidth
                      multiple
                      required
                      value={formik.values.strategicObjectives}
                      error={Boolean(
                        formik.touched.strategicObjectives &&
                          formik.errors.strategicObjectives
                      )}
                      onChange={(e) => {
                        const selectedStrategicObjectives = Array.isArray(
                          e.target.value
                        )
                          ? e.target.value
                          : [e.target.value]; // Ensure it's always an array
                        formik.setFieldValue(
                          "strategicObjectives",
                          selectedStrategicObjectives
                        );
                      }}
                      input={<OutlinedInput label="Multiple Select" />}
                      renderValue={(selected) => (
                        <Stack gap={1} direction="row" flexWrap="wrap">
                          {selected.map((value) => (
                            <Chip
                              key={value.id}
                              label={value.donorName}
                              onDelete={() =>
                                formik.setFieldValue(
                                  "strategicObjectives",
                                  formik.values.strategicObjectives.filter(
                                    (item) => item !== value
                                  )
                                )
                              }
                              deleteIcon={
                                <CancelIcon
                                  onMouseDown={(event) =>
                                    event.stopPropagation()
                                  }
                                />
                              }
                            />
                          ))}
                        </Stack>
                      )}
                    >
                      {[]}
                    </Select>
                  </FormControl>
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
                        isLoadingTechnicalAssistanceThematicFocus
                          ? []
                          : TechnicalAssistanceThematicFocusData
                          ? TechnicalAssistanceThematicFocusData.data
                          : []
                      }
                      columns={[
                        {
                          field: "id",
                          colId: "subThemeId&thematicAreaId",
                          headerName: "OBJECTIVES",
                          editable: false,
                          flex: 1,
                          valueGetter: GetSubTheme,
                        },
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
                      loading={isLoadingTechnicalAssistanceThematicFocus}
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
                        onClick={handleDeleteTechnicalAssistanceThematicFocus}
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
