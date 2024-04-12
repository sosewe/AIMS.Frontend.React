import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TextField as MuiTextField,
  Button,
  Box,
  CircularProgress,
} from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getLocationBasedDCA,
  locationBasedDCA,
  uploadDCAReportingFile,
} from "../../../api/internal-reporting";
import { useParams } from "react-router-dom";
import { Guid } from "../../../utils/guid";
import useKeyCloakAuth from "../../../hooks/useKeyCloakAuth";

const TextField = styled(MuiTextField)(spacing);

const LocationTable = ({
  locationData,
  processLevelItemId,
  implementationYearId,
}) => {
  let { id } = useParams();
  const user = useKeyCloakAuth();
  const [filePath, setFilePath] = useState();
  const [fileName, setFileName] = useState();
  const [disableEdit, setDisableEdit] = useState(false);

  const { isLoading, isError, data } = useQuery(
    ["getLocationBasedDCA", processLevelItemId, implementationYearId],
    getLocationBasedDCA
  );

  const mutation = useMutation({ mutationFn: uploadDCAReportingFile });
  const mutationSaveDCA = useMutation({ mutationFn: locationBasedDCA });
  const formik = useFormik({
    initialValues: {
      child_M: "",
      child_F: "",
      youth_M: "",
      youth_F: "",
      adults_M: "",
      adults_F: "",
      comments: "",
      file: "",
    },
    validationSchema: Yup.object().shape({
      child_M: Yup.string().required("Required"),
      child_F: Yup.string().required("Required"),
      youth_M: Yup.string().required("Required"),
      youth_F: Yup.string().required("Required"),
      adults_M: Yup.string().required("Required"),
      adults_F: Yup.string().required("Required"),
      comments: Yup.string().required("Required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        if (!fileName || !filePath) {
          toast("Please upload a document", {
            type: "error",
          });
          return;
        }
        setSubmitting(true);
        const InData = {
          AdultsF: values.adults_F,
          AdultsM: values.adults_M,
          ChildF: values.child_F,
          ChildM: values.child_M,
          comments: values.comments,
          YouthF: values.youth_F,
          YouthM: values.youth_M,
          filePath,
          fileName,
          processLevelItemId,
          ImplementingYearId: implementationYearId,
          AdministrativeUnit: locationData[0].location,
          OriginalAdultsF: calculateTotal("adults_F"),
          OriginalAdultsM: calculateTotal("adults_M"),
          OriginalChildF: calculateTotal("child_F"),
          OriginalChildM: calculateTotal("child_M"),
          OriginalYouthF: calculateTotal("youth_F"),
          OriginalYouthM: calculateTotal("youth_M"),
          CreateDate: new Date(),
          UserId: user.sub,
        };
        InData.id = new Guid().toString();
        await mutationSaveDCA.mutateAsync(InData);
        setSubmitting(false);
        toast("Successfully Create DCA", {
          type: "success",
        });
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  const calculateTotal = (column) => {
    let total = 0;
    locationData.forEach((data) => {
      total += Number(data[column]);
    });
    return total;
  };

  const returnFinalReach = (total, columnName) => {
    const val = formik.values[columnName];
    if (total && val) {
      return total - val;
    }
    return 0;
  };

  const onSelectedFile = (event) => {
    formik.setFieldValue("file", event.target.files[0]);
  };

  const uploadFile = async () => {
    try {
      if (formik.values.file) {
        const response = await mutation.mutateAsync(formik.values.file);
        if (response.status === 200) {
          if (response.data && response.data.length > 0) {
            setFilePath(response.data[0].path);
            setFileName(response.data[0].originalFileName);
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
    if (!isLoading && !isError) {
      console.log(data);
      const locationDCAData = data.data.filter(
        (obj) => obj.administrativeUnit === locationData[0].location
      );
      if (locationDCAData.length > 0) {
        formik.setFieldValue("child_M", locationDCAData[0].childM);
        formik.setFieldValue("child_F", locationDCAData[0].childF);
        formik.setFieldValue("youth_F", locationDCAData[0].youthF);
        formik.setFieldValue("youth_M", locationDCAData[0].youthM);
        formik.setFieldValue("adults_M", locationDCAData[0].adultsM);
        formik.setFieldValue("adults_F", locationDCAData[0].adultsF);
        formik.setFieldValue("comments", locationDCAData[0].comments);
        setDisableEdit(true);
      }
    }
  }, [isLoading, isLoading]);

  return (
    <React.Fragment>
      <form onSubmit={formik.handleSubmit}>
        {formik.isSubmitting ? (
          <Box display="flex" justifyContent="center" my={6}>
            <CircularProgress />
          </Box>
        ) : (
          <Table size="small" aria-label="grouped table">
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Administrative Unit Name
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Indicator Name
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Cumulative
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={2}
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Child
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={2}
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Youth
                </TableCell>
                <TableCell
                  align="center"
                  colSpan={2}
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Adults
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                ></TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                ></TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                ></TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  M
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  F
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  M
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  F
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  M
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  F
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {locationData.map((data, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {data.location}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {data.indicator}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {Number(data.cumulative) === 1 ? "True" : "False"}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {data.child_M}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {data.child_F}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {data.youth_M}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {data.youth_F}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {data.adults_M}
                    </TableCell>
                    <TableCell
                      sx={{ border: "1px solid #000", textAlign: "center" }}
                    >
                      {data.adults_F}
                    </TableCell>
                  </TableRow>
                );
              })}
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Original Total
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  &nbsp;
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  &nbsp;
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {calculateTotal("child_M")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {calculateTotal("child_F")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {calculateTotal("youth_M")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {calculateTotal("youth_F")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {calculateTotal("adults_M")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {calculateTotal("adults_F")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Adjustment
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  &nbsp;
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  &nbsp;
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  <TextField
                    name="child_M"
                    label="Child M"
                    value={formik.values.child_M}
                    error={Boolean(
                      formik.touched.child_M && formik.errors.child_M
                    )}
                    fullWidth
                    helperText={formik.touched.child_M && formik.errors.child_M}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    disabled={disableEdit}
                  />
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  <TextField
                    name="child_F"
                    label="Child F"
                    value={formik.values.child_F}
                    error={Boolean(
                      formik.touched.child_F && formik.errors.child_F
                    )}
                    fullWidth
                    helperText={formik.touched.child_F && formik.errors.child_F}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    disabled={disableEdit}
                  />
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  <TextField
                    name="youth_M"
                    label="Youth M"
                    value={formik.values.youth_M}
                    error={Boolean(
                      formik.touched.youth_M && formik.errors.youth_M
                    )}
                    fullWidth
                    helperText={formik.touched.youth_M && formik.errors.youth_M}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    disabled={disableEdit}
                  />
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  <TextField
                    name="youth_F"
                    label="Youth F"
                    value={formik.values.youth_F}
                    error={Boolean(
                      formik.touched.youth_F && formik.errors.youth_F
                    )}
                    fullWidth
                    helperText={formik.touched.youth_F && formik.errors.youth_F}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    disabled={disableEdit}
                  />
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  <TextField
                    name="adults_M"
                    label="Adults M"
                    value={formik.values.adults_M}
                    error={Boolean(
                      formik.touched.adults_M && formik.errors.adults_M
                    )}
                    fullWidth
                    helperText={
                      formik.touched.adults_M && formik.errors.adults_M
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    disabled={disableEdit}
                  />
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  <TextField
                    name="adults_F"
                    label="Adults F"
                    value={formik.values.adults_F}
                    error={Boolean(
                      formik.touched.adults_F && formik.errors.adults_F
                    )}
                    fullWidth
                    helperText={
                      formik.touched.adults_F && formik.errors.adults_F
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    variant="outlined"
                    disabled={disableEdit}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Location Final Reach
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  &nbsp;
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  &nbsp;
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {returnFinalReach(calculateTotal("child_M"), "child_M")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {returnFinalReach(calculateTotal("child_F"), "child_F")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {returnFinalReach(calculateTotal("youth_M"), "youth_M")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {returnFinalReach(calculateTotal("youth_F"), "youth_F")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {returnFinalReach(calculateTotal("adults_M"), "adults_M")}
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  {returnFinalReach(calculateTotal("adults_F"), "adults_F")}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  TEXT(comment)
                </TableCell>
                <TableCell
                  colSpan={8}
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  <TextField
                    name="comments"
                    label="Comments"
                    value={formik.values.comments}
                    error={Boolean(
                      formik.touched.comments && formik.errors.comments
                    )}
                    fullWidth
                    helperText={
                      formik.touched.comments && formik.errors.comments
                    }
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    multiline
                    variant="outlined"
                    rows={3}
                    my={2}
                    disabled={disableEdit}
                  />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  Upload File
                </TableCell>
                <TableCell
                  colSpan={6}
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
                  <TextField
                    name="file"
                    fullWidth
                    onChange={(e) => {
                      onSelectedFile(e);
                    }}
                    variant="outlined"
                    type="file"
                    disabled={disableEdit}
                  />
                </TableCell>
                <TableCell
                  colSpan={6}
                  sx={{ border: "1px solid #000", textAlign: "center" }}
                >
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
                    disabled={disableEdit}
                  >
                    <CloudUploadIcon /> &nbsp; Upload
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell></TableCell>
                <TableCell colSpan={8}>
                  <Button
                    type="button"
                    variant="contained"
                    onClick={formik.handleSubmit}
                    sx={{
                      fontWeight: "bolder",
                      backgroundColor: "#333333",
                      "&:hover": {
                        background: "#333333",
                        color: "white",
                      },
                    }}
                    disabled={disableEdit}
                  >
                    <SaveIcon /> &nbsp; Save
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}
      </form>
    </React.Fragment>
  );
};
export default LocationTable;
