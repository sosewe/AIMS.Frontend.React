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
import { toast } from "react-toastify";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { deleteEntity, getAmrefEntities } from "../../api/amref-entity";
import { lookupItem } from "../../api/lookup";
import usePermissions from "../../hooks/usePermissions";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const EntitiesData = () => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { hasPermission } = usePermissions();
  // fetch Entities
  const { data, isLoading, isError, error } = useQuery(
    ["entities"],
    getAmrefEntities,
    {
      retry: 0,
    }
  );

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  function GetEntityTypeName(params) {
    const entityTypeId = params.value;
    const result = useQuery(["getEntityTypeId", entityTypeId], lookupItem);
    if (result && result.data) {
      return result.data.data.name;
    }
  }

  const { refetch } = useQuery(["deleteEntity", id], deleteEntity, {
    enabled: false,
  });

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteEntity = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["entities"]);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        {hasPermission("new-entity") && (
          <Button
            mr={2}
            variant="contained"
            color="error"
            onClick={() => navigate("/settings/new-entity")}
          >
            <AddIcon /> New Entity
          </Button>
        )}
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
                field: "entityTypeId",
                headerName: "Entity",
                editable: false,
                flex: 1,
                valueGetter: GetEntityTypeName,
              },
              {
                field: "description",
                headerName: "Description",
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
                    <NavLink to={`/settings/new-entity/${params.id}`}>
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
          <DialogTitle id="alert-dialog-title">Delete Entity</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Entity?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteEntity} color="primary">
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

const Entities = () => {
  return (
    <React.Fragment>
      <Helmet title="Entities" />
      <Typography variant="h3" gutterBottom display="inline">
        Entities
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/settings/entities">
          Entities
        </Link>
        <Typography>Entities List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <EntitiesData />
    </React.Fragment>
  );
};
export default Entities;
