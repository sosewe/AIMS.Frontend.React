import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Button,
  Link,
  Breadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Box,
  CircularProgress,
  Divider as MuiDivider,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Grid, Link2 } from "react-feather";
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

const InnovationData = ({ processLevelItemId, processLevelTypeId }) => {
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

  /*
  const formik = useFormik({
    validationSchema: Yup.object().shape({}),
    onSubmit: async (values) => {
      try {
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });*/

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
                    <>
                      <NavLink
                        to={`/project/monitoring/innovation-monitoring-detail/${params.id}`}
                      >
                        <Button startIcon={<Link2 />} size="small"></Button>
                      </NavLink>
                    </>
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

const InnovationDataGrid = ({ processLevelItemId, processLevelTypeId }) => {
  return (
    <React.Fragment>
      <Helmet title="Innovation" />
      <Typography variant="h3" gutterBottom display="inline">
        Innovation
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link
          component={NavLink}
          to={`/project/design-project/${processLevelItemId}/${processLevelTypeId}`}
        >
          Project Monitoring
        </Link>
        <Typography>Innovation</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <InnovationData
        processLevelItemId={processLevelItemId}
        processLevelTypeId={processLevelTypeId}
      />
    </React.Fragment>
  );
};
export default InnovationDataGrid;
