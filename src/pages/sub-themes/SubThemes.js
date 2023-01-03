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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { Add as AddIcon } from "@mui/icons-material";
import { deleteSubTheme, getAllSubThemes } from "../../api/sub-theme";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

export const SubThemesData = () => {
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // fetch Sub Themes
  const { data, isLoading, isError, error } = useQuery(
    ["getAllSubThemes"],
    getAllSubThemes,
    {
      retry: 0,
    }
  );

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const { refetch } = useQuery(["deleteSubTheme", id], deleteSubTheme, {
    enabled: false,
  });

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteThematicArea = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getAllSubThemes"]);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/programme/new-sub-theme")}
        >
          <AddIcon /> New Sub Theme
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 600, width: "100%" }}>
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
                field: "initial",
                headerName: "Initial",
                editable: false,
                flex: 1,
              },
              {
                field: "code",
                headerName: "Code",
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
                renderCell: (params) => (
                  <>
                    <NavLink to={`/programme/new-sub-theme/${params.id}`}>
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
            density="compact"
          />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Sub Theme</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Sub Theme?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteThematicArea} color="primary">
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

const SubThemes = () => {
  return (
    <React.Fragment>
      <Helmet title="Sub Themes" />
      <Typography variant="h3" gutterBottom display="inline">
        Sub Themes
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/programme/administrative-programmes">
          Sub Themes
        </Link>
        <Typography>Sub Themes List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <SubThemesData />
    </React.Fragment>
  );
};
export default SubThemes;
