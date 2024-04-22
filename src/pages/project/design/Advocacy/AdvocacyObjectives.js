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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash, Edit, ChevronLeft } from "react-feather";
import {
  getAdvocacyObjectiveByAdvocacyId,
  deleteAdvocacyObjectiveById,
} from "../../../../api/advocacy-objective";
import useKeyCloakAuth from "../../../../hooks/useKeyCloakAuth";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AdvocacyObjectiveGridData = (props) => {
  const id = props.id;
  const onActionChange = props.onActionChange;
  const onAdvocacyActionChange = props.onAdvocacyActionChange;

  const [open, setOpen] = useState(false);
  const [advocacyObjectiveId, setAdvocacyObjectiveId] = useState(false);
  const [pageSize, setPageSize] = useState(5);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const user = useKeyCloakAuth();

  const {
    data: AdvocacyObjectiveData,
    isLoading: isLoadingAdvocacyObjective,
    isError: isErrorAdvocacyObjective,
  } = useQuery(
    ["getAdvocacyObjectiveByAdvocacyId", id],
    getAdvocacyObjectiveByAdvocacyId,
    {
      enabled: !!id,
    }
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
    await queryClient.invalidateQueries(["getAdvocacyObjectiveByAdvocacyId"]);
  };

  const handleActionChange = useCallback(
    (event) => {
      onActionChange({ id: 0, status: 0 });
    },
    [onActionChange]
  );

  const handleAdvocacyActionChange = useCallback(
    (id, status) => {
      onAdvocacyActionChange({ id: id, status: status });
    },
    [onAdvocacyActionChange]
  );

  return (
    <Card mb={6}>
      <Paper>
        <Button
          mr={2}
          mb={5}
          variant="contained"
          color="error"
          onClick={() => handleAdvocacyActionChange(0, false)}
        >
          <AddIcon /> New Advocacy Objective
        </Button>
        <br />
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
                field: "nameOfTopic",
                headerName: "Name Of Topic",
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
                    <Button
                      startIcon={<Edit />}
                      size="small"
                      onClick={(e) => {
                        handleAdvocacyActionChange(params.id, false);
                        setAdvocacyObjectiveId(params.id);
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
            loading={isLoadingAdvocacyObjective}
            components={{ Toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
          />
        </div>

        <br />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          mt={3}
          onClick={() => handleActionChange({ id: 0, action: 1 })}
        >
          <ChevronLeft /> Back
        </Button>
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

const AdvocacyObjectives = ({
  id,
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
  onAdvocacyActionChange,
}) => {
  return (
    <React.Fragment>
      <Helmet title="Advocacy Objective" />
      <Typography variant="h5" gutterBottom display="inline">
        Advocacy Objective
      </Typography>

      <Divider my={6} />
      <AdvocacyObjectiveGridData
        id={id}
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
        onActionChange={onActionChange}
        onAdvocacyActionChange={onAdvocacyActionChange}
      />
    </React.Fragment>
  );
};
export default AdvocacyObjectives;
