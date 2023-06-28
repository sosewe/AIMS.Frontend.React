import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";
import { Typography } from "@mui/material";

const PrimaryAttributeOptionLabel = ({ primaryResultChainAttribute }) => {
  const {
    data: AttributeResponseOptionData,
    isLoading: isLoadingAttributeResponseOption,
    isError: isErrorAttributeResponseOption,
  } = useQuery(
    [
      "getAttributeResponseOptionById",
      primaryResultChainAttribute.attributeOptionsId,
    ],
    getAttributeResponseOptionById,
    { enabled: !!primaryResultChainAttribute.attributeOptionsId }
  );

  return (
    <Typography variant="body2" gutterBottom display="inline">
      {!isLoadingAttributeResponseOption && !isErrorAttributeResponseOption
        ? AttributeResponseOptionData.data.responseOption
        : ""}
    </Typography>
  );
};
export default PrimaryAttributeOptionLabel;
