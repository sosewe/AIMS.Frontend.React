import React from "react";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import ResultChainAggregateAttributeField from "./ResultChainAggregateAttributeField";
import ResultChainAggregatePrimaryAttributeOnlyField from "./ResultChainAggregatePrimaryAttributeOnlyField";
import styled from "@emotion/styled";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import PrimaryAttributeLabel from "./PrimaryAttributeLabel";
import SecondaryAttributeLabel from "./SecondaryAttributeLabel";
import AggregateDisAggregateLabel from "./AggregateDisAggregateLabel";
import PrimaryAttributeOptionLabel from "./PrimaryAttributeOptionLabel";
import SecondaryAttributeOptionLabel from "./SecondaryAttributeOptionLabel";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

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
      <TableHead sx={{ backgroundColor: "#4472C4" }}>
        <TableRow>
          <StyledTableCell>
            Attribute1 (
            <PrimaryAttributeLabel
              primaryResultChainAttribute={
                resultChainAttribute.primaryResultChainAttributes[0]
              }
            />
            )
          </StyledTableCell>
          {resultChainAttribute.primaryResultChainAttributes[0]
            .secondaryResultChainAttributes.length > 0 && (
            <StyledTableCell>
              Attribute2 (
              <SecondaryAttributeLabel
                secondaryResultChainAttribute={
                  resultChainAttribute.primaryResultChainAttributes[0]
                    .secondaryResultChainAttributes[0]
                }
              />
              )
            </StyledTableCell>
          )}
          {resultChainAggregates.map((resultChainAggregate, i) => (
            <StyledTableCell key={i}>
              <AggregateDisAggregateLabel
                resultChainAggregate={resultChainAggregate}
              />
            </StyledTableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {primaryResultChainAttributes.map((primaryResultChainAttribute, i) => (
          <React.Fragment key={Math.random().toString(36)}>
            <StyledTableRow key={i}>
              <StyledTableCell
                rowSpan={
                  primaryResultChainAttribute.secondaryResultChainAttributes
                    .length + 1
                }
              >
                <PrimaryAttributeOptionLabel
                  primaryResultChainAttribute={primaryResultChainAttribute}
                />
              </StyledTableCell>
              {primaryResultChainAttribute.secondaryResultChainAttributes
                .length === 0 && (
                <React.Fragment>
                  {resultChainAggregates.map((resultChainAggregate, i) => (
                    <StyledTableCell key={i}>
                      <ResultChainAggregatePrimaryAttributeOnlyField
                        resultChainAttribute={resultChainAttribute}
                        resultChainAggregate={resultChainAggregate}
                        register={register}
                        setValue={setValue}
                        year={year}
                        monthId={monthId}
                        primaryResultChainAttribute={
                          primaryResultChainAttribute
                        }
                      />
                    </StyledTableCell>
                  ))}
                </React.Fragment>
              )}
            </StyledTableRow>
            {primaryResultChainAttribute.secondaryResultChainAttributes.map(
              (secondaryResultChainAttribute, i) => (
                <StyledTableRow key={i}>
                  <StyledTableCell>
                    <SecondaryAttributeOptionLabel
                      secondaryResultChainAttribute={
                        secondaryResultChainAttribute
                      }
                    />
                  </StyledTableCell>
                  {resultChainAggregates.map((resultChainAggregate) => (
                    <React.Fragment key={Math.random().toString(36)}>
                      <StyledTableCell>
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
                      </StyledTableCell>
                    </React.Fragment>
                  ))}
                </StyledTableRow>
              )
            )}
          </React.Fragment>
        ))}
      </TableBody>
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
    </React.Fragment>
  );
};
export default ResultChainAggregateField;
