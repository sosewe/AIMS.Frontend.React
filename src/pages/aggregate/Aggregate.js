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
import { Edit2, Eye, Trash as TrashIcon } from "react-feather";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteAggregateById, getAllAggregates } from "../../api/aggregate";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AggregateData = () => {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery(
    ["getAllAggregates"],
    getAllAggregates
  );

  const { refetch } = useQuery(
    ["deleteAggregateById", id],
    deleteAggregateById,
    { enabled: false }
  );

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteAggregate = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getAllAggregates"]);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/indicator/new-aggregate")}
        >
          <AddIcon /> New Aggregate
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
                    <NavLink to={`/indicator/new-aggregate/${params.id}`}>
                      <Button startIcon={<Edit2 />} size="small"></Button>
                    </NavLink>
                    <NavLink to={`/indicator/view-aggregate/${params.id}`}>
                      <Button startIcon={<Eye />} size="small"></Button>
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
          <DialogTitle id="alert-dialog-title">Delete Aggregate</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete Aggregate?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteAggregate} color="primary">
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

const Aggregate = () => {
  return (
    <React.Fragment>
      <Helmet title="Aggregate" />
      <Typography variant="h3" gutterBottom display="inline">
        Aggregate
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/aggregates">
          Aggregates
        </Link>
        <Typography>Aggregates List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <AggregateData />
    </React.Fragment>
  );
};
export default Aggregate;
