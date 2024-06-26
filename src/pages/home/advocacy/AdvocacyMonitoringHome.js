import React, { useMemo, useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button as MuiButton,
  Card as MuiCard,
  Divider as MuiDivider,
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
import { apiRoutes } from "../../../apiRoutes";
import useKeyCloakAuth from "../../../hooks/useKeyCloakAuth";
import LinkOutlinedIcon from "@mui/icons-material/LinkOutlined";
import { useNavigate } from "react-router-dom";
import { getLookupMasterItemsByName } from "../../../api/lookup";
import { OfficeContext } from "../../../App";
import { UserLevelContext } from "../../../App";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Button = styled(MuiButton)(spacing);
const Divider = styled(MuiDivider)(spacing);

let processLevelItemId;
let processLevelTypeId;

const AdvocaciesDataByUserLevel = () => {
  const userOffice = useContext(OfficeContext);
  const userLevel = useContext(UserLevelContext);
  const user = useKeyCloakAuth();
  const navigate = useNavigate();
  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [totalRowCount, setTotalRowCount] = useState(0);
  const { isLoading: isLoadingProcessLevelType, data: processLevelData } =
    useQuery(
      ["processLevelType", "ProcessLevelType"],
      getLookupMasterItemsByName,
      {
        refetchOnWindowFocus: false,
      }
    );

  if (!isLoadingProcessLevelType) {
    const processLevel = processLevelData.data.filter(
      (obj) => obj.lookupItemName === userLevel
    );
    if (processLevel.length > 0) {
      processLevelTypeId = processLevel[0].lookupItemId;
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
        `${apiRoutes.advocacy}/GetAdvocacies/${processLevelTypeId}/${user?.tokenParsed?.email}`
      );

      //read our state and pass it to the API as query params
      /*fetchURL.searchParams.set(
        "implementingOffices",
        JSON.stringify(user?.tokenParsed?.Office)
      );*/

      const implementingOffice =
        localStorage.getItem("office_setting") ?? user?.tokenParsed?.Office;
      fetchURL.searchParams.set(
        "implementingOffices",
        JSON.stringify(["" + implementingOffice + ""])
      );

      fetchURL.searchParams.set(
        "start",
        `${pagination.pageIndex * pagination.pageSize}`
      );
      fetchURL.searchParams.set("size", `${pagination.pageSize}`);

      fetchURL.searchParams.set(
        "filters",
        columnFilters && columnFilters.length > 0
          ? JSON.stringify(columnFilters)
          : []
      );
      fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
      fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

      //use whatever fetch library you want, fetch, axios, etc
      const response = await fetch(fetchURL.href);
      const json = await response.json();
      setTotalRowCount(json.pageInfo.totalItems);

      return json;
    },
  });

  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
      },
      {
        accessorKey: "startDate",
        header: "Starting Date",
      },
      {
        accessorKey: "endDate",
        header: "Ending Date",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data,
    enableRowActions: true,
    enablePagination: true,
    positionActionsColumn: "last",
    initialState: {
      showColumnFilters: true,
    },
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
            navigate(
              `/advocacy-monitoring/${row.original.id}/${processLevelTypeId}`
            )
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
    //rowCount: meta?.totalRowCount ?? 0,
    rowCount: totalRowCount,
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
        <div style={{ height: "100%", width: "100%" }}>
          <MaterialReactTable table={table} />
        </div>
      </Paper>
    </Card>
  );
};
const AdvocacyMonitoringHome = () => {
  return (
    <React.Fragment>
      <Helmet title="Project Home" />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Divider my={3} />
        <AdvocaciesDataByUserLevel height={1000} />
      </LocalizationProvider>
    </React.Fragment>
  );
};

export default AdvocacyMonitoringHome;
