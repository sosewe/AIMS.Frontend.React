import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  ListItemIcon,
  MenuItem,
  Paper as MuiPaper,
} from "@mui/material";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
//Date Picker Imports - these should just be in your Context Provider
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { IconButton, Tooltip } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useQuery } from "@tanstack/react-query";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { apiRoutes } from "../../apiRoutes";
import useKeyCloakAuth from "../../hooks/useKeyCloakAuth";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { useNavigate } from "react-router-dom";
import { getLookupMasterItemsByName } from "../../api/lookup";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

const ProjectsDataByUserType = () => {
  const user = useKeyCloakAuth();
  const navigate = useNavigate();
  let processLevelTypeId;
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const { isLoading: isLoadingProcessLevelType, data: processLevelData } =
    useQuery(
      ["processLevelType", "ProcessLevelType"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );
  if (!isLoadingProcessLevelType) {
    const projectProcessLevel = processLevelData.data.filter(
      (obj) => obj.lookupItemName === "Project"
    );
    if (projectProcessLevel.length > 0) {
      processLevelTypeId = projectProcessLevel[0].lookupItemId;
    }
  }
  const {
    data: { data = [], meta } = {}, //your data and api response will probably be different
    isError,
    isRefetching,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "table-data",
      columnFilters, //refetch when columnFilters changes
      globalFilter, //refetch when globalFilter changes
      pagination.pageIndex, //refetch when pagination.pageIndex changes
      pagination.pageSize, //refetch when pagination.pageSize changes
      sorting, //refetch when sorting changes
    ],
    queryFn: async () => {
      const fetchURL = new URL(
        `${apiRoutes.project}/GetProjects/${user?.tokenParsed?.UserLevel}/${user?.tokenParsed?.email}`
      );

      //read our state and pass it to the API as query params
      fetchURL.searchParams.set(
        "implementingOffices",
        JSON.stringify(user?.tokenParsed?.Office)
      );
      fetchURL.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      fetchURL.searchParams.set("size", `${pagination.pageSize}`);
      fetchURL.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
      fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
      fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href);
      const json = await response.json();
      return json;
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "projectCode",
        header: "Project Code",
      },
      {
        accessorKey: "shortTitle",
        header: "Short Title",
      },
      {
        accessorKey: "longTitle",
        header: "Long Title",
      },
      {
        accessorKey: "startingDate",
        header: "Starting Date",
      },
      {
        accessorKey: "endingDate",
        header: "Ending Date",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowActions: true,
    positionActionsColumn: "last",
    initialState: { showColumnFilters: true },
    manualFiltering: true, //turn off built-in client-side filtering
    manualPagination: true, //turn off built-in client-side pagination
    manualSorting: true, //turn off built-in client-side sorting
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error loading data",
        }
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    renderRowActions: ({ row }) => (
      <Box>
        <IconButton
          disabled={!processLevelTypeId}
          onClick={() =>
            navigate(`/project-access/${row.original.id}/${processLevelTypeId}`)
          }
        >
          <LinkOutlinedIcon />
        </IconButton>
      </Box>
    ),
    renderTopToolbarCustomActions: () => (
      <Tooltip arrow title="Refresh Data">
        <IconButton onClick={() => refetch()}>
          <RefreshIcon />
        </IconButton>
      </Tooltip>
    ),
    rowCount: meta?.totalRowCount ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
      sorting,
    },
  });
  return (
    <Card mb={6}>
      <Paper>
        <div style={{ height: 400, width: "100%" }}>
          <MaterialReactTable table={table} />
        </div>
      </Paper>
    </Card>
  );
};
const ProjectHome = () => {
  const navigate = useNavigate();
  return (
    <React.Fragment>
      <Helmet title="Project Home" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Button
          mr={2}
          variant="contained"
          color="error"
          onClick={() => navigate("/project/new-project")}
        >
          <AddIcon /> New Project
        </Button>
        <Divider my={3} />
        <ProjectsDataByUserType />
      </LocalizationProvider>
    </React.Fragment>
  );
};

export default ProjectHome;
