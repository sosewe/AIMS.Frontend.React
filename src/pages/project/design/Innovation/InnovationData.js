import React, { useState, useCallback } from "react";
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
  getInnovationByProcessLevelItemId,
  deleteInnovationById,
} from "../../../../api/innovation";
import { format } from "date-fns";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const InnovationGridData = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  const [open, setOpen] = useState(false);
  const [innovationId, setInnovationId] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: InnovationsData,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
    error,
  } = useQuery(
    ["getInnovationByProcessLevelItemId", processLevelItemId],
    getInnovationByProcessLevelItemId,
    { enabled: !!processLevelItemId }
  );

  if (isErrorInnovations) {
    toast(error.response.data, {
      type: "error",
    });
  }

  function handleClickOpen(innovationId) {
    setInnovationId(innovationId);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const { refetch } = useQuery(
    ["deleteInnovationById", innovationId],
    deleteInnovationById,
    { enabled: false }
  );

  const handleDeleteInnovation = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries([
      "getInnovationThematicFocusByInnovationId",
    ]);
  };

  const handleActionChange = useCallback(
    (event) => {
      onActionChange(false);
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
          onClick={() => handleActionChange()}
        >
          <AddIcon /> New Innovation
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={
              isLoadingInnovations || isErrorInnovations
                ? []
                : InnovationsData
                ? InnovationsData.data
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
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                  <>
                    <NavLink
                      to={`/project/design/innovation/innovation-detail/${params.id}`}
                    >
                      <Button
                        startIcon={<Edit />}
                        size="small"
                        onClick={(e) => handleActionChange()}
                      ></Button>
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
            loading={isLoadingInnovations}
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
        <DialogTitle id="alert-dialog-title">Delete Innovation</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Innovation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteInnovation} color="primary">
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

const InnovationData = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  return (
    <React.Fragment>
      <Helmet title="Innovation" />
      <Typography variant="h3" gutterBottom display="inline">
        Innovation
      </Typography>

      <Divider my={6} />
      <InnovationGridData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
        onActionChange={onActionChange}
      />
    </React.Fragment>
  );
};
export default InnovationData;
