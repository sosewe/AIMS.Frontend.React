import React from "react";

import { Grid, TextField as MuiTextField } from "@mui/material";
import styled from "@emotion/styled";
import { spacing } from "@mui/system";
import { useQuery } from "@tanstack/react-query";
import { getAttributeTypeById } from "../../../api/attribute-type";

const TextField = styled(MuiTextField)(spacing);

const AttributeField = ({ resultChainAttribute, register }) => {
  const {
    data: AttributeData,
    isLoading: isLoadingAttribute,
    isError: isErrorAttribute,
  } = useQuery(
    ["getAttributeTypeById", resultChainAttribute.attributeId],
    getAttributeTypeById,
    { enabled: !!resultChainAttribute.attributeId }
  );

  return (
    <Grid container spacing={6} justifyContent="left" direction="row">
      <Grid item md={4}>
        {!isLoadingAttribute && !isErrorAttribute
          ? AttributeData.data.name
          : ""}
      </Grid>
      <Grid item md={4}>
        <TextField
          id={resultChainAttribute.id}
          variant="outlined"
          {...register(resultChainAttribute.id)}
        />
      </Grid>
    </Grid>
  );
};

const ResultChainAttributeOnlyField = ({ resultChainAttributes, register }) => {
  return (
    <Grid container spacing={6} justifyContent="center">
      <Grid item md={12}>
        {resultChainAttributes.map((resultChainAttribute) => {
          return (
            <React.Fragment key={Math.random().toString(36)}>
              <AttributeField
                resultChainAttribute={resultChainAttribute}
                register={register}
              />
            </React.Fragment>
          );
        })}
      </Grid>
    </Grid>
  );
};
export default ResultChainAttributeOnlyField;
