import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Link,
  Paper as MuiPaper,
  Typography,
  Tab,
} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Add } from "@mui/icons-material";
import { NavLink, useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import ModuleTabContent from "./ModuleTabContent";
import { useQuery } from "@tanstack/react-query";
import { getModules } from "../../api/modules";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const ModulesData = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(
    "7d5907e2-6d13-432b-a809-2e997bfb59ed"
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { isLoading, isError, data } = useQuery(["getModules"], getModules);
  return (
    <React.Fragment>
      <Card mb={6}>
        <CardContent pb={1}>
          <Button
            mr={2}
            variant="contained"
            onClick={() => navigate("/admin/new-module")}
          >
            <Add /> New Module
          </Button>
        </CardContent>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                {!isLoading && !isError
                  ? data.data.map((module, key) => (
                      <Tab
                        // icon={getIcon(project.icon)}
                        label={module.name}
                        value={module.id.toString()}
                        key={key}
                      />
                    ))
                  : ""}
              </TabList>
            </Box>
            {!isLoading && !isError
              ? data.data.map((module, key) => (
                  <TabPanel value={module.id.toString()} key={key}>
                    <ModuleTabContent moduleId={module.id} />
                  </TabPanel>
                ))
              : ""}
          </TabContext>
        </Box>
      </Card>
    </React.Fragment>
  );
};

const Modules = () => {
  return (
    <React.Fragment>
      <Helmet title="Application Modules" />
      <Typography variant="h3" gutterBottom display="inline">
        Application Modules
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/">
          Application Modules
        </Link>
        <Typography>Application Modules List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ModulesData />
    </React.Fragment>
  );
};
export default Modules;
