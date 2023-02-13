import React from "react";
import { Grid } from "@mui/material";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import EnterQuantitativeResultField from "./EnterQuantitativeResultField";
import { number, object } from "yup";

const EnterQuantitativeResultsForm = ({ resultChainIndicators }) => {
  const fields = [];
  for (const resultChainIndicator of resultChainIndicators) {
    if (resultChainIndicator["resultChainAggregates"].length > 0) {
      for (const resultChainAggregate of resultChainIndicator[
        "resultChainAggregates"
      ]) {
        const field = {
          id: resultChainAggregate.id,
          name: resultChainAggregate.id,
          label: resultChainAggregate.id,
          initialValue: "",
          type: number().required(),
        };
        fields.push(field);
      }
    } else {
      const field = {
        id: resultChainIndicator.id,
        name: resultChainIndicator.id,
        label: resultChainIndicator.id,
        initialValue: "",
        type: number().required(),
      };
      fields.push(field);
    }
  }
  const initialValues = Object.fromEntries(
    fields.map((field) => [field.name, field.initialValue])
  );
  const SchemaObject = Object.fromEntries(
    fields.map((field) => [field.name, field.type])
  );
  const ValidationSchema = object().shape(SchemaObject);
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: ValidationSchema,
    onSubmit: async (values) => {
      try {
        console.log(values);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          direction="row"
          justifyContent="left"
          alignItems="left"
          spacing={6}
        >
          {resultChainIndicators.map((resultChainIndicator, i) => {
            return (
              <React.Fragment key={Math.random().toString(36)}>
                <Grid item md={1}>
                  {i}
                </Grid>
                <Grid item md={11}>
                  <EnterQuantitativeResultField
                    resultChainIndicator={resultChainIndicator}
                    formik={formik}
                  />
                </Grid>
              </React.Fragment>
            );
          })}
        </Grid>
      </form>
    </React.Fragment>
  );
};
export default EnterQuantitativeResultsForm;
