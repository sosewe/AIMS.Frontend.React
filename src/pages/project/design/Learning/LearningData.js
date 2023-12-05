import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
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
import { spacing } from "@mui/system";
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Trash, Edit, Link2 } from "react-feather";
import {
  getTechnicalAssistanceByProcessLevelItemId,
  deleteTechnicalAssistanceById,
} from "../../../../api/technical-assistance";
import { format } from "date-fns";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const LearningGridData = ({ processLevelItemId, processLevelTypeId }) => {
  const [open, setOpen] = useState(false);
  const [technicalAssistanceId, setTechnicalAssistanceId] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: TechnicalAssistanceData,
    isLoading: isLoadingTechnicalAssistance,
    isError: isErrorTechnicalAssistance,
  } = useQuery(
    ["getTechnicalAssistanceByProcessLevelItemId", processLevelItemId],
    getTechnicalAssistanceByProcessLevelItemId,
    { enabled: !!processLevelItemId }
  );

  function handleClickOpen(technicalAssistanceId) {
    setTechnicalAssistanceId(technicalAssistanceId);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const { refetch } = useQuery(
    ["deleteTechnicalAssistanceById", technicalAssistanceId],
    deleteTechnicalAssistanceById,
    { enabled: false }
  );

  const handleDeleteTechnicalAssistance = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries([
      "getTechnicalAssistanceByProcessLevelItemId",
    ]);
  };

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() =>
            navigate(
              `/project/design/learning/new-learning/${processLevelItemId}/${processLevelTypeId}`
            )
          }
        >
          <AddIcon /> New Research
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={
              isLoadingTechnicalAssistance || isErrorTechnicalAssistance
                ? []
                : TechnicalAssistanceData
                ? TechnicalAssistanceData.data
                : []
            }
            columns={[
              {
                field: "title",
                headerName: "Title",
                editable: false,
                flex: 1,
              },
              {
                field: "startDate",
                headerName: "Start Date",
                editable: false,
                flex: 1,
                valueFormatter: (params) =>
                  params?.value
                    ? format(new Date(params.value), "dd-MMM-yyyy")
                    : "",
              },
              {
                field: "endDate",
                headerName: "End Date",
                editable: false,
                flex: 1,
                valueFormatter: (params) =>
                  params?.value
                    ? format(new Date(params.value), "dd-MMM-yyyy")
                    : "",
              },
              /*{
                field: "status",
                headerName: "Status",
                editable: false,
                flex: 1,
                valueGetter: (params) => params.row.status.name,
              },*/
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                  <>
                    <NavLink
                      to={`/project/design/technical-assistance/technical-assistance-detail/${params.id}`}
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
            loading={isLoadingTechnicalAssistance}
            components={{ Toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
          />
        </div>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Learning</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Learning?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteTechnicalAssistance} color="primary">
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

const LearningData = ({ processLevelItemId, processLevelTypeId }) => {
  return (
    <React.Fragment>
      <Helmet title="Learning" />
      <Typography variant="h3" gutterBottom display="inline">
        Research (Learning)
      </Typography>

      <Divider my={6} />
      <LearningGridData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default LearningData;
