import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttributeResponseOptionById } from "../../../api/attribute-response-option";
import { Typography } from "@mui/material";

const SecondaryAttributeOptionLabel = ({ secondaryResultChainAttribute }) => {
  const {
    data: SecondaryAttributeResponseOptionData,
    isLoading: isLoadingSecondaryAttributeResponseOption,
    isError: isErrorSecondaryAttributeResponseOption,
  } = useQuery(
    [
      "getAttributeResponseOptionById",
      secondaryResultChainAttribute.attributeOptionsId,
    ],
    getAttributeResponseOptionById,
    { enabled: !!secondaryResultChainAttribute.attributeOptionsId }
  );

  return (
    <Typography variant="body2" gutterBottom display="inline">
      {!isLoadingSecondaryAttributeResponseOption &&
      !isErrorSecondaryAttributeResponseOption
        ? SecondaryAttributeResponseOptionData.data.responseOption
        : ""}
    </Typography>
  );
};
export default SecondaryAttributeOptionLabel;
