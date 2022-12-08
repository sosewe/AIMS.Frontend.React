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
import {
  deleteAdministrativeProgrammeById,
  getAdministrativeProgrammes,
} from "../../api/administrative-programme";
import { getOrganizationUnitById } from "../../api/organization-unit";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AdministrativeProgrammesData = () => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // fetch Administrative Programmes
  const { data, isLoading, isError, error } = useQuery(
    ["administrativeProgrammes"],
    getAdministrativeProgrammes,
    {
      retry: 0,
    }
  );

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  function GetOrganization(params) {
    const organisationUnitId = params.value;
    const result = useQuery(
      ["getOrganizationUnitById", organisationUnitId],
      getOrganizationUnitById
    );
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  const { refetch } = useQuery(
    ["deleteAdministrativeProgrammeById", id],
    deleteAdministrativeProgrammeById,
    { enabled: false }
  );

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteAdministrativeProgramme = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["administrativeProgrammes"]);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/programme/new-administrative-programme")}
        >
          <AddIcon /> New Administrative Programme
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
                field: "shortTitle",
                headerName: "Short Title",
                editable: false,
                flex: 1,
              },
              {
                field: "longTitle",
                headerName: "Long Title",
                editable: false,
                flex: 1,
              },
              {
                field: "organisationUnitId",
                headerName: "Organisation Unit",
                editable: false,
                flex: 1,
                valueGetter: GetOrganization,
              },
              {
                field: "managerName",
                headerName: "Manager Name",
                editable: false,
                flex: 1,
              },
              {
                field: "goal",
                headerName: "Goal",
                editable: false,
                flex: 1,
              },
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                  <>
                    <NavLink
                      to={`/programme/new-administrative-programme/${params.id}`}
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
          />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Delete Administrative Programme
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Administrative Programme?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleDeleteAdministrativeProgramme}
              color="primary"
            >
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

const AdministrativeProgrammes = () => {
  return (
    <React.Fragment>
      <Helmet title="Administrative Programmes" />
      <Typography variant="h3" gutterBottom display="inline">
        Administrative Programmes
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/administrative-programmes">
          Administrative Programmes
        </Link>
        <Typography>Administrative Programmes List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <AdministrativeProgrammesData />
    </React.Fragment>
  );
};
export default AdministrativeProgrammes;
