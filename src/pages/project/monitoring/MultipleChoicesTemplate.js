import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttributeResponseOptions } from "../../../api/attribute-response-option";
import AttributeResponseOptionField from "./AttributeResponseOptionField";

const MultipleChoicesTemplate = ({
  formik,
  attributeTypeId,
  resultChainIndicator,
}) => {
  const {
    data: attributeResponseOptions,
    isLoading: isLoadingAttributeResponseOptions,
    isError: isErrorAttributeResponseOptions,
  } = useQuery(
    ["getAttributeResponseOptions", attributeTypeId],
    getAttributeResponseOptions,
    { enabled: !!attributeTypeId }
  );
  return (
    <React.Fragment>
      {!isLoadingAttributeResponseOptions && !isErrorAttributeResponseOptions
        ? attributeResponseOptions.data.map((attributeResponseOption) => {
            return (
              <React.Fragment key={Math.random().toString(36)}>
                <AttributeResponseOptionField
                  formik={formik}
                  attributeResponseOption={attributeResponseOption}
                  resultChainIndicator={resultChainIndicator}
                />
              </React.Fragment>
            );
          })
        : ""}
    </React.Fragment>
  );
};
export default MultipleChoicesTemplate;
