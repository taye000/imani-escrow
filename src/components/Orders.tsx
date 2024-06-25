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
import { Product } from '@/pages/marketplace';

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

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

export default function Orders() {
    const { mode, toggleColorMode } = useThemeContext();
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedOrder, setSelectedOrder] = React.useState<Product | null>(null);
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);

    const [open, setOpen] = React.useState(false);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenModal = (productData: Product) => {
        setIsModalOpen(true);
        setSelectedOrder(productData);
        console.log('order detail Modal opened');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        console.log('order detailModal closed');
    };

    const handleBackdropClick = () => {
        handleCloseModal();
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    React.useEffect(() => {
        const fetchUserProducts = async () => {
            try {
                const response = await fetch('/api/product/user');
                if (!response.ok) {
                    throw new Error('Failed to fetch user products');
                }
                const data: Product[] = await response.json();
                setProducts(data);
                console.log('Fetched user products:', data);
            } catch (error) {
                console.error('Error fetching user products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Title>Recent Orders</Title>
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
                    {products.map((order) => (
                        <StyledTableRow key={order.id} onClick={() => handleOpenModal(order)}>
                            <TableCell>{order.createdAt}</TableCell>
                            <TableCell>{order.productName}</TableCell>
                            <TableCell>{order.address}</TableCell>
                            <TableCell>{order.paymentMethod}</TableCell>
                            <TableCell align="right">{`$${order.price}`}</TableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
            <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
                See more orders
            </Link>
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