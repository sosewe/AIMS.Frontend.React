import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Link,
  Breadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Trash, Edit, Link2 } from "react-feather";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import {
  getAdvocacyProgressUpdateByAdvocacyId,
  deleteAdvocacyProgressUpdateUpdate,
} from "../../../../api/advocacy-progress";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const AdvocacyProgressUpdateDataGridData = ({ id }) => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [advocacyProgressId, setAdvocacyProgressId] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleClickOpen(advocacyId) {
    setAdvocacyProgressId(advocacyId);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const { refetch } = useQuery(
    ["deleteAdvocacyProgressUpdateUpdate", advocacyProgressId],
    deleteAdvocacyProgressUpdateUpdate,
    { enabled: false }
  );

  const handleDeleteAdvocacyProgress = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries([
      "getAdvocacyProgressUpdateByAdvocacyId",
    ]);
  };

  const {
    data: AdvocacyProgressUpdateData,
    isLoading: isLoadingAdvocacyProgressUpdate,
    isError: isErrorAdvocacyProgressUpdate,
    error,
  } = useQuery(
    ["getAdvocacyProgressUpdateByAdvocacyId", id],
    getAdvocacyProgressUpdateByAdvocacyId,
    {
      enabled: !!id,
    }
  );

  if (isErrorAdvocacyProgressUpdate) {
    toast(error.response.data, {
      type: "error",
    });
  }

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Paper>
          <Button
            variant="contained"
            color="error"
            onClick={() =>
              navigate(`/project/monitoring/advocacy-monitoring-update/${id}`)
            }
          >
            <AddIcon /> New Advocacy Update
          </Button>
        </Paper>
        <br></br>
        <Paper>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rowsPerPageOptions={[5, 10, 25]}
              rows={
                isLoadingAdvocacyProgressUpdate || isErrorAdvocacyProgressUpdate
                  ? []
                  : AdvocacyProgressUpdateData
                  ? AdvocacyProgressUpdateData.data
                  : []
              }
              columns={[
                {
                  field: "title",
                  headerName: "Advocacy",
                  editable: false,
                  flex: 1,
                  valueGetter: (params) => params.row.advocacy.title,
                },
                {
                  field: "implementationYear",
                  headerName: "Year",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "quarter",
                  headerName: "Quarter",
                  editable: false,
                  flex: 1,
                },
                {
                  field: "ragStatus",
                  headerName: "Brag Status",
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
                        to={`/project/monitoring/advocacy-monitoring-update/${id}/${params.id}`}
                      >
                        <Button startIcon={<Edit />} size="small"></Button>
                      </NavLink>

                      <Button
                        startIcon={<Trash />}
                        size="small"
                        onClick={(e) => handleClickOpen(params.id)}
                      ></Button>
                    </>
                  ),
                },
              ]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              loading={isLoadingAdvocacyProgressUpdate}
              getRowHeight={() => "auto"}
            />
          </div>
        </Paper>
      </CardContent>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Advocacy Progress
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Advocacy Progress?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAdvocacyProgress} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="error" autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

const AdvocacyProgressUpdateDataGrid = ({ id }) => {
  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h3" gutterBottom display="inline">
        Advocacy Update
      </Typography>
      <Divider my={6} />
      <AdvocacyProgressUpdateDataGridData id={id} />
    </React.Fragment>
  );
};
export default AdvocacyProgressUpdateDataGrid;
