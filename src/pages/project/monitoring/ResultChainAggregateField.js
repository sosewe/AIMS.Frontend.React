import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Grid } from "@mui/material";
import ResultChainAggregateAttributeField from "./ResultChainAggregateAttributeField";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";
import ResultChainAggregatePrimaryAttributeOnlyField from "./ResultChainAggregatePrimaryAttributeOnlyField";

const PrimaryAttributeOnlyField = ({
  primaryResultChainAttribute,
  resultChainAggregates,
  register,
  setValue,
  year,
  monthId,
  resultChainAttribute,
}) => {
  return (
    <React.Fragment>
      <Grid item md={12}>
        <strong>
          <AttributeOptionLabel
            attributeOptionId={primaryResultChainAttribute.attributeOptionsId}
          />
        </strong>
        &nbsp;
        <br />
        <Grid item md={12}>
          <Grid container spacing={2} justifyContent="left">
            {resultChainAggregates.map((resultChainAggregate) => {
              return (
                <React.Fragment key={Math.random().toString(36)}>
                  <Grid item md={6}>
                    <ResultChainAggregatePrimaryAttributeOnlyField
                      resultChainAttribute={resultChainAttribute}
                      resultChainAggregate={resultChainAggregate}
                      register={register}
                      setValue={setValue}
                      year={year}
                      monthId={monthId}
                      primaryResultChainAttribute={primaryResultChainAttribute}
                    />
                  </Grid>
                </React.Fragment>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const SecondaryAttributeField = ({
  secondaryResultChainAttributes,
  primaryResultChainAttribute,
  resultChainAggregates,
  register,
  setValue,
  year,
  monthId,
  resultChainAttribute,
}) => {
  return (
    <React.Fragment>
      <Grid item md={12}>
        <strong>
          <AttributeOptionLabel
            attributeOptionId={primaryResultChainAttribute.attributeOptionsId}
          />
        </strong>
        &nbsp;
        <br />
        {secondaryResultChainAttributes.map((secondaryResultChainAttribute) => {
          return (
            <React.Fragment key={Math.random().toString(36)}>
              <AttributeOptionLabel
                attributeOptionId={
                  secondaryResultChainAttribute.attributeOptionsId
                }
              />
              &nbsp;
              <Grid item md={12}>
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
                            primaryResultChainAttribute={
                              primaryResultChainAttribute
                            }
                            secondaryResultChainAttribute={
                              secondaryResultChainAttribute
                            }
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

const PrimaryAttributeField = ({
  primaryResultChainAttributes,
  resultChainAggregates,
  register,
  setValue,
  year,
  monthId,
  resultChainAttribute,
}) => {
  return (
    <React.Fragment>
      {primaryResultChainAttributes.map((primaryResultChainAttribute) => {
        return (
          <React.Fragment key={Math.random().toString(36)}>
            {primaryResultChainAttribute.secondaryResultChainAttributes.length >
            0 ? (
              <React.Fragment>
                <SecondaryAttributeField
                  secondaryResultChainAttributes={
                    primaryResultChainAttribute[
                      "secondaryResultChainAttributes"
                    ]
                  }
                  primaryResultChainAttribute={primaryResultChainAttribute}
                  resultChainAggregates={resultChainAggregates}
                  register={register}
                  setValue={setValue}
                  year={year}
                  monthId={monthId}
                  resultChainAttribute={resultChainAttribute}
                />
              </React.Fragment>
            ) : (
              <React.Fragment>
                <PrimaryAttributeOnlyField
                  primaryResultChainAttribute={primaryResultChainAttribute}
                  resultChainAggregates={resultChainAggregates}
                  register={register}
                  setValue={setValue}
                  year={year}
                  monthId={monthId}
                  resultChainAttribute={resultChainAttribute}
                />
              </React.Fragment>
            )}
          </React.Fragment>
        );
      })}
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
        {resultChainAttributes.primaryResultChainAttributes.length > 0 ? (
          <React.Fragment key={Math.random().toString(36)}>
            <PrimaryAttributeField
              primaryResultChainAttributes={
                resultChainAttributes["primaryResultChainAttributes"]
              }
              resultChainAggregates={resultChainAggregates}
              register={register}
              setValue={setValue}
              year={year}
              monthId={monthId}
              resultChainAttribute={resultChainAttributes}
            />
          </React.Fragment>
        ) : (
          ``
        )}
      </Grid>
    </React.Fragment>
  );
};
export default ResultChainAggregateField;
