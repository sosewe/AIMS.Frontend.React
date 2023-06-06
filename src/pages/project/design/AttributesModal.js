import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Autocomplete as MuiAutocomplete,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  Paper as MuiPaper,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Guid } from "../../../utils/guid";
import { toast } from "react-toastify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getResultChainAttributeByIndicatorId,
  saveResultChainAttributes,
} from "../../../api/result-chain-attribute";
import { DataGrid } from "@mui/x-data-grid";
import { getAttributeTypeById } from "../../../api/attribute-type";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";

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
  const queryClient = useQueryClient();
  const [attributeResponseOptions, setAttributeResponseOptions] = useState([]);
  const [pageSize, setPageSize] = useState(5);
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
  const attributeTypes = indicatorAttributeTypes;
  const formik = useFormik({
    initialValues: {
      attributeType: "",
      attributeValues: [],
    },
    validationSchema: Yup.object().shape({
      attributeType: Yup.object().required("Required"),
      attributeValues: Yup.array().min(
        attributeResponseOptions > 0 ? 1 : 0,
        "Please select attribute values"
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
          selectedResultChainAttributes: [],
        };
        for (let b = 0; b < values.attributeValues.length; b++) {
          resultChainAttributes.selectedResultChainAttributes.push({
            attributeId: values.attributeValues[b].attributeTypeId,
            attributeOptionsId: values.attributeValues[b].id,
          });
        }
        await mutationResultChainAttribute.mutateAsync(resultChainAttributes);
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

  function GetAttributeName(params) {
    const attributeId = params.value;
    const result = useQuery(
      ["getAttributeTypeById", attributeId],
      getAttributeTypeById
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
          <Grid item md={6}>
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
                    ? ResultChainAttribute.data
                    : []
                }
                columns={[
                  {
                    field: "attributeId",
                    headerName: "Attribute Type",
                    editable: false,
                    flex: 1,
                    valueGetter: GetAttributeName,
                  },
                  {
                    field: "attributeOptionsId",
                    headerName: "Attribute Response Option",
                    editable: false,
                    flex: 1,
                    valueGetter: GetAttributeResponseOptionName,
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
    </React.Fragment>
  );
};
export default AttributesModal;
