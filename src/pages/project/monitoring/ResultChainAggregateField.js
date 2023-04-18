import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid } from "@mui/material";
import { getAttributeTypeById } from "../../../api/attribute-type";
import ResultChainAggregateLabels from "./ResultChainAggregateLabels";
import ResultChainAggregateAttributeField from "./ResultChainAggregateAttributeField";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";

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
  const attribute = resultChainAttributes[0];
  const {
    data: AttributeData,
    isLoading: isLoadingAttribute,
    isError: isErrorAttribute,
  } = useQuery(
    ["getAttributeTypeById", attribute.attributeId],
    getAttributeTypeById,
    { enabled: !!attribute.attributeId }
  );
  return (
    <React.Fragment>
      <Grid container spacing={2} justifyContent="left">
        <Grid item md={12}>
          {!isLoadingAttribute && !isErrorAttribute
            ? AttributeData.data.name
            : ""}
        </Grid>
        {/*{resultChainAggregates.map((resultChainAggregate) => {*/}
        {/*  return (*/}
        {/*    <React.Fragment key={Math.random().toString(36)}>*/}
        {/*      <ResultChainAggregateLabels*/}
        {/*        resultChainAggregate={resultChainAggregate}*/}
        {/*      />*/}
        {/*    </React.Fragment>*/}
        {/*  );*/}
        {/*})}*/}
      </Grid>
      <Grid container spacing={2} justifyContent="center">
        {resultChainAttributes.map((resultChainAttribute) => {
          return (
            <React.Fragment key={Math.random().toString(36)}>
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
