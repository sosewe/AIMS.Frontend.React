import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getInnovations } from "../../../../api/innovation";
import InnovationDataActions from "./InnovationDataActions";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const InnovationGridData = ({ processLevelItemId, processLevelTypeId }) => {
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  const {
    data: InnovationsData,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
    error,
  } = useQuery(["getInnovations"], getInnovations, {
    refetchOnWindowFocus: false,
  });

  if (isErrorInnovations) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const actionLink = (params) => {
    return <InnovationDataActions params={params} />;
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
              `/project/design/new-innovation/${processLevelItemId}/${processLevelTypeId}`
            )
          }
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
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => {
                  return actionLink(params);
                },
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
