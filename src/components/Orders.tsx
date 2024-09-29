import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, createTheme, ThemeProvider, Typography } from '@mui/material';
import styled from 'styled-components';
import Title from './Title';
import { useThemeContext } from '@/context/ThemeContext';
import OrderSkeleton from './orderskeleton';
import { formatDate } from '@/utils/formatDate';
import { useOrderContext, IFetchOrder } from '@/context/OrderContext';
import OrderDetailModal from './OrderDetailModal';

const StyledTableRow = styled(TableRow)`
  transition: all 0.3s ease;
  &:hover {
    background-color: primary.dark;
    cursor: pointer;
    transform: translateY(-2px);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const CenteredBox = styled(Box) <{ hasOrders: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ hasOrders }) => (hasOrders ? 'min-height: 60vh;' : 'min-height: 30vh;')}
  color: primary.dark;
  text-align: center;
`;

const TableContainer = styled(Box)`
  margin-top: 16px;
  border-radius: 8px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
`;

const FunMessage = styled(Typography)`
  font-size: 1.2rem;
  color: primary.main;
  margin: 16px;
  line-height: 1.5;
  text-align: center;
`;

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

export default function Orders() {
    // Fetch orders from OrderContext
    const { orders, isLoading, error } = useOrderContext();
    const { mode } = useThemeContext();
    const defaultTheme = createTheme({ palette: { mode } });

    // Modal state
    const [selectedOrder, setSelectedOrder] = React.useState<IFetchOrder | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenOrderDetails = (orderData: IFetchOrder) => {
        setSelectedOrder(orderData);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    if (error) {
        return (
            <CenteredBox hasOrders={false}>
                <Typography variant="h6">Error loading user orders</Typography>
            </CenteredBox>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Title>Orders</Title>
            {isLoading ? (
                <OrderSkeleton />
            ) : orders?.length === 0 ? (
                <CenteredBox hasOrders={false}>
                    <FunMessage>
                        Oops! It seems like you have no orders yet.
                        <br />
                        Place an order and check back later! 📦
                    </FunMessage>
                </CenteredBox>
            ) : (
                <TableContainer>
                    <Table size="small" aria-label="orders table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell align="right">Total Amount</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders?.map((order) => (
                                <StyledTableRow key={order.id} onClick={() => handleOpenOrderDetails(order)}>
                                    <TableCell>{formatDate((order.createdAt) ?? new Date().toISOString())}</TableCell>
                                    <TableCell>{order.id}</TableCell>
                                    <TableCell>{order.status}</TableCell>
                                    <TableCell>{order.paymentDetails.method}</TableCell>
                                    <TableCell align="right">{`$${order.totalAmount.toFixed(2)}`}</TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            <Link href="#" onClick={preventDefault} sx={{ mt: 3 }} underline="hover">
                See more orders
            </Link>

            {/* Add OrderDetailModal here */}
            {selectedOrder && (
                <OrderDetailModal
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    order={selectedOrder}
                />
            )}
        </ThemeProvider>
    );
}
