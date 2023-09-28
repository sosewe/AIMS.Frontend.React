import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Autocomplete as MuiAutocomplete,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  Link,
  MenuItem,
  Paper as MuiPaper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { getAllThematicAreas } from "../../../../api/thematic-area";
import { getAmrefEntities } from "../../../../api/amref-entity";
import { getAdvocacyById, newAdvocacy } from "../../../../api/advocacy";
import {
  getQualitativeCountryByTypeItemId,
  newQualitativeCountry,
} from "../../../../api/qualitative-country";
import {
  getQualitativePeriodByTypeItemId,
  newQualitativePeriod,
} from "../../../../api/qualitative-period";
import {
  getQualitativeThematicAreaByTypeItemId,
  newQualitativeThematicArea,
} from "../../../../api/qualitative-thematic-area";
import {
  getAdvocacyMilestoneByAdvocacyId,
  newAdvocacyMilestoneRange,
} from "../../../../api/advocacy-milestone";
import { Guid } from "../../../../utils/guid";

const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Paper = styled(MuiPaper)(spacing);

const initialValues = {
  title: "",
  duration_from: "",
  duration_to: "",
  staffNameId: "",
  thematicAreaId: "",
  countryId: [],
  beneficiary: "",
  objective: "",
  advocacyNeed: "",
  expectedResult: "",
  output: "",
};

const milestonesInitial = {
  milestone: "",
  yearId: "",
  quarterId: "",
};

const AddMilestoneForm = ({ handleClick }) => {
  const {
    isLoading: isLoadingYearsData,
    isError: isErrorYearsData,
    data: yearsData,
  } = useQuery(["years", "Years"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });
  const {
    isLoading: isLoadingQuartersData,
    isError: isErrorQuartersData,
    data: quartersData,
  } = useQuery(["quarters", "Quarters"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });
  const formik = useFormik({
    initialValues: milestonesInitial,
    validationSchema: Yup.object().shape({
      milestone: Yup.string().required("Required"),
      yearId: Yup.object().required("Required"),
      quarterId: Yup.object().required("Required"),
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
            <Grid item md={12}>
              <TextField
                name="milestone"
                label="Milestone"
                value={formik.values.milestone}
                error={Boolean(
                  formik.touched.milestone && formik.errors.milestone
                )}
                fullWidth
                helperText={formik.touched.milestone && formik.errors.milestone}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
                multiline
                rows={3}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                name="yearId"
                label="Year"
                select
                required
                value={formik.values.yearId}
                error={Boolean(formik.touched.yearId && formik.errors.yearId)}
                fullWidth
                helperText={formik.touched.yearId && formik.errors.yearId}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Year
                </MenuItem>
                {!isLoadingYearsData && !isErrorYearsData
                  ? yearsData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={6}>
              <TextField
                name="quarterId"
                label="Quarter"
                select
                required
                value={formik.values.quarterId}
                error={Boolean(
                  formik.touched.quarterId && formik.errors.quarterId
                )}
                fullWidth
                helperText={formik.touched.quarterId && formik.errors.quarterId}
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Quarter
                </MenuItem>
                {!isLoadingQuartersData && !isErrorQuartersData
                  ? quartersData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.lookupItemName}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={3}>
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
const AdvocacyForm = ({ processLevelItemId, processLevelTypeId, id }) => {
  const [openMilestoneModal, setOpenMilestoneModal] = useState(false);
  const [milestonesArray, setMilestonesArray] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  let innovationQualitativeTypeId;
  const {
    isLoading: isLoadingYearsData,
    isError: isErrorYearsData,
    data: yearsData,
  } = useQuery(["years", "Years"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });
  const {
    isLoading: isLoadingQuartersData,
    isError: isErrorQuartersData,
    data: quartersData,
  } = useQuery(["quarters", "Quarters"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });
  const {
    data: AdvocacyData,
    isLoading: isLoadingAdvocacyData,
    isError: isErrorAdvocacyData,
  } = useQuery(["getAdvocacyById", id], getAdvocacyById, { enabled: !!id });
  const {
    data: QualitativeCountryData,
    isLoading: isLoadingQualitativeCountry,
    isError: isErrorQualitativeCountry,
  } = useQuery(
    ["getQualitativeCountryByTypeItemId", id],
    getQualitativeCountryByTypeItemId,
    { enabled: !!id }
  );
  const {
    data: QualitativePeriodData,
    isLoading: isLoadingQualitativePeriod,
    isError: isErrorQualitativePeriod,
  } = useQuery(
    ["getQualitativePeriodByTypeItemId", id],
    getQualitativePeriodByTypeItemId,
    { enabled: !!id }
  );
  const {
    data: QualitativeThematicAreaData,
    isLoading: isLoadingQualitativeThematicArea,
    isError: isErrorQualitativeThematicArea,
  } = useQuery(
    ["getQualitativeThematicAreaByTypeItemId", id],
    getQualitativeThematicAreaByTypeItemId,
    { enabled: !!id }
  );
  const {
    data: AdvocacyMilestonesData,
    isLoading: isLoadingAdvocacyMilestones,
    isError: isErrorAdvocacyMilestones,
  } = useQuery(
    ["getAdvocacyMilestoneByAdvocacyId", id],
    getAdvocacyMilestoneByAdvocacyId,
    { enabled: !!id }
  );
  const {
    isLoading: isLoadingStaffList,
    isError: isErrorStaffList,
    data: staffListData,
  } = useQuery(["staffList"], getAMREFStaffList, {
    refetchOnWindowFocus: false,
    retry: 0,
  });
  const {
    data: ThematicAreas,
    isLoading: isLoadingThematicAreas,
    isError: isErrorThematicAreas,
  } = useQuery(["getAllThematicAreas"], getAllThematicAreas, {
    refetchOnWindowFocus: false,
  });
  const {
    isLoading: isLoadingAmrefEntities,
    data: amrefEntities,
    isError: isErrorAmrefEntities,
  } = useQuery(["amrefEntities"], getAmrefEntities, {
    refetchOnWindowFocus: false,
  });
  const {
    data: QualitativeResultTypesData,
    isLoading: isLoadingQualitativeResultTypes,
    isError: isErrorQualitativeResultTypes,
  } = useQuery(
    ["qualitativeResultType", "QualitativeResultType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  if (!isLoadingQualitativeResultTypes && !isErrorQualitativeResultTypes) {
    const filterInnovation = QualitativeResultTypesData.data.find(
      (obj) => obj.lookupItemName === "Advocacy"
    );
    innovationQualitativeTypeId = filterInnovation.lookupItemId;
  }
  const mutation = useMutation({ mutationFn: newAdvocacy });
  const qualitativeCountryMutation = useMutation({
    mutationFn: newQualitativeCountry,
  });
  const qualitativePeriodMutation = useMutation({
    mutationFn: newQualitativePeriod,
  });
  const qualitativeThematicAreaMutation = useMutation({
    mutationFn: newQualitativeThematicArea,
  });
  const advocacyMilestonesRangeMutation = useMutation({
    mutationFn: newAdvocacyMilestoneRange,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      title: Yup.string().required("Required"),
      duration_from: Yup.date().required("Required"),
      duration_to: Yup.date().required("Required"),
      staffNameId: Yup.string().required("Required"),
      thematicAreaId: Yup.string().required("Required"),
      countryId: Yup.array().required("Required"),
      beneficiary: Yup.string().required("Required"),
      objective: Yup.string().required("Required"),
      advocacyNeed: Yup.string().required("Required"),
      expectedResult: Yup.string().required("Required"),
      output: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const guid = new Guid();
        const saveAdvocacy = {
          id: id ? id : guid.toString(),
          createDate: new Date(),
          title: values.title,
          staffNameId: values.staffNameId,
          beneficiary: values.beneficiary,
          advocacyNeed: values.advocacyNeed,
          expectedResult: values.expectedResult,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          advocacyObjective: {
            createDate: new Date(),
            objective: values.objective,
          },
          advocacyOutput: {
            createDate: new Date(),
            output: values.output,
          },
        };
        const advocacy = await mutation.mutateAsync(saveAdvocacy);
        let qualitativeCountries = [];
        for (const country of values.countryId) {
          const qualitativeCountry = {
            id:
              "qualitativeCountryId" in country
                ? country.qualitativeCountryId
                : guid.toString(),
            createDate: new Date(),
            organizationUnitId: country.id,
            qualitativeTypeId: innovationQualitativeTypeId,
            qualitativeTypeItemId: advocacy.data.id,
          };
          qualitativeCountries.push(qualitativeCountry);
        }
        const qualitativePeriod = {
          createDate: new Date(),
          qualitativeTypeId: innovationQualitativeTypeId,
          qualitativeTypeItemId: advocacy.data.id,
          periodTo: values.duration_to,
          periodFrom: values.duration_from,
        };
        const qualitativeThematicArea = {
          createDate: new Date(),
          thematicAreaId: values.thematicAreaId,
          qualitativeTypeId: innovationQualitativeTypeId,
          qualitativeTypeItemId: advocacy.data.id,
        };
        const advocates = [];
        for (const milestone of milestonesArray) {
          const advocacyMilestone = {
            id: new Guid().toString(),
            createDate: new Date(),
            advocacyId: advocacy.data.id,
            milestone: milestone.milestone,
            yearId: milestone.yearId.lookupItemId,
            quarterId: milestone.quarterId.lookupItemId,
          };
          advocates.push(advocacyMilestone);
        }
        await qualitativeCountryMutation.mutateAsync(qualitativeCountries);
        await qualitativePeriodMutation.mutateAsync(qualitativePeriod);
        await qualitativeThematicAreaMutation.mutateAsync(
          qualitativeThematicArea
        );
        await advocacyMilestonesRangeMutation.mutateAsync(advocates);
        toast("Successfully Created an Advocacy", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getAdvocates"]);
        navigate(
          `/project/design-project/${processLevelItemId}/${processLevelTypeId}`
        );
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
        !isLoadingAdvocacyData &&
        !isErrorAdvocacyData &&
        !isLoadingQualitativePeriod &&
        !isErrorQualitativePeriod &&
        !isLoadingQualitativeThematicArea &&
        !isErrorQualitativeThematicArea &&
        !isLoadingQualitativeCountry &&
        !isErrorQualitativeCountry &&
        !isLoadingAdvocacyMilestones &&
        !isErrorAdvocacyMilestones
      ) {
        let countries = [];
        let milestones = [];
        for (const qualitativeCountryFind of QualitativeCountryData.data) {
          const result = amrefEntities.data.find(
            (obj) => obj.id === qualitativeCountryFind.organizationUnitId
          );
          if (result) {
            const newResult = {
              ...result,
              qualitativeCountryId: qualitativeCountryFind.id,
            };
            countries.push(newResult);
          }
        }
        for (const datum of AdvocacyMilestonesData.data) {
          let yearFetched;
          let quarterFetched;
          if (!isLoadingYearsData && !isErrorYearsData) {
            yearFetched = yearsData.data.find(
              (obj) => obj.lookupItemId === datum.yearId
            );
          }
          if (!isLoadingQuartersData && !isErrorQuartersData) {
            quarterFetched = quartersData.data.find(
              (obj) => obj.lookupItemId === datum.quarterId
            );
          }
          milestones.push({
            id: datum.id,
            milestone: datum.milestone,
            yearId: yearFetched,
            quarterId: quarterFetched,
          });
        }
        setMilestonesArray(milestones);
        formik.setValues({
          title: AdvocacyData.data.title,
          duration_from:
            QualitativePeriodData.data.length > 0
              ? new Date(QualitativePeriodData.data[0].periodFrom)
              : "",
          duration_to:
            QualitativePeriodData.data.length > 0
              ? new Date(QualitativePeriodData.data[0].periodTo)
              : "",
          staffNameId: AdvocacyData.data.staffNameId,
          thematicAreaId:
            QualitativeThematicAreaData.data.length > 0
              ? QualitativeThematicAreaData.data[0].thematicAreaId
              : "",
          countryId: countries && countries.length > 0 ? countries : [],
          beneficiary: AdvocacyData.data.beneficiary,
          objective: AdvocacyData.data.advocacyObjective.objective,
          advocacyNeed: AdvocacyData.data.advocacyNeed,
          expectedResult: AdvocacyData.data.expectedResult,
          output: AdvocacyData.data.advocacyOutput.output,
        });
      }
    }
    setCurrentFormValues();
  }, [
    AdvocacyData,
    isLoadingAdvocacyData,
    isErrorAdvocacyData,
    isLoadingQualitativePeriod,
    isErrorQualitativePeriod,
    isLoadingQualitativeThematicArea,
    isErrorQualitativeThematicArea,
    QualitativePeriodData,
    QualitativeThematicAreaData,
    QualitativeCountryData,
    isLoadingQualitativeCountry,
    isErrorQualitativeCountry,
    isLoadingAdvocacyMilestones,
    isErrorAdvocacyMilestones,
    AdvocacyMilestonesData,
    amrefEntities,
    isErrorQuartersData,
    isErrorYearsData,
    isLoadingQuartersData,
    isLoadingYearsData,
    quartersData,
    yearsData,
  ]);

  function removeMilestone(index) {
    const newItems = [...milestonesArray];
    newItems.splice(index, 1);
    setMilestonesArray(newItems);
  }

  const handleClick = (values) => {
    setMilestonesArray((current) => [...current, values]);
  };
  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container item spacing={2}>
        <Grid item md={12}>
          <TextField
            name="title"
            label="Title"
            value={formik.values.title}
            error={Boolean(formik.touched.title && formik.errors.title)}
            fullWidth
            helperText={formik.touched.title && formik.errors.title}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
        <Grid item md={4}>
          <DatePicker
            label="From"
            value={formik.values.duration_from}
            onChange={(value) =>
              formik.setFieldValue("duration_from", value, true)
            }
            renderInput={(params) => (
              <TextField
                error={Boolean(
                  formik.touched.duration_from && formik.errors.duration_from
                )}
                helperText={
                  formik.touched.duration_from && formik.errors.duration_from
                }
                margin="normal"
                name="duration_from"
                variant="outlined"
                fullWidth
                my={2}
                {...params}
              />
            )}
          />
        </Grid>
        <Grid item md={4}>
          <DatePicker
            label="To"
            value={formik.values.duration_to}
            onChange={(value) =>
              formik.setFieldValue("duration_to", value, true)
            }
            renderInput={(params) => (
              <TextField
                error={Boolean(
                  formik.touched.duration_to && formik.errors.duration_to
                )}
                helperText={
                  formik.touched.duration_to && formik.errors.duration_to
                }
                margin="normal"
                name="duration_to"
                variant="outlined"
                fullWidth
                my={2}
                {...params}
              />
            )}
          />
        </Grid>
        <Grid item md={4}>
          <TextField
            name="staffNameId"
            label="Lead/Staff Name"
            select
            value={formik.values.staffNameId}
            error={Boolean(
              formik.touched.staffNameId && formik.errors.staffNameId
            )}
            fullWidth
            helperText={formik.touched.staffNameId && formik.errors.staffNameId}
            onBlur={formik.handleBlur}
            onChange={(e) => {
              formik.handleChange(e);
            }}
            variant="outlined"
            my={2}
          >
            <MenuItem disabled value="">
              Select Staff Name
            </MenuItem>
            {!isLoadingStaffList && !isErrorStaffList
              ? staffListData.data.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.firstName} {option.lastName}
                  </MenuItem>
                ))
              : []}
          </TextField>
        </Grid>
        <Grid item md={4}>
          <TextField
            name="thematicAreaId"
            label="Thematic Area(s)"
            select
            value={formik.values.thematicAreaId}
            error={Boolean(
              formik.touched.thematicAreaId && formik.errors.thematicAreaId
            )}
            fullWidth
            helperText={
              formik.touched.thematicAreaId && formik.errors.thematicAreaId
            }
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            variant="outlined"
            my={2}
          >
            <MenuItem disabled value="">
              Select Thematic Area(s)
            </MenuItem>
            {!isLoadingThematicAreas && !isErrorThematicAreas
              ? ThematicAreas.data.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.name}({option.initial})
                  </MenuItem>
                ))
              : []}
          </TextField>
        </Grid>
        <Grid item md={4}>
          <Autocomplete
            id="countryId"
            multiple
            options={
              !isLoadingAmrefEntities && !isErrorAmrefEntities
                ? amrefEntities.data
                : []
            }
            getOptionLabel={(entity) => `${entity?.name}`}
            renderOption={(props, option) => {
              return (
                <li {...props} key={option.id}>
                  {option.name}
                </li>
              );
            }}
            onChange={(_, val) => formik.setFieldValue("countryId", val)}
            value={formik.values.countryId}
            renderInput={(params) => (
              <TextField
                {...params}
                error={Boolean(
                  formik.touched.countryId && formik.errors.countryId
                )}
                fullWidth
                helperText={formik.touched.countryId && formik.errors.countryId}
                label="Select Countries/entities of implementation"
                name="countryId"
                variant="outlined"
                my={2}
              />
            )}
          />
        </Grid>
        <Grid item md={12}>
          <TextField
            name="objective"
            label="What is the advocacy objective?"
            value={formik.values.objective}
            error={Boolean(formik.touched.objective && formik.errors.objective)}
            fullWidth
            helperText={formik.touched.objective && formik.errors.objective}
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
            name="beneficiary"
            label="Who are the target beneficiaries?"
            value={formik.values.beneficiary}
            error={Boolean(
              formik.touched.beneficiary && formik.errors.beneficiary
            )}
            fullWidth
            helperText={formik.touched.beneficiary && formik.errors.beneficiary}
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
            name="advocacyNeed"
            label="Why was this advocacy needed (in your country/context)? *this will serve as the baseline"
            value={formik.values.advocacyNeed}
            error={Boolean(
              formik.touched.advocacyNeed && formik.errors.advocacyNeed
            )}
            fullWidth
            helperText={
              formik.touched.advocacyNeed && formik.errors.advocacyNeed
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
            name="expectedResult"
            label="What are the expected results of the advocacy?"
            value={formik.values.expectedResult}
            error={Boolean(
              formik.touched.expectedResult && formik.errors.expectedResult
            )}
            fullWidth
            helperText={
              formik.touched.expectedResult && formik.errors.expectedResult
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
            name="output"
            label="Expected final concrete outputs at the end of the strategy (documents: e.g. standard, policy, guideline etc.)"
            value={formik.values.output}
            error={Boolean(formik.touched.output && formik.errors.output)}
            fullWidth
            helperText={formik.touched.output && formik.errors.output}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            variant="outlined"
            my={2}
            rows={3}
          />
        </Grid>
        <Grid item md={12}>
          <Card
            variant="outlined"
            style={{ borderStyle: "dashed", borderRadius: 1 }}
          >
            <Grid container spacing={12}>
              <Grid item md={12}>
                &nbsp;
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <ThemeProvider theme={theme}>
                  <Button
                    variant="contained"
                    color="neutral"
                    onClick={() => setOpenMilestoneModal(true)}
                  >
                    <AddIcon /> ADD MILESTONE
                  </Button>
                </ThemeProvider>
              </Grid>
            </Grid>
            <Grid container spacing={12}>
              <Grid item md={12}>
                <Paper>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell align="left">MILESTONE</TableCell>
                        <TableCell align="left">YEAR</TableCell>
                        <TableCell align="left">QUARTER</TableCell>
                        <TableCell align="left">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {milestonesArray.map((row, index) => (
                        <TableRow key={Math.random().toString(36)}>
                          <TableCell component="th" scope="row">
                            {row.milestone}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.yearId.lookupItemName}
                          </TableCell>
                          <TableCell component="th" scope="row">
                            {row.quarterId.lookupItemName}
                          </TableCell>
                          <TableCell align="left">
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => removeMilestone(index)}
                            >
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Grid>
            </Grid>
            <br />
          </Card>
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary" mt={3}>
        Save
      </Button>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openMilestoneModal}
        onClose={() => setOpenMilestoneModal(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">MILESTONES</DialogTitle>
        <DialogContent>
          <DialogContentText>ADD MILESTONE</DialogContentText>
          <AddMilestoneForm handleClick={handleClick} />
        </DialogContent>
      </Dialog>
    </form>
  );
};

const TechnicalAssistance = () => {
  let { processLevelItemId, processLevelTypeId, id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Advocacy" />
      <Typography variant="h3" gutterBottom display="inline">
        New TechnicalAssistance
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Design
        </Link>
        <Typography>New Technical Assistance</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <AdvocacyForm
                processLevelItemId={processLevelItemId}
                processLevelTypeId={processLevelTypeId}
                id={id}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};
export default TechnicalAssistance;
