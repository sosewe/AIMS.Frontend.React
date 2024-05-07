import React, { useState } from "react";
import {
  Autocomplete as MuiAutocomplete,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Paper,
  TextField as MuiTextField,
} from "@mui/material";
import { Guid } from "../../../utils/guid";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteResultChainAggregateById,
  getResultChainAggregateByResultChainIndicatorId,
  saveResultChainAggregate,
} from "../../../api/result-chain-aggregate";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { getAllAggregateDisaggregates } from "../../../api/aggregate-disaggregate";
import { Trash as TrashIcon } from "react-feather";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";

const Autocomplete = styled(MuiAutocomplete)(spacing);
const TextField = styled(MuiTextField)(spacing);

const DisaggregatesModal = ({
  resultChainIndicatorId,
  indicatorAggregates,
  processLevelItemId,
  processLevelTypeId,
  handleClick,
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState();
  const [level3Data, setLevel3Data] = useState([]);
  const queryClient = useQueryClient();

  const { refetch } = useQuery(
    ["deleteResultChainAggregateById", id],
    deleteResultChainAggregateById,
    { enabled: false }
  );

  const {
    data: ResultChains,
    isLoading: isLoadingResultChains,
    isError: isErrorResultChains,
  } = useQuery(
    ["getResultChainAggregateByResultChainIndicatorId", resultChainIndicatorId],
    getResultChainAggregateByResultChainIndicatorId,
    { enabled: !!resultChainIndicatorId }
  );
  const {
    data: AllAggregatesDisAggregates,
    isLoading,
    isError,
  } = useQuery(["getAllAggregateDisaggregates"], getAllAggregateDisaggregates);

  const aggregatesCount = indicatorAggregates.length;
  const mutation = useMutation({ mutationFn: saveResultChainAggregate });
  const formik = useFormik({
    initialValues: {
      sex: [],
      age: [],
      level3: [],
    },
    validationSchema: Yup.object().shape({
      sex: Yup.array().min(aggregatesCount > 0 ? 1 : 0, "Please select gender"),
      age: Yup.array().min(
        aggregatesCount > 0 ? 1 : 0,
        "Please select age groups"
      ),
      level3: Yup.array(),
    }),
    onSubmit: async (values) => {
      try {
        const resultChainAggregate = {
          id: new Guid().toString(),
          createDate: new Date(),
          resultChainIndicatorId,
          processLevelItemId: processLevelItemId,
          processLevelTypeId: processLevelTypeId,
          selectedResultChains: [],
          selectedResultChainAttributes: [],
        };
        if (values && values.level3 && values.level3.length > 0) {
          for (let i = 0; i < values.sex.length; i++) {
            for (let j = 0; j < values.level3.length; j++) {
              resultChainAggregate.selectedResultChains.push({
                disaggregateId1:
                  values.sex[i].aggregateDisaggregate.disaggregate.id,
                disaggregateId2: values.level3[j].disaggregate.id,
              });
            }
          }
        } else {
          for (let i = 0; i < values.sex.length; i++) {
            for (let j = 0; j < values.age.length; j++) {
              resultChainAggregate.selectedResultChains.push({
                disaggregateId1:
                  values.sex[i].aggregateDisaggregate.disaggregate.id,
                disaggregateId2:
                  values.age[j].aggregateDisaggregate.disaggregate.id,
              });
            }
          }
        }

        await mutation.mutateAsync(resultChainAggregate);
        toast("Successfully Created Disaggregates", {
          type: "success",
        });
        handleClick();
      } catch (error) {
        console.log(error);
        toast(error.response.data, {
          type: "error",
        });
      }
    },
  });
  const primaries = indicatorAggregates.filter((obj) => obj.isPrimary === true);
  const secondaries = indicatorAggregates.filter(
    (obj) => obj.isPrimary === false
  );

  const onLevel2Change = (val) => {
    if (!isError && !isLoading) {
      const filteredArray2 = AllAggregatesDisAggregates.data.filter((item2) => {
        const matchingItem1 = val.find(
          (item1) =>
            item1.aggregateDisaggregateId === item2.parentId &&
            item2.disaggregate.level === 3
        );
        return matchingItem1 !== undefined;
      });
      setLevel3Data(filteredArray2);
    }
  };

  function handleClickOpen(id) {
    setOpen(true);
    setId(id);
  }

  function handleClose() {
    setOpen(false);
  }

  const handleAggregateDisaggregate = async () => {
    await refetch();
    setOpen(false);
    await queryClient.invalidateQueries([
      "getResultChainAggregateByResultChainIndicatorId",
    ]);
  };

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={6}>
          <Grid item md={4}>
            <Autocomplete
              id="sex"
              multiple
              options={primaries}
              getOptionLabel={(primary) =>
                `${primary?.aggregateDisaggregate?.disaggregate?.name}`
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.aggregateDisaggregate?.disaggregate?.name}
                  </li>
                );
              }}
              onChange={(_, val) => formik.setFieldValue("sex", val)}
              value={formik.values.sex}
              disabled={aggregatesCount > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(formik.touched.sex && formik.errors.sex)}
                  fullWidth
                  helperText={formik.touched.sex && formik.errors.sex}
                  label="Sex"
                  name="sex"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          <Grid item md={4}>
            <Autocomplete
              id="age"
              multiple
              options={secondaries}
              getOptionLabel={(secondary) =>
                `${secondary?.aggregateDisaggregate?.disaggregate?.name}`
              }
              renderOption={(props, option) => {
                return (
                  <li {...props} key={option.id}>
                    {option.aggregateDisaggregate?.disaggregate?.name}
                  </li>
                );
              }}
              onChange={(_, val) => {
                formik.setFieldValue("age", val);
                onLevel2Change(val);
              }}
              value={formik.values.age}
              disabled={aggregatesCount > 0 ? false : true}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(formik.touched.age && formik.errors.age)}
                  fullWidth
                  helperText={formik.touched.age && formik.errors.age}
                  label="Age(Level 2)"
                  name="age"
                  variant="outlined"
                  my={2}
                />
              )}
            />
          </Grid>
          {level3Data && level3Data.length > 0 && (
            <Grid item md={4}>
              <Autocomplete
                id="level3"
                multiple
                defaultValue={[]}
                options={level3Data}
                getOptionLabel={(option) =>
                  option ? `${option?.disaggregate?.name}` : "No Options"
                }
                renderOption={(props, option) => {
                  return (
                    <li {...props} key={option.id}>
                      {option?.disaggregate?.name}
                    </li>
                  );
                }}
                onChange={(_, val) => formik.setFieldValue("level3", val)}
                value={formik.values.level3}
                disabled={!level3Data?.length}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    error={Boolean(
                      formik.touched.level3 && formik.errors.level3
                    )}
                    fullWidth
                    helperText={formik.touched.level3 && formik.errors.level3}
                    label="Age(Level 3)"
                    name="level3"
                    variant="outlined"
                    my={2}
                  />
                )}
              />
            </Grid>
          )}
        </Grid>
        <Button type="submit" variant="contained" color="primary" mt={3}>
          Save changes
        </Button>
      </form>

      <Card>
        <CardContent>
          <Paper>
            <div style={{ height: 400, width: "100%" }}>
              <DataGrid
                rowsPerPageOptions={[5, 10, 25]}
                rows={
                  isLoadingResultChains || isErrorResultChains
                    ? []
                    : ResultChains
                    ? ResultChains.data
                    : []
                }
                columns={[
                  {
                    field: "disaggregate1",
                    headerName: "Disaggregate 1(Sex)",
                    editable: false,
                    flex: 1,
                    valueGetter: (params) => {
                      return params.value.name;
                    },
                  },
                  {
                    field: "disaggregate2",
                    headerName: "Disaggregate2",
                    editable: false,
                    flex: 1,
                    valueGetter: (params) => {
                      return params.value.name;
                    },
                  },
                  {
                    field: "disaggregate2_level",
                    headerName: "Level",
                    editable: false,
                    flex: 1,
                    valueGetter: (params) => {
                      return params.row.disaggregate2.level;
                    },
                  },
                  {
                    field: "action",
                    headerName: "Action",
                    sortable: false,
                    flex: 1,
                    renderCell: (params) => (
                      <>
                        <Button
                          startIcon={<TrashIcon />}
                          size="small"
                          onClick={() => handleClickOpen(params.id)}
                        ></Button>
                      </>
                    ),
                  },
                ]}
                pageSize={pageSize}
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                loading={isLoadingResultChains}
                components={{ Toolbar: GridToolbar }}
                getRowHeight={() => "auto"}
              />
            </div>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">
                Delete Aggregate Disaggregate
              </DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete Aggregate Disaggregate?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleAggregateDisaggregate} color="primary">
                  Yes
                </Button>
                <Button onClick={handleClose} color="error" autoFocus>
                  No
                </Button>
              </DialogActions>
            </Dialog>
          </Paper>
        </CardContent>
      </Card>
    </>
  );
};
export default DisaggregatesModal;
