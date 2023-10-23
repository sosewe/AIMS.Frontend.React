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
import { getAdvocates } from "../../../../api/advocacy";
import AdvocacyDataActions from "./TechnicalAssistanceDataActions";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AdvocacyGridData = ({ processLevelItemId, processLevelTypeId }) => {
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  const {
    data: AdvocacyData,
    isLoading: isLoadingAdvocacy,
    isError: isErrorAdvocacy,
    error,
  } = useQuery(["getAdvocates"], getAdvocates, {
    refetchOnWindowFocus: false,
  });

  if (isErrorAdvocacy) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const actionLink = (params) => {
    return <AdvocacyDataActions params={params} />;
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
              `/project/design/new-technicalassistance/${processLevelItemId}/${processLevelTypeId}`
            )
          }
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
                field: "beneficiary",
                headerName: "Beneficiary",
                editable: false,
                flex: 1,
              },
              {
                field: "advocacyNeed",
                headerName: "Advocacy Need",
                editable: false,
                flex: 1,
              },
              {
                field: "expectedResult",
                headerName: "Expected Result",
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
            loading={isLoadingAdvocacy}
            components={{ Toolbar: GridToolbar }}
            getRowHeight={() => "auto"}
          />
        </div>
      </Paper>
    </Card>
  );
};

const AdvocacyData = ({ processLevelItemId, processLevelTypeId }) => {
  return (
    <React.Fragment>
      <Helmet title="Technical Assistance" />
      <Typography variant="h3" gutterBottom display="inline">
        Technical Assistance
      </Typography>

      <Divider my={6} />
      <AdvocacyGridData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default AdvocacyData;
