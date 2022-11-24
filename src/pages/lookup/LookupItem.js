import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Edit2 as Edit2Icon, Trash as TrashIcon } from "react-feather";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { NavLink, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon } from "@mui/icons-material";
import { deleteLookupItem, useLookupItems } from "../../api/lookup";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

const Button = styled(MuiButton)(spacing);

const LookupItemsData = () => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery(
    ["lookupItems"],
    useLookupItems,
    {
      retry: 0,
    }
  );
  if (isError) {
    toast(error.response.data, {
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

  const {
    refetch,
    isSuccess: isDeleteSuccess,
    isError: isDeleteError,
    error: deleteError,
  } = useQuery(["lookup", id], deleteLookupItem, { enabled: false });

  const handleDeleteLookupItem = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["lookupItems"]);
  };
  if (isDeleteSuccess) {
    toast("Successfully Deleted", {
      type: "success",
    });
  }
  if (isDeleteError) {
    toast(deleteError.response.data, {
      type: "error",
    });
  }
  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/lookup/new-lookupItem")}
        >
          <AddIcon /> Create Lookup Item
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
                field: "alias",
                headerName: "Alias",
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
                    <NavLink to={`/lookup/new-lookupItem/${params.id}`}>
                      <Button startIcon={<Edit2Icon />} size="small"></Button>
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
          />
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Lookup Item</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Lookup Item?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteLookupItem} color="primary">
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

const LookupItem = () => {
  return (
    <React.Fragment>
      <Helmet title="Lookup Item" />
      <Typography variant="h3" gutterBottom display="inline">
        Lookup Item
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/lookup/lookupItem">
          Lookup
        </Link>
        <Typography>Lookup Item</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <LookupItemsData />
    </React.Fragment>
  );
};

export default LookupItem;
