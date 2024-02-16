import React, { useEffect, useState, useCallback } from "react";
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

const TechnicalAssistanceGridData = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
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

  const handleActionChange = useCallback(
    (id, status) => {
      onActionChange({ id: id, status: status });
    },
    [onActionChange]
  );

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => handleActionChange(0, false)}
        >
          <AddIcon /> New Technical Assistance
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
                    <Button
                      startIcon={<Edit />}
                      size="small"
                      onClick={(e) => {
                        handleActionChange(params.id, false);
                        setTechnicalAssistanceId(params.id);
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
        <DialogTitle id="alert-dialog-title">
          Delete Technical Assistance
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Technical Assistance?
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

const TechnicalAssistanceData = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h3" gutterBottom display="inline">
        Technical Assistance
      </Typography>

      <Divider my={6} />
      <TechnicalAssistanceGridData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
        onActionChange={onActionChange}
      />
    </React.Fragment>
  );
};
export default TechnicalAssistanceData;
