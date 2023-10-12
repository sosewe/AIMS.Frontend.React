import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Add as AddIcon } from "@mui/icons-material";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { NavLink, useNavigate } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { deleteAction, getActionsByPageId } from "../../api/action";

const PageTabContent = ({ pageId }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [pageSize, setPageSize] = useState(5);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();

  const { isLoading, isError, data } = useQuery(
    ["getActionsByPageId", pageId],
    getActionsByPageId,
    { enabled: !!pageId }
  );
  const { refetch } = useQuery(["deleteAction", id], deleteAction, {
    enabled: false,
  });
  const handleClickOpen = (id) => {
    setOpen(true);
    setId(id);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleDeleteProjectLink = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries(["getActionsByPageId"]);
  };
  return (
    <React.Fragment>
      <Card mb={6}>
        <CardContent pb={1}>
          <Button
            mr={2}
            variant="contained"
            color="error"
            onClick={() => navigate(`/admin/new-action/${pageId}`)}
          >
            <AddIcon /> New Action
          </Button>
        </CardContent>
        <br />
        <Paper>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rowsPerPageOptions={[5, 10, 25]}
              rows={isLoading || isError ? [] : data ? data.data : []}
              columns={[
                {
                  field: "name",
                  headerName: "Name",
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
                      <NavLink to={`/admin/new-action/${pageId}/${params.id}`}>
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
            <DialogTitle id="alert-dialog-title">Delete Action</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete Action?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDeleteProjectLink} color="primary">
                Yes
              </Button>
              <Button onClick={handleClose} color="error" autoFocus>
                No
              </Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Card>
    </React.Fragment>
  );
};
export default PageTabContent;
