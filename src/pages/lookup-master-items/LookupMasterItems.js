import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
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
import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Edit2 } from "react-feather";
import { useQuery } from "@tanstack/react-query";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const LookupMasterItemsData = () => {
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading, isError } = useQuery([""]);
  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          // onClick={() => navigate("/lookup/new-lookup-master")}
        >
          Manage Lookups
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "80%" }}>
          <DataGrid
            treeData
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
                    <NavLink to={`/lookup/new-lookup-master/${params.id}`}>
                      <Button startIcon={<Edit2 />} size="small"></Button>
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
const LookupMasterItems = () => {
  return (
    <React.Fragment>
      <Helmet title="Lookup Master Items" />
      <Typography variant="h3" gutterBottom display="inline">
        Lookup Master Items
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/lookup/lookupMasterItems">
          Lookup Master Items
        </Link>
        <Typography>Lookup Master Item List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <LookupMasterItemsData />
    </React.Fragment>
  );
};
export default LookupMasterItems;
