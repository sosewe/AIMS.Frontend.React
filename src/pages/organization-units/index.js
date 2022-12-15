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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteDonorById, getDonors } from "../../api/donor";
import { toast } from "react-toastify";
import { lookupItem } from "../../api/lookup";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2, Trash as TrashIcon } from "react-feather";
import {
  deleteOrganizationUnit,
  getOrganizationUnits,
} from "../../api/organization-unit";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const OrganizationUnitsData = () => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // fetch Administrative Programmes
  const { data, isLoading, isError, error } = useQuery(
    ["organizationUnits"],
    getOrganizationUnits,
    {
      retry: 0,
    }
  );

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const { refetch } = useQuery(
    ["deleteOrganizationUnit", id],
    deleteOrganizationUnit,
    {
      enabled: false,
    }
  );

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
    await queryClient.invalidateQueries(["organizationUnits"]);
  };

  function GetAMREFEntityName(params) {
    const amrefEntityId = params.value;
    const result = useQuery(["amrefEntityId", amrefEntityId], lookupItem);
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  function GetCountryName(params) {
    const countryId = params.value;
    const result = useQuery(["countryId", countryId], lookupItem);
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/settings/new-organization-unit")}
        >
          <AddIcon /> New Organization Unit
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
                field: "name",
                headerName: "Name",
                editable: false,
                flex: 1,
              },
              {
                field: "initials",
                headerName: "Initials",
                editable: false,
                flex: 1,
              },
              {
                field: "contactPerson",
                headerName: "Contact Person",
                editable: false,
                flex: 1,
              },
              {
                field: "amrefEntityId",
                headerName: "Amref Entity",
                editable: false,
                flex: 1,
                valueGetter: GetAMREFEntityName,
              },
              {
                field: "countryId",
                headerName: "Country",
                editable: false,
                flex: 1,
                valueGetter: GetCountryName,
              },
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                  <>
                    <NavLink
                      to={`/settings/new-organization-unit/${params.id}`}
                    >
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
          <DialogTitle id="alert-dialog-title">
            Delete Organization Unit
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Organization Unit?
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

const OrganizationUnits = () => {
  return (
    <React.Fragment>
      <Helmet title="Organization Units" />
      <Typography variant="h3" gutterBottom display="inline">
        Organization Units
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/settings/organization-units">
          Organization Units
        </Link>
        <Typography>Organization Units List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <OrganizationUnitsData />
    </React.Fragment>
  );
};
export default OrganizationUnits;
