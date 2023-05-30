import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid, Typography } from "@mui/material";
import ResultChainAggregateAttributeField from "./ResultChainAggregateAttributeField";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";
import { getAttributeTypeById } from "../../../api/attribute-type";

const AttributeName = ({ attributeId }) => {
  const {
    data: AttributeData,
    isLoading: isLoadingAttribute,
    isError: isErrorAttribute,
  } = useQuery(["getAttributeTypeById", attributeId], getAttributeTypeById, {
    enabled: !!attributeId,
  });
  return (
    <React.Fragment>
      <Typography variant="h5" gutterBottom display="inline">
        {!isLoadingAttribute && !isErrorAttribute
          ? AttributeData.data.name
          : ""}
      </Typography>
    </React.Fragment>
  );
};

const AttributeOptionLabel = ({ attributeOptionId }) => {
  const {
    data: attributeOptionData,
    isLoading: isLoadingAttributeOption,
    isError: isErrorAttributeOption,
  } = useQuery(
    ["getAttributeResponseOptionById", attributeOptionId],
    getAttributeResponseOptionById,
    { enabled: !!attributeOptionId }
  );

  return (
    <React.Fragment>
      {!isLoadingAttributeOption && !isErrorAttributeOption
        ? attributeOptionData.data.responseOption
        : ""}
    </React.Fragment>
  );
};

const ResultChainAggregateField = ({
  resultChainAggregates,
  resultChainAttributes,
  register,
  setValue,
  year,
  monthId,
}) => {
  return (
    <React.Fragment>
      <Grid container spacing={2} justifyContent="center">
        {resultChainAttributes.map((resultChainAttribute) => {
          return (
            <React.Fragment key={Math.random().toString(36)}>
              <Grid item md={12}>
                <AttributeName attributeId={resultChainAttribute.attributeId} />
              </Grid>
              <Grid item md={12}>
                <AttributeOptionLabel
                  attributeOptionId={resultChainAttribute.attributeOptionsId}
                />
              </Grid>
              <Grid item md={6}>
                <Grid container spacing={2} justifyContent="left">
                  {resultChainAggregates.map((resultChainAggregate) => {
                    return (
                      <React.Fragment key={Math.random().toString(36)}>
                        <Grid item md={6}>
                          <ResultChainAggregateAttributeField
                            resultChainAttribute={resultChainAttribute}
                            resultChainAggregate={resultChainAggregate}
                            register={register}
                            setValue={setValue}
                            year={year}
                            monthId={monthId}
                          />
                        </Grid>
                      </React.Fragment>
                    );
                  })}
                </Grid>
              </Grid>
            </React.Fragment>
          );
        })}
      </Grid>
    </React.Fragment>
  );
};
export default ResultChainAggregateField;
