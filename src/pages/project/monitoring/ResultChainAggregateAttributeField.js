import React from "react";
import styled from "@emotion/styled";
import { TextField as MuiTextField } from "@mui/material";
import { spacing } from "@mui/system";

const TextField = styled(MuiTextField)(spacing);

const ResultChainAggregateAttributeField = ({
  resultChainAttribute,
  resultChainAggregate,
  register,
}) => {
  return (
    <React.Fragment>
      <TextField
        id={resultChainAggregate.id + "/" + resultChainAttribute.id}
        variant="outlined"
        {...register(resultChainAggregate.id + "/" + resultChainAttribute.id)}
      />
    </React.Fragment>
  );
};
export default ResultChainAggregateAttributeField;
