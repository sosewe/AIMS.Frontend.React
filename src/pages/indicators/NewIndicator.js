import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Chip,
  CircularProgress,
  Dialog,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getLookupMasterItemsByName } from "../../api/lookup";
import { Guid } from "../../utils/guid";
import {
  getAllIndicators,
  getIndicator,
  GetIndicatorsByIndicatorTypeIdAndIndicatorRelationshipTypeId,
  newIndicator,
} from "../../api/indicator";
import { getProgrammes } from "../../api/programmes";
import {
  GetUniqueSubThemesByThematicAreaId,
  GetUniqueThematicAreasByProgrammeId,
} from "../../api/programme-thematic-area-sub-theme";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { getAggregatesByName, getAllAggregates } from "../../api/aggregate";
import {
  getAggregateDisaggregates,
  getAllAggregateDisaggregates,
  getParentAggregateDisAggregateByAggregateId,
} from "../../api/aggregate-disaggregate";
import { getAttributeTypes } from "../../api/attribute-type";
import { saveIndicatorProgrammes } from "../../api/indicator-programme";
import { saveIndicatorThematicAreas } from "../../api/indicator-thematic-area";
import { saveIndicatorSubThemes } from "../../api/indicator-sub-theme";
import { saveIndicatorAggregates } from "../../api/indicator-aggregate";
import { saveIndicatorAttributeTypes } from "../../api/indicator-attribute-type";
import { getAllThematicAreas } from "../../api/thematic-area";
import { getAllSubThemes } from "../../api/sub-theme";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);
const Paper = styled(MuiPaper)(spacing);
const FormControl = styled(MuiFormControl)(spacing);

const theme = createTheme({
  palette: {
    neutral: {
      main: "#64748B",
      contrastText: "#fff",
    },
  },
});

const attributesTypeInitial = {
  attributeTypeId: [],
};

const aggregateInitial = {
  indicatorAggregateId: "",
  indicatorAggregateDisaggregateId: [],
  indicatorSecondaryAggregateId: "",
  indicatorSecondaryAggregateDisaggregateId: [],
};

const subThemeInitial = {
  indicatorProgrammeId: "",
  indicatorThematicAreaId: "",
  indicatorSubThemeId: "",
};

const initialValues = {
  name: "",
  code: "",
  indicatorTypeId: "",
  indicatorCalculationId: "",
  indicatorCalculationType: "",
  definition: "",
  indicatorMeasure: "",
  indicatorMeasureType: "",
  numeratorId: "",
  denominatorId: "",
  indicatorStatus: "",
  reference: "",
  indicatorRelationshipTypeId: "",
};

const AttributesTypeForm = ({
  handleClickAttributes,
  data,
  isLoading,
  isError,
}) => {
  const formik = useFormik({
    initialValues: attributesTypeInitial,
    validationSchema: Yup.object().shape({
      attributeTypeId: Yup.array().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleClickAttributes(values);
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

  const handleAttributeTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue("attributeTypeId", value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <FormControl fullWidth my={2} variant="outlined">
                <InputLabel id="attributeTypeId">
                  Attribute Type(Multiple)
                </InputLabel>
                <Select
                  labelId="attributeTypeId"
                  id="attributeTypeId"
                  multiple
                  value={formik.values.attributeTypeId}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleAttributeTypeChange(e);
                  }}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Attribute Type"
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
                    Attribute Type(Multiple)
                  </MenuItem>
                  {!isLoading && !isError
                    ? data.data.map((option) => (
                        <MenuItem key={option.id} value={option}>
                          {option.name}
                        </MenuItem>
                      ))
                    : []}
                </Select>
              </FormControl>
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

const AggregateDisAggregateForm = ({ handleClickAggregate }) => {
  const [aggregateId, setAggregateId] = useState();
  const [secondaryAggregateId, setSecondaryAggregateId] = useState();
  const { data, isLoading } = useQuery(
    ["getAggregatesByName", "Gender"],
    getAggregatesByName
  );
  const {
    data: aggregatesData,
    isLoading: isLoadingAggregates,
    isError,
  } = useQuery(["getAllAggregates"], getAllAggregates);
  const {
    data: aggregateDisaggregatesData,
    isLoading: isLoadingAggregateDisaggregates,
    isError: isErrorAggregateDisaggregates,
  } = useQuery(
    ["getAggregateDisaggregates", aggregateId],
    getAggregateDisaggregates,
    {
      enabled: !!aggregateId,
    }
  );

  const {
    data: secondaryAggregateDisaggregatesData,
    isLoading: isLoadingSecondaryAggregateDisaggregates,
    isError: isErrorSecondaryAggregateDisaggregates,
  } = useQuery(
    ["getParentAggregateDisAggregateByAggregateId", secondaryAggregateId],
    getParentAggregateDisAggregateByAggregateId,
    {
      enabled: !!secondaryAggregateId,
    }
  );
  const formik = useFormik({
    initialValues: aggregateInitial,
    validationSchema: Yup.object().shape({
      indicatorAggregateId: Yup.object().required("Required"),
      indicatorAggregateDisaggregateId: Yup.array().required("Required"),
      indicatorSecondaryAggregateId: Yup.object().required("Required"),
      indicatorSecondaryAggregateDisaggregateId:
        Yup.array().required("Required"),
    }),
    onSubmit: async (values, { resetForm, setSubmitting }) => {
      try {
        handleClickAggregate(values);
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

  const onSelectedAggregate = (e) => {
    setAggregateId(e.target.value.id);
  };

  const onSelectedSecondaryAggregate = (e) => {
    setSecondaryAggregateId(e.target.value.id);
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue("indicatorSecondaryAggregateDisaggregateId", value);
  };

  const handleAggregateDisAggregateChange = (event) => {
    const {
      target: { value },
    } = event;
    formik.setFieldValue("indicatorAggregateDisaggregateId", value);
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <TextField
                name="indicatorAggregateId"
                label="Aggregate"
                required
                select
                value={formik.values.indicatorAggregateId}
                error={Boolean(
                  formik.touched.indicatorAggregateId &&
                    formik.errors.indicatorAggregateId
                )}
                fullWidth
                helperText={
                  formik.touched.indicatorAggregateId &&
                  formik.errors.indicatorAggregateId
                }
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  onSelectedAggregate(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Aggregate
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
            <Grid item md={3}>
              <FormControl fullWidth my={2} variant="outlined">
                <InputLabel id="indicatorAggregateDisaggregateId">
                  Aggregate Disaggregate(Multiple)
                </InputLabel>
                <Select
                  labelId="indicatorAggregateDisaggregateId"
                  id="indicatorAggregateDisaggregateId"
                  multiple
                  value={formik.values.indicatorAggregateDisaggregateId}
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleAggregateDisAggregateChange(e);
                  }}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Aggregate Disaggregate"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value.disaggregate.id}
                          label={value.disaggregate.name}
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem disabled value="">
                    Aggregate Disaggregate(Multiple)
                  </MenuItem>
                  {!isLoadingAggregateDisaggregates &&
                  !isErrorAggregateDisaggregates
                    ? aggregateDisaggregatesData.data.map((option) => (
                        <MenuItem key={option.id} value={option}>
                          {option.disaggregate.name}
                        </MenuItem>
                      ))
                    : []}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={3}>
              <TextField
                name="indicatorSecondaryAggregateId"
                label="Secondary Aggregate"
                required
                select
                value={formik.values.indicatorSecondaryAggregateId}
                error={Boolean(
                  formik.touched.indicatorSecondaryAggregateId &&
                    formik.errors.indicatorSecondaryAggregateId
                )}
                fullWidth
                helperText={
                  formik.touched.indicatorSecondaryAggregateId &&
                  formik.errors.indicatorSecondaryAggregateId
                }
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  onSelectedSecondaryAggregate(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Secondary Aggregate
                </MenuItem>
                {!isLoadingAggregates && !isError
                  ? aggregatesData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.name}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={3}>
              <FormControl fullWidth my={2} variant="outlined">
                <InputLabel id="indicatorSecondaryAggregateDisaggregateId">
                  Secondary Aggregate Disaggregate(Multiple)
                </InputLabel>
                <Select
                  labelId="indicatorSecondaryAggregateDisaggregateId"
                  id="indicatorSecondaryAggregateDisaggregateId"
                  multiple
                  value={
                    formik.values.indicatorSecondaryAggregateDisaggregateId
                  }
                  onChange={(e) => {
                    formik.handleChange(e);
                    handleChange(e);
                  }}
                  input={
                    <OutlinedInput
                      id="select-multiple-chip"
                      label="Select Secondary Aggregate Disaggregate"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value.disaggregate.id}
                          label={value.disaggregate.name}
                        />
                      ))}
                    </Box>
                  )}
                >
                  <MenuItem disabled value="">
                    Secondary Aggregate Disaggregate(Multiple)
                  </MenuItem>
                  {!isLoadingSecondaryAggregateDisaggregates &&
                  !isErrorSecondaryAggregateDisaggregates
                    ? secondaryAggregateDisaggregatesData.data.map((option) => (
                        <MenuItem key={option.id} value={option}>
                          {option.disaggregate.name}
                        </MenuItem>
                      ))
                    : []}
                </Select>
              </FormControl>
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

const IndicatorProgrammesForm = ({ handleClick }) => {
  const [indicatorProgrammeId, setIndicatorProgrammeId] = useState();
  const [thematicAreaId, setThematicAreaId] = useState();

  const { data: programmesData, isLoading: isLoadingProgrammes } = useQuery(
    ["getProgrammes"],
    getProgrammes
  );
  const {
    data: thematicAreasData,
    isLoading: isLoadingThematicAreas,
    isError,
  } = useQuery(
    ["GetUniqueThematicAreasByProgrammeId", indicatorProgrammeId],
    GetUniqueThematicAreasByProgrammeId,
    { enabled: !!indicatorProgrammeId }
  );
  const {
    data: subThemesData,
    isLoading: isLoadingSubThemes,
    isError: isErrorSubThemes,
  } = useQuery(
    [
      "GetUniqueSubThemesByThematicAreaId",
      indicatorProgrammeId,
      thematicAreaId,
    ],
    GetUniqueSubThemesByThematicAreaId,
    { enabled: !!indicatorProgrammeId && !!thematicAreaId }
  );
  const formik = useFormik({
    initialValues: subThemeInitial,
    validationSchema: Yup.object().shape({
      indicatorProgrammeId: Yup.object().required("Required"),
      indicatorThematicAreaId: Yup.object().required("Required"),
      indicatorSubThemeId: Yup.object().required("Required"),
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

  const onProgrammeSelected = (e) => {
    setIndicatorProgrammeId(e.target.value.id);
    formik.setFieldValue("indicatorThematicAreaId", "");
    formik.setFieldValue("indicatorSubThemeId", "");
  };

  const onThematicAreaSelected = (e) => {
    setThematicAreaId(e.target.value.id);
    formik.setFieldValue("indicatorSubThemeId", "");
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item md={3}>
              <TextField
                name="indicatorProgrammeId"
                label="Programme"
                required
                select
                value={formik.values.indicatorProgrammeId}
                error={Boolean(
                  formik.touched.indicatorProgrammeId &&
                    formik.errors.indicatorProgrammeId
                )}
                fullWidth
                helperText={
                  formik.touched.indicatorProgrammeId &&
                  formik.errors.indicatorProgrammeId
                }
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  onProgrammeSelected(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Programme
                </MenuItem>
                {!isLoadingProgrammes
                  ? programmesData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.code + " - " + option.name}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={3}>
              <TextField
                name="indicatorThematicAreaId"
                label="Thematic Area"
                required
                select
                value={formik.values.indicatorThematicAreaId}
                error={Boolean(
                  formik.touched.indicatorThematicAreaId &&
                    formik.errors.indicatorThematicAreaId
                )}
                fullWidth
                helperText={
                  formik.touched.indicatorThematicAreaId &&
                  formik.errors.indicatorThematicAreaId
                }
                onBlur={formik.handleBlur}
                onChange={(e) => {
                  formik.handleChange(e);
                  onThematicAreaSelected(e);
                }}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Thematic Area
                </MenuItem>
                {!isLoadingThematicAreas && !isError
                  ? thematicAreasData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.code + " - " + option.name}
                      </MenuItem>
                    ))
                  : []}
              </TextField>
            </Grid>
            <Grid item md={3}>
              <TextField
                name="indicatorSubThemeId"
                label="Sub Theme"
                required
                select
                value={formik.values.indicatorSubThemeId}
                error={Boolean(
                  formik.touched.indicatorSubThemeId &&
                    formik.errors.indicatorSubThemeId
                )}
                fullWidth
                helperText={
                  formik.touched.indicatorSubThemeId &&
                  formik.errors.indicatorSubThemeId
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                variant="outlined"
                my={2}
              >
                <MenuItem disabled value="">
                  Select Sub Theme
                </MenuItem>
                {!isLoadingSubThemes && !isErrorSubThemes
                  ? subThemesData.data.map((option) => (
                      <MenuItem key={option.id} value={option}>
                        {option.code + " - " + option.name}
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

const NewIndicatorForm = () => {
  let { id } = useParams();
  const [open, setOpen] = useState(false);
  const [openAggregate, setOpenAggregate] = useState(false);
  const [openAttributeTypes, setOpenAttributeTypes] = useState(false);
  const [isNumberMeasure, setIsNumberMeasure] = useState(false);
  const [subThemesArray, setSubThemesArray] = useState([]);
  let siId;
  let numeratorId;
  let denominatorId;
  const navigate = useNavigate();
  const [aggregateDisAggregateArray, setAggregateDisAggregateArray] = useState(
    []
  );
  const [attributesTypesArray, setAttributesTypesArray] = useState([]);
  // fetch indicator for update
  const {
    data: IndicatorData,
    isLoading,
    isError,
    error,
  } = useQuery(["getIndicator", id], getIndicator, { enabled: !!id });
  // fetch all Programmes
  const { data: programmesData, isLoading: isLoadingProgrammes } = useQuery(
    ["getProgrammes"],
    getProgrammes
  );
  // fetch all Thematic Areas
  const { data: thematicAreasData, isLoading: isLoadingThematicAreas } =
    useQuery(["getAllThematicAreas"], getAllThematicAreas);
  // fetch all Sub-Themes
  const { data: subThemesData, isLoading: isLoadingSubThemes } = useQuery(
    ["getAllSubThemes"],
    getAllSubThemes
  );
  const {
    data: allAggregateDisaggregate,
    isLoading: isLoadingAggregateDisaggregate,
  } = useQuery(["getAllAggregateDisaggregates"], getAllAggregateDisaggregates);
  // fetch IndicatorType Lookup
  const {
    data: indicatorTypeData,
    isLoading: isLoadingIndicatorType,
    isError: isErrorIndicatorType,
  } = useQuery(["IndicatorType", "IndicatorType"], getLookupMasterItemsByName, {
    refetchOnWindowFocus: false,
  });
  if (!isLoadingIndicatorType && !isErrorIndicatorType) {
    const SIIndicatorType = indicatorTypeData.data.find(
      (obj) => obj.lookupItemName === "SI"
    );
    if (SIIndicatorType) {
      siId = SIIndicatorType.lookupItemId;
    }
  }
  // fetch IndicatorMeasure Lookup
  const { data: indicatorMeasureData, isLoading: isLoadingIndicatorMeasure } =
    useQuery(
      ["IndicatorMeasure", "IndicatorMeasure"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );
  // fetch YesNo Lookup
  const { data: yesNoData, isLoading: isLoadingYesNo } = useQuery(
    ["YesNo", "YesNo"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  // IndicatorCalculationType
  const {
    data: dataIndicatorCalculationType,
    isLoading: isLoadingIndicatorCalculationType,
  } = useQuery(
    ["IndicatorCalculationType", "IndicatorCalculationType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  // IndicatorMeasureType
  const {
    data: IndicatorMeasureTypeData,
    isLoading: isLoadingIndicatorMeasureType,
    isError: isErrorIndicatorMeasureType,
  } = useQuery(
    ["IndicatorMeasureType", "IndicatorMeasureType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  // IndicatorStatus
  const { data: IndicatorStatusData, isLoading: isLoadingIndicatorStatus } =
    useQuery(
      ["IndicatorStatus", "IndicatorStatus"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );
  // IndicatorRelationshipType
  const {
    data: IndicatorRelationshipType,
    isLoading: isLoadingIndicatorRelationshipType,
    isError: isErrorIndicatorRelationshipType,
  } = useQuery(
    ["IndicatorRelationshipType", "IndicatorRelationshipType"],
    getLookupMasterItemsByName,
    {
      refetchOnWindowFocus: false,
    }
  );
  // fetch getAttributeTypes
  const {
    data: dataAttributeTypes,
    isLoading: isLoadingAttributeTypes,
    isError: isErrorAttributeTypes,
  } = useQuery(["getAttributeTypes"], getAttributeTypes);
  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }
  if (
    !isLoadingIndicatorRelationshipType &&
    !isErrorIndicatorRelationshipType &&
    IndicatorRelationshipType
  ) {
    const denominator = IndicatorRelationshipType.data.find(
      (obj) => obj.lookupItemName === "Denominator"
    );
    const numerator = IndicatorRelationshipType.data.find(
      (obj) => obj.lookupItemName === "Numerator"
    );
    if (denominator) {
      denominatorId = denominator.lookupItemId;
    }
    if (numerator) {
      numeratorId = numerator.lookupItemId;
    }
  }
  const {
    data: NumeratorData,
    isLoading: isLoadingNumerator,
    isError: isErrorNumerator,
  } = useQuery(
    [
      "GetIndicatorsByIndicatorTypeIdAndIndicatorRelationshipTypeId",
      siId,
      numeratorId,
    ],
    GetIndicatorsByIndicatorTypeIdAndIndicatorRelationshipTypeId,
    { enabled: !!siId && !!numeratorId }
  );
  const {
    data: DenominatorData,
    isLoading: isLoadingDenominator,
    isError: isErrorDenominator,
  } = useQuery(
    [
      "GetIndicatorsByIndicatorTypeIdAndIndicatorRelationshipTypeId",
      siId,
      denominatorId,
    ],
    GetIndicatorsByIndicatorTypeIdAndIndicatorRelationshipTypeId,
    { enabled: !!siId && !!denominatorId }
  );
  const mutation = useMutation({ mutationFn: newIndicator });
  const mutationIndicatorProgramme = useMutation({
    mutationFn: saveIndicatorProgrammes,
  });
  const mutationIndicatorThematicArea = useMutation({
    mutationFn: saveIndicatorThematicAreas,
  });
  const mutationIndicatorSubTheme = useMutation({
    mutationFn: saveIndicatorSubThemes,
  });
  const mutationIndicatorAggregate = useMutation({
    mutationFn: saveIndicatorAggregates,
  });
  const mutationIndicatorAttributeType = useMutation({
    mutationFn: saveIndicatorAttributeTypes,
  });

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Required"),
      code: Yup.string().required("Required"),
      indicatorTypeId: Yup.object().required("Required"),
      definition: Yup.string().required("Required"),
      indicatorMeasure: Yup.object().when("indicatorTypeId", {
        is: (val) => val && val.lookupItemName !== "SI",
        then: Yup.object().required("Indicator Measure Is Required"),
      }),
      indicatorCalculationId: Yup.string().when("indicatorMeasure", {
        is: (val) => val && val.lookupItemName === "Percentage(%)",
        then: Yup.string().required("Indicator Calculation Is Required"),
      }),
      numeratorId: Yup.string().when("indicatorMeasure", {
        is: (val) => val && val.lookupItemName === "Percentage(%)",
        then: Yup.string().required("Must enter Numerator"),
      }),
      // numeratorId: Yup.string().required("Required"),
      denominatorId: Yup.string().when("indicatorMeasure", {
        is: (val) => val && val.lookupItemName === "Percentage(%)",
        then: Yup.string().required("Must enter Denominator"),
      }),
      indicatorCalculationType: Yup.string().when("indicatorMeasure", {
        is: (val) => val && val.lookupItemName === "Percentage(%)",
        then: Yup.string().required("Indicator Calculation Type Is Required"),
      }),
      indicatorMeasureType: Yup.object().when("indicatorTypeId", {
        is: (val) => val && val.lookupItemName !== "SI",
        then: Yup.object().required("Indicator Measure Type Is Required"),
      }),
      indicatorRelationshipTypeId: Yup.string().when("indicatorTypeId", {
        is: (val) => val && val.lookupItemName === "SI",
        then: Yup.string().required("Indicator Relationship Type Is Required"),
      }),
      indicatorStatus: Yup.string().when("indicatorTypeId", {
        is: (val) => val && val.lookupItemName !== "SI",
        then: Yup.string().required("Indicator Status Is Required"),
      }),
      reference: Yup.string().when("indicatorTypeId", {
        is: (val) => val && val.lookupItemName !== "SI",
        then: Yup.string().required("Reference Is Required"),
      }),
    }),
    onSubmit: async (values) => {
      values.createDate = new Date();
      values.indicatorMeasure = values.indicatorMeasure
        ? values.indicatorMeasure.lookupItemId
        : "";
      values.indicatorMeasureType = values.indicatorMeasureType
        ? values.indicatorMeasureType.lookupItemId
        : "";
      values.indicatorTypeId = values.indicatorTypeId
        ? values.indicatorTypeId.lookupItemId
        : "";
      if (id) {
        values.id = id;
      } else {
        values.id = new Guid().toString();
        values.updateDate = new Date();
      }
      try {
        const indicator = await mutation.mutateAsync(values);
        // Programme
        const programmes = [];
        const thematicAreas = [];
        const subThemes = [];
        for (const programmeThematicAreaSubTheme of subThemesArray) {
          programmes.push(programmeThematicAreaSubTheme.indicatorProgrammeId);
          thematicAreas.push(
            programmeThematicAreaSubTheme.indicatorThematicAreaId
          );
          thematicAreas[thematicAreas.length - 1].programmeId =
            programmeThematicAreaSubTheme.indicatorProgrammeId.id;
          subThemes.push(programmeThematicAreaSubTheme.indicatorSubThemeId);
          subThemes[subThemes.length - 1].programmeId =
            programmeThematicAreaSubTheme.indicatorProgrammeId.id;
          subThemes[subThemes.length - 1].thematicAreaId =
            programmeThematicAreaSubTheme.indicatorThematicAreaId.id;
        }
        const key = "id";

        const arrayUniqueProgramme = [
          ...new Map(programmes.map((item) => [item[key], item])).values(),
        ];
        const arrayUniqueThematicArea = [
          ...new Map(thematicAreas.map((item) => [item[key], item])).values(),
        ];
        const arrayUniqueSubTheme = [
          ...new Map(subThemes.map((item) => [item[key], item])).values(),
        ];
        const indicatorProgrammes = [];
        const indicatorThematicAreas = [];
        const indicatorSubThemes = [];
        const indicatorAggregates = [];
        for (const arrayUniqueProgrammeElement of arrayUniqueProgramme) {
          const indicatorProgramme = {
            createDate: new Date(),
            indicatorId: indicator.data.id,
            programmeId: arrayUniqueProgrammeElement.id,
          };
          indicatorProgrammes.push(indicatorProgramme);
        }
        await mutationIndicatorProgramme.mutateAsync(indicatorProgrammes);
        // Thematic Area
        for (const arrayUniqueThematicAreaElement of arrayUniqueThematicArea) {
          const indicatorThematicArea = {
            createDate: new Date(),
            indicatorId: indicator.data.id,
            thematicAreaId: arrayUniqueThematicAreaElement.id,
            programmeId: arrayUniqueThematicAreaElement.programmeId,
          };
          indicatorThematicAreas.push(indicatorThematicArea);
        }
        await mutationIndicatorThematicArea.mutateAsync(indicatorThematicAreas);
        // Sub Theme
        for (const arrayUniqueSubThemeElement of arrayUniqueSubTheme) {
          const indicatorSubTheme = {
            createDate: new Date(),
            indicatorId: indicator.data.id,
            subThemeId: arrayUniqueSubThemeElement.id,
            thematicAreaId: arrayUniqueSubThemeElement.thematicAreaId,
            programmeId: arrayUniqueSubThemeElement.programmeId,
          };
          indicatorSubThemes.push(indicatorSubTheme);
        }
        await mutationIndicatorSubTheme.mutateAsync(indicatorSubThemes);
        // Attribute Type
        const indicatorAttributeTypes = [];
        for (const selectedAttributeType of attributesTypesArray) {
          const indicatorAttributeType = {
            createDate: new Date(),
            attributeTypeId: selectedAttributeType.id,
            indicatorId: indicator.data.id,
          };
          indicatorAttributeTypes.push(indicatorAttributeType);
        }
        await mutationIndicatorAttributeType.mutateAsync(
          indicatorAttributeTypes
        );
        // Indicator Aggregates
        for (const selectedAggregateDisaggregate of aggregateDisAggregateArray) {
          for (const selectedAggregateDisaggregateElement of selectedAggregateDisaggregate.indicatorAggregateDisaggregateId) {
            const aggregateDisaggregate = {
              createDate: new Date(),
              void: false,
              indicatorId: indicator.data.id,
              aggregateDisaggregateId: selectedAggregateDisaggregateElement.id,
              isPrimary: true,
            };
            indicatorAggregates.push(aggregateDisaggregate);
          }
          for (const selectedAggregateDisaggregateElement of selectedAggregateDisaggregate.indicatorSecondaryAggregateDisaggregateId) {
            const aggregateDisaggregate = {
              createDate: new Date(),
              void: false,
              indicatorId: indicator.data.id,
              aggregateDisaggregateId: selectedAggregateDisaggregateElement.id,
              isPrimary: false,
            };
            indicatorAggregates.push(aggregateDisaggregate);
          }
        }
        await mutationIndicatorAggregate.mutateAsync(indicatorAggregates);
        toast("Successfully Created an Indicator", {
          type: "success",
        });
        navigate("/indicator/indicators");
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
      let indicatorMeasure;
      let indicatorTypeId;
      let indicatorMeasureType;
      if (!isLoading && !isLoadingIndicatorMeasure && IndicatorData) {
        indicatorMeasure = indicatorMeasureData.data.find(
          (obj) => obj.lookupItemId === IndicatorData.data.indicatorMeasure
        );
      }
      if (!isLoading && !isLoadingIndicatorType && IndicatorData) {
        indicatorTypeId = indicatorTypeData.data.find(
          (obj) => obj.lookupItemId === IndicatorData.data.indicatorTypeId
        );
      }
      if (
        !isLoadingIndicatorMeasureType &&
        !isErrorIndicatorMeasureType &&
        IndicatorMeasureTypeData &&
        IndicatorData
      ) {
        indicatorMeasureType = IndicatorMeasureTypeData.data.find(
          (obj) => obj.lookupItemId === IndicatorData.data.indicatorMeasureType
        );
      }
      if (IndicatorData) {
        formik.setValues({
          name: IndicatorData.data.name,
          code: IndicatorData.data.code,
          indicatorTypeId: indicatorTypeId ? indicatorTypeId : "",
          indicatorMeasure: indicatorMeasure ? indicatorMeasure : "",
          definition: IndicatorData.data.definition,
          indicatorCalculationId: IndicatorData.data.indicatorCalculationId
            ? IndicatorData.data.indicatorCalculationId
            : "",
          numeratorId: IndicatorData.data.numeratorId
            ? IndicatorData.data.numeratorId
            : "",
          denominatorId: IndicatorData.data.denominatorId
            ? IndicatorData.data.denominatorId
            : "",
          indicatorRelationshipTypeId: IndicatorData.data
            .indicatorRelationshipTypeId
            ? IndicatorData.data.indicatorRelationshipTypeId
            : "",
          indicatorStatus: IndicatorData.data.indicatorStatus
            ? IndicatorData.data.indicatorStatus
            : "",
          indicatorMeasureType: indicatorMeasureType
            ? indicatorMeasureType
            : "",
          indicatorCalculationType: IndicatorData.data.indicatorCalculationType
            ? IndicatorData.data.indicatorCalculationType
            : "",
          reference: IndicatorData.data.reference,
        });
        for (const indicatorAttributeType of IndicatorData.data
          .indicatorAttributeTypes) {
          const val =
            !isLoadingAttributeTypes &&
            dataAttributeTypes.data.find(
              (obj) => obj.id === indicatorAttributeType.attributeTypeId
            );
          const res = attributesTypesArray.filter((obj) => obj.id === val.id);
          if (val && res.length === 0) {
            setAttributesTypesArray((current) => [...current, val]);
          }
        }

        for (const indicatorSubTheme of IndicatorData.data.indicatorSubThemes) {
          const val =
            !isLoadingProgrammes &&
            programmesData.data.find(
              (obj) => obj.id === indicatorSubTheme.programmeId
            );
          const valThematicArea =
            !isLoadingThematicAreas &&
            thematicAreasData.data.find(
              (obj) => obj.id === indicatorSubTheme.thematicAreaId
            );
          const valSubTheme =
            !isLoadingSubThemes &&
            subThemesData.data.find(
              (obj) => obj.id === indicatorSubTheme.subThemeId
            );
          const indicatorProgrammeVal = {
            indicatorProgrammeId: val,
            indicatorThematicAreaId: valThematicArea,
            indicatorSubThemeId: valSubTheme,
          };
          const res = subThemesArray.filter(
            (obj) =>
              obj.indicatorSubThemeId.id ===
              indicatorProgrammeVal.indicatorSubThemeId.id
          );
          if (
            res.length === 0 &&
            indicatorProgrammeVal.indicatorProgrammeId &&
            indicatorProgrammeVal.indicatorSubThemeId &&
            indicatorProgrammeVal.indicatorThematicAreaId
          ) {
            setSubThemesArray((current) => [...current, indicatorProgrammeVal]);
          }
        }

        setAggregateDisAggregateArray([]);
        for (const indicatorAggregate of IndicatorData.data
          .indicatorAggregates) {
          const selectedIndicatorAggregate =
            !isLoadingAggregateDisaggregate &&
            allAggregateDisaggregate.data.find(
              (obj) => obj.id === indicatorAggregate.aggregateDisaggregateId
            );
          const indicatorAggregateDisaggregates = {
            indicatorAggregateDisaggregateId: [],
            indicatorAggregateId: "",
            indicatorSecondaryAggregateDisaggregateId: [],
            indicatorSecondaryAggregateId: "",
          };
          if (indicatorAggregate.isPrimary) {
            indicatorAggregateDisaggregates.indicatorAggregateDisaggregateId.push(
              selectedIndicatorAggregate
            );
            indicatorAggregateDisaggregates.indicatorAggregateId =
              selectedIndicatorAggregate.aggregate;
          } else {
            indicatorAggregateDisaggregates.indicatorAggregateDisaggregateId.push(
              selectedIndicatorAggregate
            );
            indicatorAggregateDisaggregates.indicatorSecondaryAggregateId =
              selectedIndicatorAggregate.aggregate;
          }
          setAggregateDisAggregateArray((current) => [
            ...current,
            indicatorAggregateDisaggregates,
          ]);
        }
      }
    }
    setCurrentFormValues();
  }, [
    IndicatorData,
    indicatorMeasureData,
    isLoadingIndicatorMeasure,
    isLoadingAttributeTypes,
    dataAttributeTypes,
    isLoading,
    isError,
    IndicatorMeasureTypeData,
    isLoadingIndicatorMeasureType,
    isErrorIndicatorMeasureType,
  ]);

  const handleClick = async (values) => {
    const res = subThemesArray.find(
      (obj) =>
        obj &&
        obj.indicatorProgrammeId.id === values.indicatorProgrammeId.id &&
        obj.indicatorThematicAreaId.id === values.indicatorThematicAreaId.id &&
        obj.indicatorSubThemeId.id === values.indicatorSubThemeId.id
    );
    if (!res) {
      setSubThemesArray((current) => [...current, values]);
      setOpen(false);
      if (id) {
        // Sub Theme
        const indicatorSubThemes = [];
        const indicatorSubTheme = {
          createDate: new Date(),
          indicatorId: id,
          subThemeId: values.indicatorSubThemeId.id,
          thematicAreaId: values.indicatorThematicAreaId.id,
          programmeId: values.indicatorProgrammeId.id,
        };
        indicatorSubThemes.push(indicatorSubTheme);
        await mutationIndicatorSubTheme.mutateAsync(indicatorSubThemes);
      }
    } else {
      toast("Duplicate SubTheme Selected", {
        type: "error",
      });
    }
  };

  const handleClickAggregate = (values) => {
    setAggregateDisAggregateArray((current) => [...current, values]);
    setOpenAggregate(false);
    if (id) {
    }
  };

  const handleClickAttributes = async (values) => {
    for (const value of values.attributeTypeId) {
      const res = attributesTypesArray.filter((obj) => obj.id === value.id);
      if (res.length > 0) {
        toast("Duplicate Attribute Type Selected", {
          type: "error",
        });
        return;
      }
    }
    setAttributesTypesArray((current) => [
      ...current,
      ...values.attributeTypeId,
    ]);
    setOpenAttributeTypes(false);

    // Attribute Type
    if (id) {
      const indicatorAttributeTypes = [];
      for (const selectedAttributeType of values.attributeTypeId) {
        const indicatorAttributeType = {
          createDate: new Date(),
          attributeTypeId: selectedAttributeType.id,
          indicatorId: id,
        };
        indicatorAttributeTypes.push(indicatorAttributeType);
      }
      await mutationIndicatorAttributeType.mutateAsync(indicatorAttributeTypes);
    }
  };

  const removeSubTheme = (row) => {
    setSubThemesArray((current) =>
      current.filter(
        (subTheme) =>
          subTheme.indicatorSubThemeId.id !== row.indicatorSubThemeId.id ||
          subTheme.indicatorThematicAreaId.id !== row.indicatorThematicAreaId.id
      )
    );
  };

  const removeAggregateDisaggregate = (row, isPrimary) => {
    if (isPrimary) {
      setAggregateDisAggregateArray((current) =>
        current.filter((aggregateDisaggregate) => {
          const res =
            aggregateDisaggregate.indicatorAggregateDisaggregateId.filter(
              (obj) =>
                obj.aggregateId !== row.aggregateId ||
                obj.disaggregateId !== row.disaggregateId
            );
          return (aggregateDisaggregate.indicatorAggregateDisaggregateId = res);
        })
      );
    } else {
      setAggregateDisAggregateArray((current) =>
        current.filter((aggregateDisaggregate) => {
          const res =
            aggregateDisaggregate.indicatorSecondaryAggregateDisaggregateId.filter(
              (obj) =>
                obj.aggregateId !== row.aggregateId ||
                obj.disaggregateId !== row.disaggregateId
            );
          return (aggregateDisaggregate.indicatorSecondaryAggregateDisaggregateId =
            res);
        })
      );
    }
  };

  function removeAttributeType(row) {
    setAttributesTypesArray((current) =>
      current.filter((obj) => obj.id !== row.id)
    );
  }

  const onChangeIndicatorMeasure = (e) => {
    const indicatorMeasure = e.target.value;
    if (indicatorMeasure.lookupItemName === "Number(#)") {
      setIsNumberMeasure(true);
    } else if (indicatorMeasure.lookupItemName === "Percentage(%)") {
      setIsNumberMeasure(false);
    } else {
      setIsNumberMeasure(false);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card mb={12}>
        <CardContent>
          {formik.isSubmitting ? (
            <Box display="flex" justifyContent="center" my={6}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Grid container spacing={12}>
                <Grid item md={12}>
                  <Typography variant="h3" gutterBottom display="inline">
                    NEW INDICATOR
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={12}>
                  <TextField
                    name="name"
                    label="Indicator Name"
                    value={formik.values.name}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText={formik.touched.name && formik.errors.name}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item md={4}>
                  <TextField
                    name="code"
                    label="Indicator Code"
                    value={formik.values.code}
                    error={Boolean(formik.touched.code && formik.errors.code)}
                    fullWidth
                    helperText={formik.touched.code && formik.errors.code}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="indicatorTypeId"
                    label="Indicator Type"
                    select
                    value={formik.values.indicatorTypeId}
                    error={Boolean(
                      formik.touched.indicatorTypeId &&
                        formik.errors.indicatorTypeId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorTypeId &&
                      formik.errors.indicatorTypeId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Type
                    </MenuItem>
                    {!isLoadingIndicatorType
                      ? indicatorTypeData.data.map((option) => (
                          <MenuItem key={option.lookupItemId} value={option}>
                            {option.lookupItemName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="indicatorMeasure"
                    label="Indicator Measure"
                    select
                    value={formik.values.indicatorMeasure}
                    error={Boolean(
                      formik.touched.indicatorMeasure &&
                        formik.errors.indicatorMeasure
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorMeasure &&
                      formik.errors.indicatorMeasure
                    }
                    onBlur={formik.handleBlur}
                    onChange={(e) => {
                      formik.handleChange(e);
                      onChangeIndicatorMeasure(e);
                    }}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Measure
                    </MenuItem>
                    {!isLoadingIndicatorMeasure
                      ? indicatorMeasureData.data.map((option) => (
                          <MenuItem key={option.lookupItemId} value={option}>
                            {option.lookupItemName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="indicatorMeasureType"
                    label="Indicator Measure Type"
                    select
                    value={formik.values.indicatorMeasureType}
                    error={Boolean(
                      formik.touched.indicatorMeasureType &&
                        formik.errors.indicatorMeasureType
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorMeasureType &&
                      formik.errors.indicatorMeasureType
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Measure Type
                    </MenuItem>
                    {!isLoadingIndicatorMeasureType
                      ? IndicatorMeasureTypeData.data.map((option) => (
                          <MenuItem key={option.lookupItemId} value={option}>
                            {option.lookupItemName}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="indicatorRelationshipTypeId"
                    label="Indicator Relationship Type"
                    select
                    value={formik.values.indicatorRelationshipTypeId}
                    error={Boolean(
                      formik.touched.indicatorRelationshipTypeId &&
                        formik.errors.indicatorRelationshipTypeId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorRelationshipTypeId &&
                      formik.errors.indicatorRelationshipTypeId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Relationship Type
                    </MenuItem>
                    {!isLoadingIndicatorRelationshipType &&
                    !isErrorIndicatorRelationshipType
                      ? IndicatorRelationshipType.data.map((option) => (
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
              </Grid>
              <TextField
                name="definition"
                label="Definition"
                value={formik.values.definition}
                error={Boolean(
                  formik.touched.definition && formik.errors.definition
                )}
                fullWidth
                helperText={
                  formik.touched.definition && formik.errors.definition
                }
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                multiline
                variant="outlined"
                rows={3}
                my={2}
              />
              <Grid container spacing={2}>
                <Grid item md={3}>
                  <TextField
                    name="indicatorCalculationId"
                    label="Indicator Calculation"
                    select
                    value={formik.values.indicatorCalculationId}
                    error={Boolean(
                      formik.touched.indicatorCalculationId &&
                        formik.errors.indicatorCalculationId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorCalculationId &&
                      formik.errors.indicatorCalculationId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    disabled={isNumberMeasure}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        backgroundColor: "#e9ecef",
                      },
                    }}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Calculation
                    </MenuItem>
                    {!isLoadingYesNo
                      ? yesNoData.data.map((option) => (
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
                <Grid item md={3}>
                  <TextField
                    name="indicatorCalculationType"
                    label="Indicator Calculation Type"
                    select
                    value={formik.values.indicatorCalculationType}
                    error={Boolean(
                      formik.touched.indicatorCalculationType &&
                        formik.errors.indicatorCalculationType
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorCalculationType &&
                      formik.errors.indicatorCalculationType
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    disabled={isNumberMeasure}
                    sx={{
                      "& .MuiInputBase-input.Mui-disabled": {
                        backgroundColor: "#e9ecef",
                      },
                    }}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Calculation Type
                    </MenuItem>
                    {!isLoadingIndicatorCalculationType
                      ? dataIndicatorCalculationType.data.map((option) => (
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
                <Grid item md={3}>
                  <TextField
                    name="numeratorId"
                    label="Indicator Numerator"
                    select
                    value={formik.values.numeratorId}
                    defaultValue={""}
                    error={Boolean(
                      formik.touched.numeratorId && formik.errors.numeratorId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.numeratorId && formik.errors.numeratorId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Numerator
                    </MenuItem>
                    {!isLoadingNumerator && !isErrorNumerator
                      ? NumeratorData.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="denominatorId"
                    label="Indicator Denominator"
                    select
                    value={formik.values.denominatorId}
                    defaultValue={""}
                    error={Boolean(
                      formik.touched.denominatorId &&
                        formik.errors.denominatorId
                    )}
                    fullWidth
                    helperText={
                      formik.touched.denominatorId &&
                      formik.errors.denominatorId
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Denominator
                    </MenuItem>
                    {!isLoadingDenominator && !isErrorDenominator
                      ? DenominatorData.data.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.name}
                          </MenuItem>
                        ))
                      : []}
                  </TextField>
                </Grid>
                <Grid item md={3}>
                  <TextField
                    name="indicatorStatus"
                    label="Indicator Status"
                    select
                    value={formik.values.indicatorStatus}
                    error={Boolean(
                      formik.touched.indicatorStatus &&
                        formik.errors.indicatorStatus
                    )}
                    fullWidth
                    helperText={
                      formik.touched.indicatorStatus &&
                      formik.errors.indicatorStatus
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                  >
                    <MenuItem disabled value="">
                      Select Indicator Status
                    </MenuItem>
                    {!isLoadingIndicatorStatus
                      ? IndicatorStatusData.data.map((option) => (
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
                    name="reference"
                    label="Reference"
                    value={formik.values.reference}
                    error={Boolean(
                      formik.touched.reference && formik.errors.reference
                    )}
                    fullWidth
                    helperText={
                      formik.touched.reference && formik.errors.reference
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
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
                            onClick={() => setOpen(true)}
                          >
                            <AddIcon /> ADD SUB-THEME
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
                                <TableCell>PROGRAMME</TableCell>
                                <TableCell align="right">
                                  THEMATIC AREA
                                </TableCell>
                                <TableCell align="right">SUB THEME</TableCell>
                                <TableCell align="right">Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {subThemesArray.map((row) => (
                                <TableRow
                                  key={
                                    row.indicatorThematicAreaId.id +
                                    row.indicatorSubThemeId.id
                                  }
                                >
                                  <TableCell component="th" scope="row">
                                    {row.indicatorProgrammeId.name}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.indicatorThematicAreaId.code +
                                      "-" +
                                      row.indicatorThematicAreaId.name}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.indicatorSubThemeId.code +
                                      "-" +
                                      row.indicatorSubThemeId.name}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => removeSubTheme(row)}
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
                            onClick={() => setOpenAggregate(true)}
                          >
                            <AddIcon /> ADD AGGREGATE DISAGGREGATES
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
                                <TableCell>AGGREGATE</TableCell>
                                <TableCell align="right">
                                  DISAGGREGATE
                                </TableCell>
                                <TableCell align="right">
                                  PRIMARY/SECONDARY
                                </TableCell>
                                <TableCell align="right">Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {aggregateDisAggregateArray.map((row) =>
                                row.indicatorAggregateDisaggregateId.map(
                                  (agg) => (
                                    <TableRow key={agg.id}>
                                      <TableCell component="th" scope="row">
                                        {agg.aggregate.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {agg.disaggregate.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        Primary
                                      </TableCell>
                                      <TableCell align="right">
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() =>
                                            removeAggregateDisaggregate(
                                              agg,
                                              true
                                            )
                                          }
                                        >
                                          <DeleteIcon />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              )}
                              {aggregateDisAggregateArray.map((row) =>
                                row.indicatorSecondaryAggregateDisaggregateId.map(
                                  (agg) => (
                                    <TableRow key={agg.id}>
                                      <TableCell component="th" scope="row">
                                        {agg.aggregate.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        {agg.disaggregate.name}
                                      </TableCell>
                                      <TableCell align="right">
                                        Secondary
                                      </TableCell>
                                      <TableCell align="right">
                                        <Button
                                          variant="contained"
                                          color="primary"
                                          onClick={() =>
                                            removeAggregateDisaggregate(
                                              agg,
                                              false
                                            )
                                          }
                                        >
                                          <DeleteIcon />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              )}
                            </TableBody>
                          </Table>
                        </Paper>
                      </Grid>
                    </Grid>
                    <br />
                  </Card>
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
                            onClick={() => setOpenAttributeTypes(true)}
                          >
                            <AddIcon /> ADD ATTRIBUTE TYPES
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
                                <TableCell>NAME</TableCell>
                                <TableCell align="right">DATA TYPE</TableCell>
                                <TableCell align="right">Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {attributesTypesArray.map((row) => (
                                <TableRow key={row.id}>
                                  <TableCell component="th" scope="row">
                                    {row.name}
                                  </TableCell>
                                  <TableCell align="right">
                                    {row.attributeDataType.dataType}
                                  </TableCell>
                                  <TableCell align="right">
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      onClick={() => removeAttributeType(row)}
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
                Save changes
              </Button>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          PROGRAMME/THEMATIC-AREA/SUB-THEME
        </DialogTitle>
        <DialogContent>
          <DialogContentText>ADD SUB-THEME</DialogContentText>
          <IndicatorProgrammesForm handleClick={handleClick} />
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="lg"
        open={openAggregate}
        onClose={() => setOpenAggregate(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">AGGREGATE/DISAGGREGATE</DialogTitle>
        <DialogContent>
          <DialogContentText>ADD AGGREGATE/DISAGGREGATE</DialogContentText>
          <AggregateDisAggregateForm
            handleClickAggregate={handleClickAggregate}
          />
        </DialogContent>
      </Dialog>
      <Dialog
        fullWidth={true}
        maxWidth="md"
        open={openAttributeTypes}
        onClose={() => setOpenAttributeTypes(false)}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">ATTRIBUTE TYPES</DialogTitle>
        <DialogContent>
          <DialogContentText>ADD ATTRIBUTE TYPE</DialogContentText>
          <AttributesTypeForm
            handleClickAttributes={handleClickAttributes}
            data={dataAttributeTypes}
            isLoading={isLoadingAttributeTypes}
            isError={isErrorAttributeTypes}
          />
        </DialogContent>
      </Dialog>
    </form>
  );
};

const NewIndicator = () => {
  return (
    <React.Fragment>
      <Helmet title="New Indicator" />
      <Typography variant="h3" gutterBottom display="inline">
        New Indicator
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/indicators">
          Indicators
        </Link>
        <Typography>New Indicator</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <NewIndicatorForm />
    </React.Fragment>
  );
};
export default NewIndicator;
