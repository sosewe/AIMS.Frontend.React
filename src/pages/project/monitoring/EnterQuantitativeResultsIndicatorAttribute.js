import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getIndicatorAttributeType } from "../../../api/indicator-attribute-type";
import MultipleChoicesTemplate from "./MultipleChoicesTemplate";

const EnterQuantitativeResultsIndicatorAttribute = ({
  indicatorAttributeType,
  formik,
  resultChainIndicator,
}) => {
  const { data, isLoading, isError } = useQuery(
    ["getIndicatorAttributeType", indicatorAttributeType.id],
    getIndicatorAttributeType,
    { enabled: !!indicatorAttributeType.id }
  );

  if (!isLoading && !isError) {
    if (
      data.data.attributeType.attributeDataType.dataType === "Multiple choices"
    ) {
      return (
        <React.Fragment key={Math.random().toString(36)}>
          <MultipleChoicesTemplate
            formik={formik}
            attributeTypeId={data.data.attributeTypeId}
            resultChainIndicator={resultChainIndicator}
          />
        </React.Fragment>
      );
    }
  }
};
export default EnterQuantitativeResultsIndicatorAttribute;
