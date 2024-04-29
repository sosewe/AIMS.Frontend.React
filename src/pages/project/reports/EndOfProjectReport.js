import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CircularProgress,
  Divider as MuiDivider,
  Grid,
  Link,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getEndOfProjectBrief,
  saveEndOfProjectBrief,
  uploadDCAReportingFile,
} from "../../../api/internal-reporting";
import * as Yup from "yup";
import useKeyCloakAuth from "../../../hooks/useKeyCloakAuth";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Button = styled(MuiButton)(spacing);

const EndOfProjectReport = ({ processLevelItemId }) => {
  const user = useKeyCloakAuth();
  const [submitDisabled, setSubmitDisabled] = useState(false);
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const path = protocol + "//" + hostname;

  const mutation = useMutation({ mutationFn: uploadDCAReportingFile });
  const endOfProjectBriefMutation = useMutation({
    mutationFn: saveEndOfProjectBrief,
  });

  const { isLoading, isError, data } = useQuery(
    ["getEndOfProjectBrief", processLevelItemId],
    getEndOfProjectBrief,
    {
      enabled: !!processLevelItemId,
    }
  );
  const formik = useFormik({
    initialValues: {
      filePath: "",
      fileName: "",
    },
    validationSchema: Yup.object().shape({
      filePath: Yup.string().required("Required"),
      fileName: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        values.userId = user.sub;
        values.processLevelItemId = processLevelItemId;
        await endOfProjectBriefMutation.mutateAsync(values);
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  const onSelectedFile = (event) => {
    formik.setFieldValue("file", event.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      if (formik.values.file) {
        const response = await mutation.mutateAsync(formik.values.file);
        if (response.status === 200) {
          if (response.data && response.data.length > 0) {
            await formik.setFieldValue("filePath", response.data[0].path);
            await formik.setFieldValue(
              "fileName",
              response.data[0].originalFileName
            );
          }
          toast("Successfully Uploaded File", {
            type: "success",
          });
        }
      } else {
        toast("Please select a file", {
          type: "error",
        });
      }
    } catch (e) {
      toast("An error occurred while uploading the file", {
        type: "error",
      });
    }
  };

  useEffect(() => {
    if (!isLoading && !isError && data) {
      if (data.data.length > 0) {
        formik.setFieldValue("filePath", data.data[0].filePath);
        formik.setFieldValue("fileName", data.data[0].fileName);
        setSubmitDisabled(true);
      }
    }
  }, [isLoading, isError, data]);

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
                    END OF PROJECT BRIEF
                  </Typography>
                </Grid>
              </Grid>
              <Grid container spacing={6}>
                <Grid item md={4}>
                  <TextField
                    name="filePath"
                    label="File Path"
                    value={formik.values.filePath}
                    error={Boolean(
                      formik.touched.filePath && formik.errors.filePath
                    )}
                    fullWidth
                    helperText={
                      formik.touched.filePath && formik.errors.filePath
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    disabled={true}
                  />
                </Grid>
                <Grid item md={4}>
                  <TextField
                    name="fileName"
                    label="File Name"
                    required
                    value={formik.values.fileName}
                    error={Boolean(
                      formik.touched.fileName && formik.errors.fileName
                    )}
                    fullWidth
                    helperText={
                      formik.touched.fileName && formik.errors.fileName
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    my={2}
                    disabled={true}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={6}>
                <Grid item md={4}>
                  <TextField
                    name="file"
                    fullWidth
                    onChange={(e) => {
                      onSelectedFile(e);
                    }}
                    variant="outlined"
                    type="file"
                  />
                </Grid>
                <Grid item md={4}>
                  <Button
                    type="button"
                    variant="contained"
                    sx={{
                      fontWeight: "bolder",
                      backgroundColor: "#333333",
                      "&:hover": {
                        background: "#333333",
                        color: "white",
                      },
                    }}
                    onClick={uploadFile}
                    disabled={submitDisabled}
                  >
                    <CloudUploadIcon /> &nbsp; Upload
                  </Button>
                </Grid>
              </Grid>

              <Grid container spacing={6}>
                <Grid item md={4}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    mt={3}
                    disabled={submitDisabled}
                  >
                    Save End of Project Brief
                  </Button>
                </Grid>

                <Grid item md={4}>
                  <Link
                    href={`${path}${process.env.REACT_APP_INTERNAL_REPORTING}${formik.values.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Download
                  </Link>
                </Grid>
              </Grid>
            </>
          )}
        </CardContent>
      </Card>
    </form>
  );
};
export default EndOfProjectReport;
