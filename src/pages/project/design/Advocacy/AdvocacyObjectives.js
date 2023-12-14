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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash, Edit } from "react-feather";
import {
  getAdvocacyObjectiveById,
  deleteAdvocacyObjectiveById,
} from "../../../../api/advocacy-objective";
import { format } from "date-fns";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AdvocacyObjectiveGridData = ({
  processLevelItemId,
  processLevelTypeId,
}) => {
  const [open, setOpen] = useState(false);
  const [advocacyObjectiveId, setAdvocacyObjectiveId] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: AdvocacyObjectiveData,
    isLoading: isLoadingAdvocacyObjective,
    isError: isErrorAdvocacyObjective,
  } = useQuery(
    ["getAdvocacyObjectiveById", processLevelItemId],
    getAdvocacyObjectiveById,
    { enabled: !!processLevelItemId }
  );

  function handleClickOpen(advocacyObjectiveId) {
    setAdvocacyObjectiveId(advocacyObjectiveId);
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  const { refetch } = useQuery(
    ["deleteAdvocacyObjectiveById", advocacyObjectiveId],
    deleteAdvocacyObjectiveById,
    { enabled: false }
  );

  const handleDeleteAdvocacyObjective = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getAdvocacyObjectiveById"]);
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
              `/project/design/advocacy/new-advocacy-objective/${processLevelItemId}/${processLevelTypeId}`
            )
          }
        >
          <AddIcon /> New Advocacy Objective
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={
              isLoadingAdvocacyObjective || isErrorAdvocacyObjective
                ? []
                : AdvocacyObjectiveData
                ? AdvocacyObjectiveData.data
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
                      to={`/project/design/advocacy/advocacy-detail/${params.id}`}
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
            loading={isLoadingAdvocacyObjective}
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
          Delete Advocacy Objective
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete Advocacy Objective?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAdvocacyObjective} color="primary">
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

const AdvocacyObjectiveData = ({ processLevelItemId, processLevelTypeId }) => {
  return (
    <React.Fragment>
      <Helmet title="Advocacy Objective" />
      <Typography variant="h3" gutterBottom display="inline">
        Advocacy Objective
      </Typography>

      <Divider my={6} />
      <AdvocacyObjectiveGridData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default AdvocacyObjectiveData;
