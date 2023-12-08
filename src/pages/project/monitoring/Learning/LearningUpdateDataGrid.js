import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Grid,
  Breadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
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
import { getLearningByLearningId } from "../../../../api/learning";
import {
  getLearningProgressUpdateByLearningId,
  deleteLearningProgressUpdateById,
} from "../../../../api/learning-progress-update";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const LearningUpdateDataGridData = ({ id, processLevelItemId }) => {
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [learningProgressId, setlearningProgressId] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleClickOpen(learningId) {
    setlearningProgressId(learningId);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const { refetch } = useQuery(
    ["deleteLearningProgressUpdateById", learningProgressId],
    deleteLearningProgressUpdateById,
    { enabled: false }
  );

  const handleDeleteLearningProgress = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getLearningByProcessLevelItemId"]);
  };

  const {
    data: LearningUpdateData,
    isLoading: isLoadingLearningUpdate,
    isError: isErrorLearningUpdate,
    error,
  } = useQuery(
    ["getLearningProgressUpdateByLearningId", id],
    getLearningProgressUpdateByLearningId,
    {
      enabled: !!id,
    }
  );

  if (isErrorLearningUpdate) {
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
              navigate(
                `/project/monitoring/learning-monitoring-update/${processLevelItemId}/${id}`
              )
            }
          >
            <AddIcon /> New Learning Update
          </Button>
        </Paper>
        <br></br>
        <Paper>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rowsPerPageOptions={[5, 10, 25]}
              rows={
                isLoadingLearningUpdate || isErrorLearningUpdate
                  ? []
                  : LearningUpdateData
                  ? LearningUpdateData.data
                  : []
              }
              columns={[
                {
                  field: "implementationYear",
                  headerName: "Year",
                  editable: false,
                  flex: 1,
                  //valueGetter: (params) => params.row.research.learningQuestion,
                },
                {
                  field: "quarter",
                  headerName: "Quarter",
                  editable: false,
                  flex: 1,
                  //valueGetter: (params) => params.row.research.learningQuestion,
                },
                {
                  field: "researchStage",
                  headerName: "Research Stage",
                  editable: false,
                  flex: 1,
                  //valueGetter: (params) => params.row.research.learningQuestion,
                },
                {
                  field: "progress",
                  headerName: "Progress",
                  editable: false,
                  flex: 1,
                  //valueGetter: (params) => params.row.research.learningQuestion,
                },
                {
                  field: "action",
                  headerName: "Action",
                  sortable: false,
                  flex: 1,
                  renderCell: (params) => (
                    <>
                      <NavLink
                        to={`/project/monitoring/learning-monitoring-update/${processLevelItemId}/${id}/${params.id}`}
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
              loading={isLoadingLearningUpdate}
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
          Delete Learning Progress
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Learning Progress?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteLearningProgress} color="primary">
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

const LearningUpdateDataGrid = ({ id, processLevelItemId }) => {
  const {
    data: LearningData,
    isLoading: isLoadingLearning,
    isError: isErrorLearning,
  } = useQuery(["getLearningByLearningId", id], getLearningByLearningId, {
    enabled: !!id,
  });

  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h3" gutterBottom>
        Learning Update
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Typography variant="h5" gutterBottom>
          {isLoadingLearning
            ? ""
            : LearningData
            ? LearningData.data.learningQuestion
            : ""}
        </Typography>
      </Breadcrumbs>

      <Divider my={2} />
      <LearningUpdateDataGridData
        id={id}
        processLevelItemId={processLevelItemId}
      />
    </React.Fragment>
  );
};
export default LearningUpdateDataGrid;
