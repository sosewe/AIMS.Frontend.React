import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAttributeTypeById } from "../../../api/attribute-type";
import { Typography } from "@mui/material";

const PrimaryAttributeLabel = ({ primaryResultChainAttribute }) => {
  const {
    data: AttributeData,
    isLoading: isLoadingAttribute,
    isError: isErrorAttribute,
  } = useQuery(
    ["getAttributeTypeById", primaryResultChainAttribute.attributeTypeId],
    getAttributeTypeById,
    { enabled: !!primaryResultChainAttribute.attributeTypeId }
  );

  if (!isLoadingAttribute && !isErrorAttribute) {
    return (
      <Typography variant="h5" gutterBottom display="inline">
        {!isLoadingAttribute && !isErrorAttribute
          ? AttributeData.data.name
          : ""}
      </Typography>
    );
  }
};
export default PrimaryAttributeLabel;
