import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Link,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteDonorById, getDonors } from "../../api/donor";
import { lookupItem } from "../../api/lookup";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const DonorsData = () => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // fetch Administrative Programmes
  const { data, isLoading, isError, error } = useQuery(["donors"], getDonors, {
    retry: 0,
  });

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  function GetDonorType(params) {
    const lookupItemId = params.value;
    const result = useQuery(["lookup", lookupItemId], lookupItem);
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  const {
    refetch,
    isError: isErrorDeleteDonor,
    error: errorDeleteDonor,
  } = useQuery(["deleteDonorById", id], deleteDonorById, {
    enabled: false,
  });

  if (isErrorDeleteDonor) {
    toast(errorDeleteDonor.response.data, {
      type: "error",
    });
  }

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteDonor = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["donors"]);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/settings/new-donor")}
        >
          <AddIcon /> New Donor
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={isLoading || isError ? [] : data ? data.data : []}
            columns={[
              {
                field: "donorInitial",
                headerName: "Donor Initial",
                editable: false,
                flex: 1,
              },
              {
                field: "donorName",
                headerName: "Donor Name",
                editable: false,
                flex: 1,
              },
              {
                field: "donorType",
                headerName: "Donor Type",
                editable: false,
                flex: 1,
                valueGetter: GetDonorType,
              },
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                  <>
                    <NavLink to={`/settings/new-donor/${params.id}`}>
                      <Button startIcon={<Edit2 />} size="small"></Button>
                    </NavLink>
                    <Button
                      startIcon={<TrashIcon />}
                      size="small"
                      onClick={() => handleClickOpen(params.id)}
                    ></Button>
                  </>
                ),
              },
            ]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            loading={isLoading}
            components={{ Toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
          />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Donor</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Donor?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteDonor} color="primary">
              Yes
            </Button>
            <Button onClick={handleClose} color="error" autoFocus>
              No
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Card>
  );
};

const Donors = () => {
  return (
    <React.Fragment>
      <Helmet title="Donors" />
      <Typography variant="h3" gutterBottom display="inline">
        Donors
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/settings/donors">
          Donors
        </Link>
        <Typography>Donors List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <DonorsData />
    </React.Fragment>
  );
};
export default Donors;
