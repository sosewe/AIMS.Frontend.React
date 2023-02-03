import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Breadcrumbs as MuiBreadcrumbs,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Divider as MuiDivider,
  Link,
  Typography,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { NavLink, useParams } from "react-router-dom";

const Card = styled(MuiCard)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);

const ProjectMonitoringAccordion = () => {
  return (
    <Card mb={12}>
      <CardContent pb={1}>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Log</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>test</Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <Typography>Update Against Results Framework</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>test 2</Typography>
          </AccordionDetails>
        </Accordion>
      </CardContent>
    </Card>
  );
};

const ProjectMonitoring = () => {
  let { id } = useParams();
  return (
    <React.Fragment>
      <Helmet title="Project Monitoring" />
      <Typography variant="h3" gutterBottom display="inline">
        Project Monitoring
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to={`/project/project-detail/${id}`}>
          Projects Detail
        </Link>
        <Typography>Project Monitoring</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <ProjectMonitoringAccordion />
    </React.Fragment>
  );
};
export default ProjectMonitoring;
