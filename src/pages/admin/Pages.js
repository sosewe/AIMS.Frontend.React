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
import { getPages } from "../../api/page";
import PageTabContent from "./PageTabContent";

const Card = styled(MuiCard)(spacing);
const Paper = styled(MuiPaper)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const PagesData = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(
    "e759ccf2-c63c-4360-925e-214f309d89bd"
  );
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { isLoading, isError, data } = useQuery(["getPages"], getPages);
  return (
    <React.Fragment>
      <Card mb={6}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
              >
                {!isLoading && !isError
                  ? data.data.map((page, key) => (
                      <Tab
                        // icon={getIcon(project.icon)}
                        label={page.name}
                        value={page.id.toString()}
                        key={key}
                      />
                    ))
                  : ""}
              </TabList>
            </Box>
            {!isLoading && !isError
              ? data.data.map((page, key) => (
                  <TabPanel value={page.id.toString()} key={key}>
                    <PageTabContent pageId={page.id} />
                  </TabPanel>
                ))
              : ""}
          </TabContext>
        </Box>
      </Card>
    </React.Fragment>
  );
};

const Pages = () => {
  return (
    <React.Fragment>
      <Helmet title="Application Modules" />
      <Typography variant="h3" gutterBottom display="inline">
        Application Pages
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/">
          Application Pages
        </Link>
        <Typography>Application Pages List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <PagesData />
    </React.Fragment>
  );
};
export default Pages;
