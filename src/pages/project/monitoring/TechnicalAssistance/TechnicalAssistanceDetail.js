import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useParams } from "react-router-dom";
import MonthlyUpdate from "./MonthlyUpdate";
import EditMonthlyUpdate from "./EditMonthlyUpdate";
import QuarterlyUpdate from "./QuarterlyUpdate";
import EditQuarterlyUpdate from "./EditQuarterlyUpdate";
import KMDocumentsUpload from "./KMDocumentsUpload";
import MonthlyUpdateDataGrid from "./MonthlyUpdateDataGrid";
import QuarterlyUpdateDataGrid from "./QuarterlyUpdateDataGrid";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{ width: "100%" }}
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const TechnicalAssistanceDetail = (props) => {
  let {
    processLevelItemId,
    processLevelTypeId,
    technicalAssistanceId,
    projectLocationId,
    reportingPeriod,
    year,
  } = useParams();
  const [value, setValue] = React.useState(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "background.paper",
        display: "flex",
      }}
    >
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Vertical tabs example"
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        <Tab label="Monthly Update" {...a11yProps(0)} />
        <Tab label="Quarterly Update" {...a11yProps(1)} />
        <Tab label="KM Documents Upload" {...a11yProps(2)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <MonthlyUpdate
          processLevelItemId={processLevelItemId}
          processLevelTypeId={processLevelTypeId}
          technicalAssistanceId={technicalAssistanceId}
          projectLocationId={projectLocationId}
          reportingPeriod={reportingPeriod}
          year={year}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <QuarterlyUpdate />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <KMDocumentsUpload />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <KMDocumentsUpload />
      </TabPanel>
    </Box>
  );
};

export default TechnicalAssistanceDetail;
