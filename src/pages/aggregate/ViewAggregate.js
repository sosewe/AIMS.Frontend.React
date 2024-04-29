import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  CardHeader,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import {
  deleteAttributeResponseOptionById,
  getAttributeResponseOptions,
} from "../../api/attribute-response-option";
import { Add as AddIcon } from "@mui/icons-material";
import {
  aggregateDisaggregateById,
  deleteAggregateDisaggregateById,
  getAggregateDisaggregates,
} from "../../api/aggregate-disaggregate";
import { getAggregateById } from "../../api/aggregate";
import NewAggregateDisaggregateForm from "./NewAggregateDisaggregateForm";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const ViewAggregateContainer = () => {
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = React.useState(false);
  const [openAggregateDisAggregateForm, setOpenAggregateDisAggregateForm] =
    React.useState(false);
  const [aggregateDisaggregateId, setAggregateDisaggregateId] =
    React.useState();
  let { id } = useParams();
  const queryClient = useQueryClient();
  const { isLoading, data } = useQuery(
    ["getAggregateById", id],
    getAggregateById,
    {
      enabled: !!id,
    }
  );
  const {
    isLoading: isLoadingAggregateDisAggregate,
    isError: isErrorAggregateDisAggregate,
    data: aggregateDisAggregateData,
  } = useQuery(["getAggregateDisaggregates", id], getAggregateDisaggregates, {
    enabled: !!id,
  });

  const { refetch } = useQuery(
    ["deleteAggregateDisaggregateById", aggregateDisaggregateId],
    deleteAggregateDisaggregateById,
    { enabled: false }
  );

  function handleClickOpenDisaggregate() {
    setOpenAggregateDisAggregateForm(true);
  }

  function handleClickOpen(id) {
    setOpen(true);
    setAggregateDisaggregateId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleDeleteAggregateDisaggregate = async () => {
    await refetch();
    setOpen(false);
    toast("Successfully Deleted a Aggregate-Disaggregate", {
      type: "success",
    });
    await queryClient.invalidateQueries(["getAggregateDisaggregates"]);
  };

  function GetDisAggregateName(params) {
    return params.row.disaggregate.name;
  }

  function GetDisAggregateInitials(params) {
    return params.row.disaggregate.initials;
  }

  function GetDisAggregateDescription(params) {
    return params.row.disaggregate.description;
  }

  function GetParentName(params) {
    const aggregateDisaggregateId = params.value;
    const result = useQuery(
      ["aggregateDisaggregateById", aggregateDisaggregateId],
      aggregateDisaggregateById,
      { enabled: !!aggregateDisaggregateId }
    );
    if (result && result.data) {
      return result.data.data.disaggregate.name;
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="Aggregate" />
          <CardContent pb={1}>
            <Grid container spacing={2}>
              <Grid item md={4}>
                <strong>Name: {!isLoading ? data.data.name : ""}</strong>
              </Grid>
              <Grid item md={4}>
                <strong>
                  Initials: {!isLoading ? data.data.initials : ""}
                </strong>
              </Grid>
              <Grid item md={4}>
                <strong>
                  Description: {!isLoading ? data.data.description : ""}
                </strong>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      <Grid item md={12}>
        <Card mb={6}>
          <CardHeader title="Aggregate Disaggregate" />
          <CardContent pb={1}>
            <Button
              mr={2}
              variant="contained"
              color="error"
              onClick={() => handleClickOpenDisaggregate()}
            >
              <AddIcon /> New Aggregate DisAggregate
            </Button>
            <div style={{ height: 400, width: "100%", marginTop: 16 }}>
              <DataGrid
                rowsPerPageOptions={[5, 10, 25]}
                rows={
                  isLoadingAggregateDisAggregate || isErrorAggregateDisAggregate
                    ? []
                    : aggregateDisAggregateData
                    ? aggregateDisAggregateData.data
                    : []
                }
                columns={[
                  {
                    field: "name",
                    headerName: "Name",
                    editable: false,
                    flex: 1,
                    renderCell: GetDisAggregateName,
                  },
                  {
                    field: "initials",
                    headerName: "Initials",
                    editable: false,
                    flex: 1,
                    renderCell: GetDisAggregateInitials,
                  },
                  {
                    field: "description",
                    headerName: "Description",
                    editable: false,
                    flex: 1,
                    renderCell: GetDisAggregateDescription,
                  },
                  {
                    field: "parentId",
                    headerName: "Parent",
                    editable: false,
                    flex: 1,
                    renderCell: GetParentName,
                  },
                  {
                    field: "action",
                    headerName: "Action",
                    sortable: false,
                    flex: 1,
                    renderCell: (params) => (
                      <>
                        <NavLink
                          to={`/indicator/new-attribute-response-option/${id}/${params.id}`}
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
                Delete Aggregate Disaggregate
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete Aggregate Disaggregate?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={handleDeleteAggregateDisaggregate}
                  color="primary"
                >
                  Yes
                </Button>
                <Button onClick={handleClose} color="error" autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
            <Dialog
              fullWidth={true}
              maxWidth="md"
              open={openAggregateDisAggregateForm}
              onClose={() => setOpenAggregateDisAggregateForm(false)}
              aria-labelledby="form-dialog-title"
            >
              <DialogTitle id="form-dialog-title">
                Aggregate Disaggregate Form
              </DialogTitle>
              <DialogContent>
                <DialogContentText>
                  Add Aggregate Disaggregate
                </DialogContentText>
                <NewAggregateDisaggregateForm aggregateId={id} />
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => setOpenAggregateDisAggregateForm(false)}
                  color="primary"
                >
                  Close
                </Button>
              </DialogActions>
            </Dialog>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

const ViewAggregate = () => {
  return (
    <React.Fragment>
      <Helmet title="View Aggregate" />
      <Typography variant="h3" gutterBottom display="inline">
        View Aggregate
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/indicator/aggregates">
          Aggregates
        </Link>
        <Typography>View Aggregate</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ViewAggregateContainer />
    </React.Fragment>
  );
};
export default ViewAggregate;
