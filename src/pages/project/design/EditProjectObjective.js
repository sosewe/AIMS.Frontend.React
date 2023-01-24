import React, { useEffect } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Grid,
  TextField as MuiTextField,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getProjectObjectiveById,
  newProjectObjectives,
} from "../../../api/project-objectives";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const initialValues = {
  objective: "",
};

const EditProjectObjective = ({ objectiveId, handleClick }) => {
  const { data, isLoading, isError } = useQuery(
    ["getProjectObjectiveById", objectiveId],
    getProjectObjectiveById,
    { enabled: !!objectiveId }
  );
  const mutation = useMutation({ mutationFn: newProjectObjectives });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({
      objective: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        data.data.objective = values.objective;
        await mutation.mutateAsync(data.data);
        handleClick();
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  useEffect(() => {
    function setCurrentFormValues() {
      if (!isLoading && !isError) {
        formik.setValues({
          objective: data.data.objective,
        });
      }
    }
    setCurrentFormValues();
  }, [data, isLoading, isError]);

  return (
    <Card mb={12}>
      <CardContent>
        <Grid container spacing={12}>
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
                      rows={7}
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
                      Edit Objective
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default EditProjectObjective;
