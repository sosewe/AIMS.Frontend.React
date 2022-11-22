import React, { useState } from "react";
import { useQuery } from "react-query";
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
import { Edit2 as Edit2Icon, Trash as TrashIcon } from "react-feather";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { NavLink, useNavigate } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Add as AddIcon } from "@mui/icons-material";
import { useLookupItems } from "../../api/lookup";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

const Button = styled(MuiButton)(spacing);

const LookupItemsData = () => {
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const { data, isLoading, isError, error } = useQuery(
    "lookupItems",
    useLookupItems,
    {
      retry: 0,
    }
  );
  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/lookup/new-lookupItem")}
        >
          <AddIcon /> Create Lookup Item
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
                    <NavLink to={`/lookup/new-lookupItem/${params.id}`}>
                      <Button startIcon={<Edit2Icon />} size="small"></Button>
                    </NavLink>
                    <NavLink to={`/users/profile/${params.id}`}>
                      <Button startIcon={<TrashIcon />} size="small"></Button>
                    </NavLink>
                  </>
                ),
              },
            ]}
            pageSize={pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            loading={isLoading}
          />
        </div>
      </Paper>
    </Card>
  );
};

const LookupItem = () => {
  return (
    <React.Fragment>
      <Helmet title="Lookup Item" />
      <Typography variant="h3" gutterBottom display="inline">
        Lookup Item
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/lookup/">
          Lookup
        </Link>
        <Typography>Lookup Item</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <LookupItemsData />
    </React.Fragment>
  );
};

export default LookupItem;
