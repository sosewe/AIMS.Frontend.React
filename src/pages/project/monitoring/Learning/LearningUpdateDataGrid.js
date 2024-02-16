import React, { useState, useCallback } from "react";
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
import { blue } from "@mui/material/colors";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const LearningUpdateDataGridData = (props) => {
  const id = props.id;
  const onActionChange = props.onActionChange;
  const onLearningActionChange = props.onLearningActionChange;
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = useState(false);
  const [learningProgressId, setLearningProgressId] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleClickOpen(learningId) {
    setLearningProgressId(learningId);
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

  const handleLearningActionChange = useCallback(
    (id, status) => {
      onLearningActionChange({
        id: id,
        status: status,
      });
    },
    [onLearningActionChange]
  );

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Paper>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleLearningActionChange(0, false)}
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
                      <Button
                        startIcon={<Edit />}
                        size="small"
                        onClick={(e) => {
                          handleLearningActionChange(params.id, false);
                          setLearningProgressId(params.id);
                        }}
                      ></Button>

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

const LearningUpdateDataGrid = (props) => {
  const {
    data: LearningData,
    isLoading: isLoadingLearning,
    isError: isErrorLearning,
  } = useQuery(["getLearningByLearningId", props.id], getLearningByLearningId, {
    enabled: !!props.id,
  });

  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h5" gutterBottom>
        Learning Update
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={3}>
        <Typography variant="h5" gutterBottom color={blue}>
          Question:{" "}
          {isLoadingLearning && !isErrorLearning
            ? ""
            : LearningData
            ? LearningData.data.learningQuestion
            : ""}
        </Typography>
      </Breadcrumbs>

      <Divider my={2} />
      <LearningUpdateDataGridData
        id={props.id}
        processLevelItemId={props.processLevelItemId}
        processLevelTypeId={props.processLevelTypeId}
        onActionChange={props.onActionChange}
        onLearningActionChange={props.onLearningActionChange}
      />
    </React.Fragment>
  );
};
export default LearningUpdateDataGrid;
