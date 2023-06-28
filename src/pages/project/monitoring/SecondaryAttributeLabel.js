import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttributeTypeById } from "../../../api/attribute-type";
import { Typography } from "@mui/material";

const SecondaryAttributeLabel = ({ secondaryResultChainAttribute }) => {
  const {
    data: SecondaryAttributeData,
    isLoading: isLoadingSecondaryAttribute,
    isError: isErrorSecondaryAttribute,
  } = useQuery(
    ["getAttributeTypeById", secondaryResultChainAttribute.attributeTypeId],
    getAttributeTypeById,
    { enabled: !!secondaryResultChainAttribute.attributeTypeId }
  );

  return (
    <Typography variant="h5" gutterBottom display="inline">
      {!isLoadingSecondaryAttribute && !isErrorSecondaryAttribute
        ? SecondaryAttributeData.data.name
        : ""}
    </Typography>
  );
};
export default SecondaryAttributeLabel;
