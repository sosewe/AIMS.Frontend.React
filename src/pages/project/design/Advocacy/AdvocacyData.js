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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash, Edit } from "react-feather";
import {
  getAdvocacyByProcessLevelItemId,
  deleteAdvocacyById,
} from "../../../../api/advocacy";
import { format } from "date-fns";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AdvocacyGridData = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  const [open, setOpen] = useState(false);
  const [advocacyId, setAdvocacyId] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: AdvocacyData,
    isLoading: isLoadingAdvocacy,
    isError: isErrorAdvocacy,
  } = useQuery(
    ["getAdvocacyByProcessLevelItemId", processLevelItemId],
    getAdvocacyByProcessLevelItemId,
    { enabled: !!processLevelItemId }
  );

  function handleClickOpen(advocacyId) {
    setAdvocacyId(advocacyId);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const { refetch } = useQuery(
    ["deleteAdvocacyById", advocacyId],
    deleteAdvocacyById,
    { enabled: false }
  );

  const handleDeleteAdvocacy = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getAdvocacyByProcessLevelItemId"]);
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
          <AddIcon /> New Advocacy
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={
              isLoadingAdvocacy || isErrorAdvocacy
                ? []
                : AdvocacyData
                ? AdvocacyData.data
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
                    <Button
                      startIcon={<Edit />}
                      size="small"
                      onClick={(e) => {
                        handleActionChange(params.id, false);
                        setAdvocacyId(params.id);
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
            loading={isLoadingAdvocacy}
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
        <DialogTitle id="alert-dialog-title">Delete Advocacy</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Advocacy?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAdvocacy} color="primary">
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

const AdvocacyData = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  return (
    <React.Fragment>
      <Helmet title="Advocacy" />
      <Typography variant="h3" gutterBottom display="inline">
        Advocacy
      </Typography>

      <Divider my={6} />
      <AdvocacyGridData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
        onActionChange={onActionChange}
      />
    </React.Fragment>
  );
};
export default AdvocacyData;
