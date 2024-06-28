import React from 'react';
import { Skeleton, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import styled from 'styled-components';

const StyledTableRow = styled(TableRow)`
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12);
  padding: '10px';
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: primary.dark}; 
    cursor: pointer;
    transform: translateY(-2px);
    box-shadow: 0px 4px 4px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 2px 6px 0px rgba(0,0,0,0.12);
  }
`;

const OrderSkeleton = () => {
    const skeletonRows = Array.from({ length: 5 }).map((_, index) => (
        <StyledTableRow key={index}>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell><Skeleton variant="text" /></TableCell>
            <TableCell align="right"><Skeleton variant="text" /></TableCell>
        </StyledTableRow>
    ));

    return (
        <Table size="small">
            <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>Payment Method</TableCell>
                    <TableCell align="right">Sale Amount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {skeletonRows}
            </TableBody>
        </Table>
    );
};

export default OrderSkeleton;
