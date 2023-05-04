import React, { useState } from "react";
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
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { getProjects } from "../../../api/project";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { toast } from "react-toastify";
import { Link2 } from "react-feather";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const ProjectsData = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // fetch projects
  const { data, isLoading, isError, error } = useQuery(
    ["projects", page, pageSize],
    getProjects,
    {
      retry: 0,
    }
  );

  if (isLoading) {
    return `loading....`;
  }

  if (isError) {
    toast(error.response.data, {
      type: "error",
    });
  }

  const { pageInfo } = data.data;

  return (
    <Card mb={6}>
      <CardContent pb={1}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/project/new-project")}
        >
          <AddIcon /> New Project
        </Button>
      </CardContent>
      <br />
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <DataGrid
            rowsPerPageOptions={[5, 10, 25]}
            rows={isLoading || isError ? [] : data ? data.data.data : []}
            columns={[
              {
                field: "projectCode",
                headerName: "Project Code",
                editable: false,
                flex: 1,
              },
              {
                field: "shortTitle",
                headerName: "Short Title",
                editable: false,
                flex: 1,
              },
              {
                field: "longTitle",
                headerName: "Long Title",
                editable: false,
                flex: 1,
              },
              {
                field: "startingDate",
                headerName: "Start Date",
                editable: false,
                flex: 1,
                valueFormatter: (params) =>
                  params?.value
                    ? format(new Date(params.value), "dd-MMM-yyyy")
                    : "",
              },
              {
                field: "endingDate",
                headerName: "End Date",
                editable: false,
                flex: 1,
                valueFormatter: (params) =>
                  params?.value
                    ? format(new Date(params.value), "dd-MMM-yyyy")
                    : "",
              },
              {
                field: "action",
                headerName: "Action",
                sortable: false,
                flex: 1,
                renderCell: (params) => (
                  <>
                    <NavLink to={`/project/project-detail/${params.id}`}>
                      <Button startIcon={<Link2 />} size="small"></Button>
                    </NavLink>
                  </>
                ),
              },
            ]}
            pageSize={pageInfo.pageSize}
            onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
            loading={isLoading}
            components={{ Toolbar: GridToolbar }}
            paginationMode="server"
            rowCount={pageInfo.totalItems}
            pagination
            onPageChange={async (newPage) => {
              setPage(newPage + 1);
              await queryClient.invalidateQueries(["projects"]);
            }}
          />
        </div>
      </Paper>
    </Card>
  );
};

const Projects = () => {
  return (
    <React.Fragment>
      <Helmet title="Projects" />
      <Typography variant="h3" gutterBottom display="inline">
        Projects
      </Typography>

      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/project/projects">
          Projects
        </Link>
        <Typography>Projects List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ProjectsData />
    </React.Fragment>
  );
};

export default Projects;
