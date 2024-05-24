import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import styled from 'styled-components';
import { createTheme, ThemeProvider } from '@mui/material';
import getLPTheme from '@/getLPTheme';
import { useThemeContext } from '@/context/ThemeContext';
import OrderDetailModal from './OrderDetailModal';

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

interface Order {
    id: number;
    date: string;
    name: string;
    shipTo: string;
    paymentMethod: string;
    amount: number;
}

// Sample Order Data
const orders: Order[] = [
    {
        id: 0,
        date: '16 Mar, 2019',
        name: 'Elvis Presley',
        shipTo: 'Tupelo, MS',
        paymentMethod: 'VISA ⠀•••• 3719',
        amount: 312.44,
    },
    {
        id: 1,
        date: '23 Mar, 2019',
        name: 'Paul McCartney',
        shipTo: 'London, UK',
        paymentMethod: 'VISA ⠀•••• 2574',
        amount: 866.99,
    },
    {
        id: 2,
        date: '23 Mar, 2019',
        name: 'Tom Scholz',
        shipTo: 'Boston, MA',
        paymentMethod: 'MC ⠀•••• 1253',
        amount: 100.81,
    },
    {
        id: 3,
        date: '24 Mar, 2019',
        name: 'Michael Jackson',
        shipTo: 'Gary, IN',
        paymentMethod: 'AMEX ⠀•••• 2000',
        amount: 654.39,
    },
    {
        id: 4,
        date: '24 Mar, 2019',
        name: 'Bruce Springsteen',
        shipTo: 'Long Branch, NJ',
        paymentMethod: 'VISA ⠀•••• 5919',
        amount: 212.79,
    },
];

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

export default function Orders() {
    const { mode, toggleColorMode } = useThemeContext();
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null);

    const [open, setOpen] = React.useState(true);

    const handleOpenModal = (order: Order) => {
        setOpen(true);
        setSelectedOrder(order);
        console.log('order detail Modal opened');
    };

    const handleCloseModal = () => {
        setOpen(false);
        console.log('order detailModal closed');
    };

    const handleBackdropClick = () => {
        handleCloseModal();
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };
    return (
        <ThemeProvider theme={defaultTheme}>
            <Title>Recent Orders</Title>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Date</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Ship To</TableCell>
                        <TableCell>Payment Method</TableCell>
                        <TableCell align="right">Sale Amount</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {orders.map((order) => (
                        <StyledTableRow key={order.id} onClick={() => handleOpenModal(order)}>
                            <TableCell>{order.date}</TableCell>
                            <TableCell>{order.name}</TableCell>
                            <TableCell>{order.shipTo}</TableCell>
                            <TableCell>{order.paymentMethod}</TableCell>
                            <TableCell align="right">{`$${order.amount}`}</TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                See more orders
            </Link>
            {selectedOrder && ( // Render the OrderDetailModal if selectedOrder is not null
                <OrderDetailModal
                    open={true}
                    handleClose={handleCloseModal}
                    order={selectedOrder}

                />
            )}
        </ThemeProvider>
    );
}