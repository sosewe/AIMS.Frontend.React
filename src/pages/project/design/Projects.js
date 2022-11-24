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
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { getProjects } from "../../../api/project";
import { Helmet } from "react-helmet-async";
import { NavLink, useNavigate } from "react-router-dom";
import { Add as AddIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const CardContent = styled(MuiCardContent)(spacing);

const Button = styled(MuiButton)(spacing);

const ProjectsData = () => {
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  // fetch projects
  const { data, isLoading, isError, error } = useQuery(
    ["projects"],
    getProjects,
    {
      retry: 0,
    }
  );

  console.log(data);

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
            rows={isLoading || isError ? [] : data ? data.data : []}
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
