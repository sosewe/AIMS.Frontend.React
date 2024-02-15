import React, { useEffect, useState, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import * as Yup from "yup";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Grid, Link2, Edit } from "react-feather";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { getInnovationByProcessLevelItemId } from "../../../../api/innovation";
import {
  getAMREFStaffList,
  getLookupMasterItemsByName,
} from "../../../../api/lookup";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const InnovationData = ({
  processLevelItemId,
  processLevelTypeId,
  onActionChange,
}) => {
  const [pageSize, setPageSize] = useState(5);
  const {
    data: InnovationsData,
    isLoading: isLoadingInnovations,
    isError: isErrorInnovations,
    error,
  } = useQuery(
    ["getInnovationByProcessLevelItemId", processLevelItemId],
    getInnovationByProcessLevelItemId,
    {
      enabled: !!processLevelItemId,
    }
  );

  const { isLoading: isLoadingDocumentCategory, data: documentCategoryData } =
    useQuery(["currencyType", "CurrencyType"], getLookupMasterItemsByName, {
      refetchOnWindowFocus: false,
    });

  const handleActionChange = useCallback(
    (id, status) => {
      onActionChange({ id: id, status: status });
    },
    [onActionChange]
  );

  useEffect(() => {}, []);

  return (
    <Card mb={6}>
      <CardContent pb={1}>
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
                    <Button
                      startIcon={<Link2 />}
                      size="small"
                      onClick={(e) => {
                        handleActionChange(params.id, false);
                      }}
                    ></Button>
                  ),
                },
              ]}
              pageSize={pageSize}
              onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
              loading={isLoadingInnovations}
              getRowHeight={() => "auto"}
            />
          </div>
        </Paper>
      </CardContent>
    </Card>
  );
};

const InnovationDataGrid = (props) => {
  return (
    <React.Fragment>
      <Helmet title="Innovation" />
      <Typography variant="h5" gutterBottom display="inline">
        Innovation Monitoring
      </Typography>

      <Divider my={3} />
      <InnovationData
        processLevelItemId={props.processLevelItemId}
        processLevelTypeId={props.processLevelTypeId}
        onActionChange={props.onActionChange}
      />
    </React.Fragment>
  );
};
export default InnovationDataGrid;
