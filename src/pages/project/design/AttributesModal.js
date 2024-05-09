import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Autocomplete as MuiAutocomplete,
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
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../../utils/guid";
import { toast } from "react-toastify";
import { Edit2, Plus, Trash as TrashIcon } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteResultChainById,
  getResultChainAttributeByIndicatorId,
  saveResultChainAttributes,
} from "../../../api/result-chain-attribute";
import { DataGrid } from "@mui/x-data-grid";
import { getAttributeTypeById } from "../../../api/attribute-type";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";
import {
  deletePrimaryResultChainAttribute,
  newPrimaryResultChainAttribute,
  newSinglePrimaryResultChainAttribute,
} from "../../../api/primary-result-chain-attribute";
import { newSecondaryResultChainAttribute } from "../../../api/secondary-result-chain-attribute";

const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AttributesModal = ({
  resultChainIndicatorId,
  processLevelItemId,
  processLevelTypeId,
  indicatorAttributeTypes,
}) => {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const queryClient = useQueryClient();
  const [attributeResponseOptions, setAttributeResponseOptions] = useState([]);
  const [
    secondaryAttributeResponseOptions,
    setSecondaryAttributeResponseOptions,
  ] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [hasSecondary, setHasSecondary] = useState(false);
  const {
    data: ResultChainAttribute,
    isLoading: isLoadingResultChainAttribute,
    isError: isErrorResultChainAttribute,
  } = useQuery(
    ["getResultChainAttributeByIndicatorId", resultChainIndicatorId],
    getResultChainAttributeByIndicatorId,
    { enabled: !!resultChainIndicatorId }
  );
  const mutationResultChainAttribute = useMutation({
    mutationFn: saveResultChainAttributes,
  });
  const mutationPrimaryResultChainAttribute = useMutation({
    mutationFn: newPrimaryResultChainAttribute,
  });
  const mutationSecondaryResultChainAttribute = useMutation({
    mutationFn: newSecondaryResultChainAttribute,
  });
  const mutationSingleResultChainAttribute = useMutation({
    mutationFn: newSinglePrimaryResultChainAttribute,
  });
  const attributeTypes = indicatorAttributeTypes;
  const formik = useFormik({
    initialValues: {
      attributeType: "",
      attributeValues: [],
      secondaryAttributeType: "",
      secondaryAttributeValues: [],
    },
    validationSchema: Yup.object().shape({
      attributeType: Yup.object().required("Required"),
      attributeValues: Yup.array().min(
        attributeResponseOptions > 0 ? 1 : 0,
        "Please select attribute values"
      ),
      secondaryAttributeType: Yup.object().when("attributeType", {
        is: () => hasSecondary,
        then: Yup.object().required("Secondary Attribute Type Is Required"),
      }),
      secondaryAttributeValues: Yup.array().min(
        secondaryAttributeResponseOptions > 0 ? 1 : 0,
        "Please select secondary attribute values"
      ),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const resultChainAttributes = {
          id: new Guid().toString(),
          createDate: new Date(),
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          resultChainIndicatorId: resultChainIndicatorId,
          selectedResultChains: [],
        };
        const primaryResultChainAttributes = [];
        const secondaryResultChainAttributes = [];
        const res = await mutationResultChainAttribute.mutateAsync(
          resultChainAttributes
        );
        const resultChainAttributeId = res.data.id;
        if (hasSecondary) {
          for (const attributeValue of values.attributeValues) {
            const primaryResultChainAttribute = {
              createDate: new Date(),
              resultChainAttributeId: resultChainAttributeId,
              attributeTypeId: attributeValue.attributeTypeId,
              attributeOptionsId: attributeValue.id,
            };
            const primaryResultChainAttributeResult =
              await mutationSingleResultChainAttribute.mutateAsync(
                primaryResultChainAttribute
              );
            for (const secondaryAttributeValue of values.secondaryAttributeValues) {
              const secondaryResultChainAttribute = {
                createDate: new Date(),
                primaryResultChainAttributeId:
                  primaryResultChainAttributeResult.data.id,
                attributeTypeId: secondaryAttributeValue.attributeTypeId,
                attributeOptionsId: secondaryAttributeValue.id,
              };
              secondaryResultChainAttributes.push(
                secondaryResultChainAttribute
              );
            }
          }
        } else {
          for (const attributeValue of values.attributeValues) {
            const primaryResultChainAttribute = {
              createDate: new Date(),
              resultChainAttributeId: resultChainAttributeId,
              attributeTypeId: attributeValue.attributeTypeId,
              attributeOptionsId: attributeValue.id,
            };
            primaryResultChainAttributes.push(primaryResultChainAttribute);
          }
          await mutationPrimaryResultChainAttribute.mutateAsync(
            primaryResultChainAttributes
          );
        }
        await mutationSecondaryResultChainAttribute.mutateAsync(
          secondaryResultChainAttributes
        );
        toast("Successfully Created Attributes", {
          type: "success",
        });
        resetForm();
        await queryClient.invalidateQueries([
          "getResultChainAttributeByIndicatorId",
        ]);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  const { refetch, isError, error, isLoading } = useQuery(
    ["deletePrimaryResultChainAttribute", id],
    deletePrimaryResultChainAttribute,
    { enabled: false }
  );

  const handleAddSecondary = () => {
    setHasSecondary(true);
  };
  const handleClickOpen = (params) => {
    setOpen(true);
    setId(params.row.id);
  };
  const handleDeleteAttribute = async () => {
    try {
      await refetch();
      setOpen(false);
      await queryClient.invalidateQueries([
        "getResultChainAttributeByIndicatorId",
      ]);
    } catch (error) {
      toast(error.response.data, {
        type: "error",
      });
    }
  };

  function handleClose() {
    setOpen(false);
  }

  function GetPrimaryAttribute(params) {
    const attributeId = params.value;
    const result = useQuery(
      ["getAttributeTypeById", attributeId],
      getAttributeTypeById,
      {
        enabled: !!attributeId,
      }
    );
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  function GetAttributeResponseOptionName(params) {
    const attributeResponseOptionId = params.value;
    const result = useQuery(
      ["getAttributeResponseOptionById", attributeResponseOptionId],
      getAttributeResponseOptionById
    );
    if (result && result.data) {
      return result.data.data.responseOption;
    }
  }

  function SecondaryAttributeOption({ attributeOptionsId }) {
    const { data } = useQuery(
      ["getAttributeResponseOptionById", attributeOptionsId],
      getAttributeResponseOptionById
    );
    return data ? data.data.responseOption : "";
  }

  function GetSecondaryAttributeOptionsNames(params) {
    const secondaries = params.value;
    let stringVal = "";

    for (const secondary of secondaries) {
      const responseOption = SecondaryAttributeOption({
        attributeOptionsId: secondary.attributeOptionsId,
      });
      stringVal += responseOption;
    }

    return stringVal;
  }

  if (isError && !isLoading) {
    toast(error.response.data, {
      type: "error",
    });
  }

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={6}>
          <Grid item md={6}>
            <Autocomplete
              id="attributeType"
              autoHighlight
              options={attributeTypes}
              getOptionLabel={(attrType) => {
                return attrType ? `${attrType?.attributeType?.name}` : "";
              }}
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option?.attributeType?.name}
                  </li>
                );
              }}
              onChange={(_, val) => {
                if (val) {
                  formik.setFieldValue("attributeType", val);
                  formik.setFieldValue("attributeValues", []);
                  setAttributeResponseOptions(
                    val.attributeType.attributeResponseOptions
                  );
                }
              }}
              value={formik.values.attributeType}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(
                    formik.touched.attributeType && formik.errors.attributeType
                  )}
                  fullWidth
                  helperText={
                    formik.touched.attributeType && formik.errors.attributeType
                  }
                  label="AttributeType"
                  name="attributeType"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={5}>
            <Autocomplete
              id="attributeValues"
              multiple
              options={attributeResponseOptions}
              getOptionLabel={(indicatorAttributeType) =>
                `${indicatorAttributeType?.responseOption}`
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option?.responseOption}
                  </li>
                );
              }}
              onChange={(_, val) =>
                formik.setFieldValue("attributeValues", val)
              }
              value={formik.values.attributeValues}
              disabled={attributeResponseOptions.length > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(
                    formik.touched.attributeValues &&
                      formik.errors.attributeValues
                  )}
                  fullWidth
                  helperText={
                    formik.touched.attributeValues &&
                    formik.errors.attributeValues
                  }
                  label="Attribute Values"
                  name="attributeValues"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={1}>
            <Button
              startIcon={<Plus />}
              size="small"
              mt={3}
              onClick={() => handleAddSecondary()}
            ></Button>
          </Grid>
          {hasSecondary && (
            <React.Fragment>
              <Grid item md={6}>
                <Autocomplete
                  id="secondaryAttributeType"
                  autoHighlight
                  options={attributeTypes}
                  getOptionLabel={(attrType) => {
                    return attrType ? `${attrType?.attributeType?.name}` : "";
                  }}
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option?.attributeType?.name}
                      </li>
                    );
                  }}
                  onChange={(_, val) => {
                    if (val) {
                      formik.setFieldValue("secondaryAttributeType", val);
                      formik.setFieldValue("secondaryAttributeValues", []);
                      setSecondaryAttributeResponseOptions(
                        val.attributeType.attributeResponseOptions
                      );
                    }
                  }}
                  value={formik.values.secondaryAttributeType}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(
                        formik.touched.secondaryAttributeType &&
                          formik.errors.secondaryAttributeType
                      )}
                      fullWidth
                      helperText={
                        formik.touched.secondaryAttributeType &&
                        formik.errors.secondaryAttributeType
                      }
                      label="Secondary Attribute Type"
                      name="secondaryAttributeType"
                      variant="outlined"
                      my={2}
                    />
                  )}
                />
              </Grid>
              <Grid item md={5}>
                <Autocomplete
                  id="secondaryAttributeValues"
                  multiple
                  options={secondaryAttributeResponseOptions}
                  getOptionLabel={(indicatorAttributeType) =>
                    `${indicatorAttributeType?.responseOption}`
                  }
                  renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option?.responseOption}
                      </li>
                    );
                  }}
                  onChange={(_, val) =>
                    formik.setFieldValue("secondaryAttributeValues", val)
                  }
                  value={formik.values.secondaryAttributeValues}
                  disabled={
                    secondaryAttributeResponseOptions.length > 0 ? false : true
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      error={Boolean(
                        formik.touched.secondaryAttributeValues &&
                          formik.errors.secondaryAttributeValues
                      )}
                      fullWidth
                      helperText={
                        formik.touched.secondaryAttributeValues &&
                        formik.errors.secondaryAttributeValues
                      }
                      label="Secondary Attribute Values"
                      name="secondaryAttributeValues"
                      variant="outlined"
                      my={2}
                    />
                  )}
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <Button type="submit" variant="contained" color="primary" mt={3}>
          Save changes
        </Button>
      </form>
      <br />
      <Card mb={6}>
        <CardContent pb={1}>
          <Paper>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rowsPerPageOptions={[5, 10, 25]}
                rows={
                  isLoadingResultChainAttribute || isErrorResultChainAttribute
                    ? []
                    : ResultChainAttribute
                    ? ResultChainAttribute.data.length > 0
                      ? ResultChainAttribute.data[0]
                          .primaryResultChainAttributes
                      : []
                    : []
                }
                columns={[
                  {
                    field: "attributeTypeId",
                    headerName: "Primary Attribute",
                    editable: false,
                    flex: 1,
                    renderCell: GetPrimaryAttribute,
                  },
                  {
                    field: "attributeOptionsId",
                    headerName: "Primary Attribute Response Option",
                    editable: false,
                    flex: 1,
                    renderCell: GetAttributeResponseOptionName,
                  },
                  {
                    field: "secondaryResultChainAttributes",
                    headerName: "Secondary Attribute",
                    editable: false,
                    flex: 1,
                    renderCell: GetSecondaryAttributeOptionsNames,
                  },
                  {
                    field: "action",
                    headerName: "Action",
                    editable: false,
                    flex: 1,
                    renderCell: (params) => (
                      <>
                        <Button
                          startIcon={<TrashIcon />}
                          size="small"
                          onClick={() => handleClickOpen(params)}
                        ></Button>
                      </>
                    ),
                  },
                ]}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                loading={isLoadingResultChainAttribute}
                getRowHeight={() => "auto"}
              />
            </div>
          </Paper>
        </CardContent>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Attribute</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Attribute?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAttribute} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="error" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
export default AttributesModal;
