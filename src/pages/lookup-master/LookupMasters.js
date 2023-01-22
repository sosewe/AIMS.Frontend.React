import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import styled from "@emotion/styled";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Link,
  Paper as MuiPaper,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { Eye } from "react-feather";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { getLookupMasters } from "../../api/lookup-master";
import { useQuery } from "@tanstack/react-query";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const LookupMastersData = () => {
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery(
    ["getLookupMasters"],
    getLookupMasters
  );

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/lookup/new-lookup-master")}
        >
          <AddIcon /> New Lookup Master
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "80%" }}>
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
                field: "alias",
                headerName: "Alias",
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
                      to={`/programme/new-administrative-programme/${params.id}`}
                    >
                      <Button startIcon={<Eye />} size="small"></Button>
                    </NavLink>
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
      </Paper>
    </Card>
  );
};

const LookupMasters = () => {
  return (
    <React.Fragment>
      <Helmet title="Lookup Masters" />
      <Typography variant="h3" gutterBottom display="inline">
        Lookup Masters
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/lookup/lookupMasters">
          Lookup Masters
        </Link>
        <Typography>Lookup Masters List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <LookupMastersData />
    </React.Fragment>
  );
};
export default LookupMasters;
