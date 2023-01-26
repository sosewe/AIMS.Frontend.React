import React, { useState } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@mui/material";
import { Guid } from "../../../utils/guid";
import { useMutation } from "@tanstack/react-query";
import { saveResultChainAggregate } from "../../../api/result-chain-aggregate";
import { toast } from "react-toastify";

const DisaggregatesModal = ({
  resultChainIndicatorId,
  indicatorAggregates,
  processLevelItemId,
  processLevelTypeId,
  handleClick,
}) => {
  const primaries = indicatorAggregates.filter((obj) => obj.isPrimary === true);
  const secondaries = indicatorAggregates.filter(
    (obj) => obj.isPrimary === false
  );
  let fields = [];
  for (const primary of primaries) {
    for (const secondary of secondaries) {
      const fieldName =
        primary.aggregateDisaggregate.disaggregate.id +
        "/" +
        secondary.aggregateDisaggregate.disaggregate.id;
      const field = { [fieldName]: false };
      fields.push(field);
    }
  }
  const [inputFields, setInputFields] = useState(fields);
  const handleFormChange = (e) => {
    let data = [...inputFields];
    let val;
    for (let i = 0; i < data.length; i++) {
      if (Object.keys(data[i])[0] === e.target.name) {
        val = i;
      }
    }
    data[val][e.target.name] = e.target.checked;
    setInputFields(data);
  };
  const mutation = useMutation({ mutationFn: saveResultChainAggregate });
  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const resultChainAggregate = {
        id: new Guid().toString(),
        createDate: new Date(),
        resultChainIndicatorId,
        processLevelItemId: processLevelItemId,
        processLevelTypeId: processLevelTypeId,
        selectedResultChains: [],
      };
      for (let i = 0; i < inputFields.length; i++) {
        if (Object.values(inputFields[i])[0]) {
          const arraySelectedAggregateDisaggregate = Object.keys(
            inputFields[i]
          )[0].split("/");
          resultChainAggregate.selectedResultChains.push({
            disaggregateId1: arraySelectedAggregateDisaggregate[0],
            disaggregateId2: arraySelectedAggregateDisaggregate[1],
          });
        }
      }
      await mutation.mutateAsync(resultChainAggregate);
      toast("Successfully Created Disaggregates", {
        type: "success",
      });
      handleClick();
    } catch (error) {
      toast(error.response.data, {
        type: "error",
      });
    }
  };
  return (
    <>
      <form onSubmit={(e) => handleSubmit(e)}>
        <Grid
          container
          spacing={2}
          key={Math.random().toString(36)}
          sx={{ width: "100%" }}
        >
          <Grid item md={6}>
            Disaggregator1
          </Grid>
          <Grid item md={6}>
            Disaggregator2
          </Grid>
        </Grid>
        {primaries.map((primary) => (
          <Grid container spacing={2} key={primary.id} sx={{ width: "100%" }}>
            {secondaries.map((secondary) => (
              <React.Fragment key={primary.id + secondary.id}>
                <Grid item md={6}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          // checked={formik.values.primaryRole}
                          onChange={(event) => handleFormChange(event)}
                          name={
                            primary.aggregateDisaggregate.disaggregate.id +
                            "/" +
                            secondary.aggregateDisaggregate.disaggregate.id
                          }
                        />
                      }
                      label={primary.aggregateDisaggregate.disaggregate.name}
                    />
                  </FormGroup>
                </Grid>
                <Grid item md={6} key={Math.random().toString(36)}>
                  {secondary.aggregateDisaggregate.disaggregate.name}
                </Grid>
              </React.Fragment>
            ))}
          </Grid>
        ))}
        <Button type="submit" variant="contained" color="primary" mt={3}>
          Save changes
        </Button>
      </form>
    </>
  );
};
export default DisaggregatesModal;
