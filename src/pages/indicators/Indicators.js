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
import { Add as AddIcon } from "@mui/icons-material";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { deleteIndicatorById, getAllIndicators } from "../../api/indicator";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const IndicatorsData = () => {
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // fetch All Indicators
  const { data, isLoading, isError, error } = useQuery(
    ["getAllIndicators"],
    getAllIndicators,
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
    ["deleteIndicatorById", id],
    deleteIndicatorById,
    { enabled: false }
  );

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteIndicator = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getAllIndicators"]);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/indicator/new-indicator")}
        >
          <AddIcon /> New Indicator
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
                field: "code",
                headerName: "Code",
                editable: false,
                flex: 1,
              },
              {
                field: "definition",
                headerName: "Definition",
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
                    <NavLink to={`/indicator/new-indicator/${params.id}`}>
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
          <DialogTitle id="alert-dialog-title">Delete Indicator</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Indicator?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteIndicator} color="primary">
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

const Indicators = () => {
  return (
    <React.Fragment>
      <Helmet title="Indicators" />
      <Typography variant="h3" gutterBottom display="inline">
        Indicators
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/indicators">
          Indicators
        </Link>
        <Typography>Indicators List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <IndicatorsData />
    </React.Fragment>
  );
};
export default Indicators;
