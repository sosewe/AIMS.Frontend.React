import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  TextField as MuiTextField,
  Autocomplete as MuiAutocomplete,
  Typography,
  Link,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Box,
  CircularProgress,
  InputLabel,
  FormControl,
  Select,
  OutlinedInput,
  Stack,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import CancelIcon from "@mui/icons-material/Cancel";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import * as Yup from "yup";
import { spacing } from "@mui/system";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Check, Trash as TrashIcon } from "react-feather";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Guid } from "../../../../utils/guid";

const Card = styled(MuiCard)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Autocomplete = styled(MuiAutocomplete)(spacing);
const Button = styled(MuiButton)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const Divider = styled(MuiDivider)(spacing);

const initialValues = {};

const StaffDetailsForm = ({ handleClick }) => {};

const UserSatisfactionForm = ({ id }) => {
  const [openDialog, setOpenDialog] = useState();
  const [innovationUpdatesList, setInnovationUpdatesList] = useState([]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
        const guid = new Guid();
        const saveInnovationUpdate = {};

        toast("Successfully Updated an Innovation", {
          type: "success",
        });
        await queryClient.invalidateQueries(["getInnovations"]);
        navigate(`/project/design/innovation/innovation-detail/${id}`);
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });

  function removeInnovationUpdate(row) {
    setInnovationUpdatesList((current) => {});
  }

  const handleAddInnovationUpdate = (values) => {
    setInnovationUpdatesList((current) => [...current, values]);
  };

  useEffect(() => {}, []);

  return (
    <form onSubmit={formik.handleSubmit}>
      {formik.isSubmitting ? (
        <Box display="flex" justifyContent="center" my={6}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container item spacing={2}>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <Button variant="contained" color="primary" onClick={() => {}}>
                <AddIcon /> Add Details
              </Button>
            </Grid>
            <Grid item md={12}>
              <Paper>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Metric</TableCell>
                      <TableCell align="right">Target Group</TableCell>
                      <TableCell align="right">Target Value</TableCell>
                      <TableCell align="right">
                        Actual By Reporting Period
                      </TableCell>
                      <TableCell align="right">% Change</TableCell>
                      <TableCell align="right">Description</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody></TableBody>
                </Table>
              </Paper>
            </Grid>
          </Grid>
          <Grid item mt={5} md={12}>
            <Button type="submit" variant="contained" color="primary" mt={3}>
              <Check /> Save changes
            </Button>
          </Grid>
          <Dialog
            fullWidth={true}
            maxWidth="md"
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Innovation Update Details
            </DialogTitle>
            <DialogContent>
              <DialogContentText>Add Staff Details</DialogContentText>
              <UserSatisfactionForm handleClick={handleAddInnovationUpdate} />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)} color="primary">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Grid>
      )}
    </form>
  );
};

const UserSatisfaction = () => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="New Innovation Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Technical Review
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link>Project Monitoring</Link>
        <Typography>Technical Review</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <Card mb={12}>
        <CardContent>
          <Grid container spacing={12}>
            <Grid item md={12}>
              <UserSatisfactionForm id={id} />
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

export default UserSatisfaction;
