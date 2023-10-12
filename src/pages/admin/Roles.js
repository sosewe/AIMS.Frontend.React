import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import {
  Alert,
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Button as MuiButton,
  Card as MuiCard,
  CardContent as MuiCardContent,
  Checkbox,
  CircularProgress,
  Divider as MuiDivider,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  MenuItem,
  Paper as MuiPaper,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import { NavLink } from "react-router-dom";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useAccount, useMsal } from "@azure/msal-react";
import axios from "axios";
import { useFormik } from "formik";
import * as yup from "yup";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getModules } from "../../api/modules";
import { getByRoleId, savePermissions } from "../../api/permission";
import { toast } from "react-toastify";

const Card = styled(MuiCard)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Divider = styled(MuiDivider)(spacing);
const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);
const CardContent = styled(MuiCardContent)(spacing);
const Button = styled(MuiButton)(spacing);

const AzureRoles = () => {
  const { instance, accounts } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [appRoles, setAppRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roleId, SetRoleId] = useState();

  const { isLoading, isError, data } = useQuery(["getModules"], getModules);
  const {
    isLoading: isLoadingRoles,
    isError: isErrorRoles,
    data: RolesData,
  } = useQuery(["getByRoleId", roleId], getByRoleId, { enabled: !!roleId });

  useEffect(() => {
    if (account) {
      instance
        .acquireTokenSilent({
          scopes: [
            "Application.Read.All",
            "Application.ReadWrite.All",
            "AppRoleAssignment.ReadWrite.All",
          ],
          account: account,
        })
        .then(async (response) => {
          if (response) {
            const res = await axios.get(
              `https://graph.microsoft.com/v1.0/servicePrincipals?$filter=displayName eq '${process.env.REACT_APP_DISPLAY_NAME}'&$select=id,displayName,appId,appRoles`,
              {
                headers: {
                  Authorization: "Bearer " + response.accessToken, //the token is a variable which holds the token
                },
              }
            );
            const roles =
              res.data.value && res.data.value.length > 0
                ? res.data.value[0].appRoles
                : [];
            setAppRoles(roles);
          }
        });
    }
  }, [account, instance]);

  const mutation = useMutation({ mutationFn: savePermissions });
  const formik = useFormik({
    initialValues: {
      appRoleId: "",
      permissions: {},
    },
    validationSchema: yup.object().shape({
      appRoleId: yup.object().required("Please select at least one role."),
      permissions: yup
        .object()
        .required("Please select at least one permission."),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const InData = [];
        const datas = !isLoading && !isError ? data.data : [];
        // Extract the permissions object from values
        const permissions = values.permissions;
        // Get an array of keys with true values from the permissions object
        const trueKeys = Object.keys(permissions).filter(
          (key) => permissions[key] === true
        );
        for (const trueKey of trueKeys) {
          const element = filterNestedItems(datas, trueKey);
          const actionName =
            element.length > 0 &&
            element[0].pages.length > 0 &&
            element[0].pages[0].actions.length > 0
              ? element[0].pages[0].actions[0].name
              : "";
          const InDataObject = {
            RoleName: values.appRoleId.value,
            RoleId: values.appRoleId.id,
            ActionId: trueKey,
            CreateDate: new Date(),
            Name: actionName,
          };
          InData.push(InDataObject);
        }
        await mutation.mutateAsync(InData);
        setSubmitting(false);
        toast("Successfully Updated Permissions", {
          type: "success",
        });
      } catch (error) {
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });
  function filterNestedItems(data, id) {
    if (!data || !Array.isArray(data)) {
      return [];
    }

    return data.reduce((result, item) => {
      const newItem = { ...item }; // Create a new object to avoid modifying the original

      if (item.pages) {
        newItem.pages = filterNestedItems(item.pages, id);
      }

      if (item.actions) {
        newItem.actions = item.actions.filter((action) => action.id === id);
      }

      if (
        (newItem.actions && newItem.actions.length > 0) ||
        (newItem.pages && newItem.pages.length > 0)
      ) {
        result.push(newItem);
      }

      return result;
    }, []);
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    formik.setFieldValue(`permissions.${name}`, checked);
  };
  const onAppRoleChange = async (event) => {
    const roleId = event.target.value.id;
    SetRoleId(roleId);
  };
  useEffect(() => {
    if (!isLoadingRoles && !isErrorRoles) {
      formik.setFieldValue(`permissions`, false);
      for (const roleData of RolesData.data) {
        formik.setFieldValue(`permissions.${roleData.actionId}`, true);
      }
    }
  }, [isLoadingRoles, isErrorRoles, RolesData]);
  return (
    <React.Fragment>
      <Card mb={12}>
        <CardContent>
          <form onSubmit={formik.handleSubmit}>
            {isSubmitting ? (
              <Box display="flex" justifyContent="center" my={6}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <Grid container spacing={12}>
                  <Grid item md={12}>
                    <Typography variant="h3" gutterBottom display="inline">
                      ROLE ADMINISTRATION
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container spacing={6}>
                  <Grid item md={6}>
                    <TextField
                      label="App Role"
                      name="appRoleId"
                      select
                      fullWidth
                      variant="outlined"
                      value={formik.values.appRoleId}
                      error={Boolean(
                        formik.touched.appRoleId && formik.errors.appRoleId
                      )}
                      helperText={
                        formik.touched.appRoleId && formik.errors.appRoleId
                      }
                      onBlur={formik.handleBlur}
                      onChange={(e) => {
                        formik.handleChange(e);
                        onAppRoleChange(e);
                      }}
                      my={2}
                    >
                      <MenuItem disabled value="">
                        Select App Role
                      </MenuItem>
                      {appRoles.map((option) => (
                        <MenuItem key={option.id} value={option}>
                          {option.displayName} ({option.value})
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
                <Grid container spacing={2} sx={{ marginTop: 5 }}>
                  {!isLoading && !isError
                    ? data.data.map((module, i) => (
                        <React.Fragment key={i}>
                          <Grid item md={12} style={{ marginLeft: 10 }}>
                            <Typography
                              variant="h3"
                              gutterBottom
                              display="inline"
                            >
                              Module Name: {module.name}
                            </Typography>
                            {module.pages.length > 0 && (
                              <Grid container spacing={2}>
                                {module.pages.map((page, l) => (
                                  <Grid
                                    item
                                    md={5}
                                    style={{ marginLeft: 5 }}
                                    key={l}
                                  >
                                    <Typography
                                      variant="h3"
                                      gutterBottom
                                      display="inline"
                                    >
                                      Page Name: {page.name}
                                    </Typography>
                                    {page.actions.length > 0 && (
                                      <Grid container spacing={2}>
                                        {page.actions.map((action, k) => (
                                          <React.Fragment key={k}>
                                            <Grid item md={12}>
                                              <FormControlLabel
                                                control={
                                                  <Checkbox
                                                    checked={
                                                      formik.values.permissions[
                                                        action.id
                                                      ] || false
                                                    }
                                                    onChange={
                                                      handleCheckboxChange
                                                    }
                                                    name={action.id}
                                                  />
                                                }
                                                label={action.name}
                                              />
                                            </Grid>
                                          </React.Fragment>
                                        ))}
                                      </Grid>
                                    )}
                                  </Grid>
                                ))}
                              </Grid>
                            )}
                          </Grid>
                        </React.Fragment>
                      ))
                    : ""}
                </Grid>
              </>
            )}
            <Button type="submit" variant="contained" color="primary" mt={3}>
              Save changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </React.Fragment>
  );
};

const Roles = () => {
  return (
    <React.Fragment>
      <Helmet title="Roles" />
      <Typography variant="h3" gutterBottom display="inline">
        Roles
      </Typography>
      <Breadcrumbs aria-label="Breadcrumb" mt={2}>
        <Link component={NavLink} to="/">
          Roles
        </Link>
        <Typography>Roles List</Typography>
      </Breadcrumbs>

      <Divider my={6} />
      <AzureRoles />
    </React.Fragment>
  );
};
export default Roles;
