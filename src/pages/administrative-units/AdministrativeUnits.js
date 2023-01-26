import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { NavLink, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAdministrativeUnit,
  getAdministrativeUnits,
} from "../../api/administrative-unit";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AdministrativeUnitsData = () => {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery(
    ["getAdministrativeUnits"],
    getAdministrativeUnits
  );

  const { refetch } = useQuery(
    ["deleteAdministrativeUnit", id],
    deleteAdministrativeUnit,
    { enabled: false }
  );

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteAdministrativeUnit = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["deleteAdministrativeUnit"]);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/settings/new-administrative-unit")}
        >
          <AddIcon /> New Administrative Unit
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
                field: "adminUnit",
                headerName: "Admin Unit",
                editable: false,
                flex: 1,
              },
              {
                field: "level",
                headerName: "Level",
                editable: false,
                flex: 1,
              },
              {
                field: "relationship",
                headerName: "Relationship",
                editable: false,
                flex: 1,
              },
              {
                field: "parent",
                headerName: "Parent",
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
                      to={`/settings/new-administrative-unit/${params.id}`}
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
            Delete Administrative Unit
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Administrative Unit?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteAdministrativeUnit} color="primary">
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
const AdministrativeUnits = () => {
  return (
    <React.Fragment>
      <Helmet title="Administrative Units" />
      <Typography variant="h3" gutterBottom display="inline">
        Administrative Units
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/settings/administrative-units">
          Administrative Units
        </Link>
        <Typography>Administrative Units List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <AdministrativeUnitsData />
    </React.Fragment>
  );
};
export default AdministrativeUnits;
