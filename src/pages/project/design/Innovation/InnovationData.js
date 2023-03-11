import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Link,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2, Trash as TrashIcon } from "react-feather";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getInnovations } from "../../../../api/innovation";
import Innovation from "./Innovation";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const InnovationGridData = ({ processLevelItemId, processLevelTypeId }) => {
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: InnovationsData,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
  } = useQuery(["getInnovations"], getInnovations, {
    refetchOnWindowFocus: false,
  });
  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Innovation
          processLevelTypeId={processLevelTypeId}
          processLevelItemId={processLevelItemId}
        />
      </CardContent>
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
                field: "proposedSolution",
                headerName: "Proposed Solution",
                editable: false,
                flex: 1,
              },
              {
                field: "targetBeneficiary",
                headerName: "Target Beneficiary",
                editable: false,
                flex: 1,
              },
              {
                field: "difference",
                headerName: "Difference",
                editable: false,
                flex: 1,
              },
              // {
              //   field: "action",
              //   headerName: "Action",
              //   sortable: false,
              //   flex: 1,
              //   renderCell: (params) => (
              //     <>
              //       <NavLink
              //         to={`/programme/new-administrative-programme/${params.id}`}
              //       >
              //         <Button startIcon={<Edit2 />} size="small"></Button>
              //       </NavLink>
              //       <Button
              //         startIcon={<TrashIcon />}
              //         size="small"
              //         onClick={() => handleClickOpen(params.id)}
              //       ></Button>
              //     </>
              //   ),
              // },
            ]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            loading={isLoadingInnovations}
            components={{ Toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
          />
        </div>
        {/*<Dialog*/}
        {/*  open={open}*/}
        {/*  onClose={handleClose}*/}
        {/*  aria-labelledby="alert-dialog-title"*/}
        {/*  aria-describedby="alert-dialog-description"*/}
        {/*>*/}
        {/*  <DialogTitle id="alert-dialog-title">*/}
        {/*    Delete Administrative Programme*/}
        {/*  </DialogTitle>*/}
        {/*  <DialogContent>*/}
        {/*    <DialogContentText id="alert-dialog-description">*/}
        {/*      Are you sure you want to delete Administrative Programme?*/}
        {/*    </DialogContentText>*/}
        {/*  </DialogContent>*/}
        {/*  <DialogActions>*/}
        {/*    <Button*/}
        {/*      onClick={handleDeleteAdministrativeProgramme}*/}
        {/*      color="primary"*/}
        {/*    >*/}
        {/*      Yes*/}
        {/*    </Button>*/}
        {/*    <Button onClick={handleClose} color="error" autoFocus>*/}
        {/*      No*/}
        {/*    </Button>*/}
        {/*  </DialogActions>*/}
        {/*</Dialog>*/}
      </Paper>
    </Card>
  );
};

const InnovationData = ({ processLevelItemId, processLevelTypeId }) => {
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
      />
    </React.Fragment>
  );
};
export default InnovationData;
