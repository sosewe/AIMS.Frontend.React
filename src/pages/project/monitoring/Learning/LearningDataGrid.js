import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Link,
  Breadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Link2 } from "react-feather";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import {
  getLearningByLearningId,
  getLearningByProcessLevelItemId,
} from "../../../../api/learning";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const LearningData = ({ processLevelItemId, processLevelTypeId }) => {
  const [pageSize, setPageSize] = useState(5);
  const {
    data: LearningData,
    isLoading: isLoadingLearning,
    isError: isErrorLearning,
    error,
  } = useQuery(
    ["getLearningByProcessLevelItemId", processLevelItemId],
    getLearningByProcessLevelItemId,
    {
      enabled: !!processLevelItemId,
    }
  );

  if (isErrorLearning) {
    toast(error.response.data, {
      type: "error",
    });
  }

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Paper>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rowsPerPageOptions={[5, 10, 25]}
              rows={
                isLoadingLearning || isErrorLearning
                  ? []
                  : LearningData
                  ? LearningData.data
                  : []
              }
              columns={[
                {
                  field: "learningQuestion",
                  headerName: "Learning Question",
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
                        to={`/project/monitoring/learning-monitoring-detail/${processLevelItemId}/${params.id}`}
                      >
                        <Button startIcon={<Link2 />} size="small"></Button>
                      </NavLink>
                    </>
                  ),
                },
              ]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              loading={isLoadingLearning}
              getRowHeight={() => "auto"}
            />
          </div>
        </Paper>
      </CardContent>
    </Card>
  );
};

const LearningDataGrid = ({ processLevelItemId, processLevelTypeId }) => {
  return (
    <React.Fragment>
      <Helmet title="Research (Learning)" />
      <Typography variant="h5" gutterBottom display="inline">
        Research (Learning) Monitoring
      </Typography>
      <Divider my={6} />
      <LearningData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default LearningDataGrid;
