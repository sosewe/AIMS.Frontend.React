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
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link2 } from "react-feather";
import { getTechnicalAssistanceByInnovationId } from "../../../../api/technical-assistance";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const TechnicalAssistanceGridData = ({
  processLevelItemId,
  processLevelTypeId,
  id,
}) => {
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();

  const {
    data: TechnicalAssistanceData,
    isLoading: isLoadingTechnicalAssistance,
    isError: isErrorTechnicalAssistance,
  } = useQuery(
    ["getTechnicalAssistanceByInnovationId", id],
    getTechnicalAssistanceByInnovationId,
    { enabled: !!id }
  );

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() =>
            navigate(
              `/project/design/technical-assistance/new-technical-assistance/${processLevelItemId}/${processLevelTypeId}`
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
              },
              {
                field: "endDate",
                headerName: "End Date",
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
                    <NavLink
                      to={`/project/design/technical-assistance/technical-assistance-detail/${params.id}`}
                    >
                      <Button startIcon={<Link2 />} size="small"></Button>
                    </NavLink>
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
    </Card>
  );
};

const TechnicalAssistanceData = ({
  processLevelItemId,
  processLevelTypeId,
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
      />
    </React.Fragment>
  );
};
export default TechnicalAssistanceData;
