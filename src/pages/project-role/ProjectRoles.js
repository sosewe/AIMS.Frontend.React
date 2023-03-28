import React, { useState } from "react";
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
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getProjectRoles } from "../../api/project-role";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ProjectRolesActions from "./ProjectRolesActions";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const ProjectRolesData = () => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();
  const {
    data: projectRolesData,
    isLoading: isLoadingProjectRoles,
    isError: isErrorProjectRoles,
  } = useQuery(["getProjectRoles"], getProjectRoles, {
    refetchOnWindowFocus: false,
  });

  function handleClose() {
    setOpen(false);
  }
  const actionLink = (params) => {
    return <ProjectRolesActions params={params} />;
  };
  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/settings/new-project-role")}
        >
          <AddIcon /> New Project Role
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={
              isLoadingProjectRoles || isErrorProjectRoles
                ? []
                : projectRolesData
                ? projectRolesData.data
                : []
            }
            columns={[
              {
                field: "name",
                headerName: "Name",
                editable: false,
                flex: 1,
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
                renderCell: (params) => {
                  return actionLink(params);
                },
              },
            ]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            loading={isLoadingProjectRoles}
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
            Delete Administrative Programme
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Administrative Programme?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              // onClick={handleDeleteAdministrativeProgramme}
              color="primary"
            >
              Yes
            </Button>
            {/*<Button onClick={handleClose} color="error" autoFocus>*/}
            {/*  No*/}
            {/*</Button>*/}
          </DialogActions>
        </Dialog>
      </Paper>
    </Card>
  );
};
const ProjectRoles = () => {
  return (
    <React.Fragment>
      <Helmet title="Project Roles" />
      <Typography variant="h3" gutterBottom display="inline">
        Project Roles
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/settings/project-roles">
          Project Roles
        </Link>
        <Typography>Project Roles List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ProjectRolesData />
    </React.Fragment>
  );
};
export default ProjectRoles;
