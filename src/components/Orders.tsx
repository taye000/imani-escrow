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
import ProductDetailModal from './ProductDetailModal';
import { formatDate } from '@/utils/formatDate';
import { IProduct, useProductContext } from '@/context/ProductContext';

const StyledTableRow = styled(TableRow)`
  transition: all 0.3s ease;
  &:hover {
    background-color: primary.dark;
    cursor: pointer;
    transform: translateY(-2px);
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.2);
  }
`;

const CenteredBox = styled(Box) <{ hasProducts: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ hasProducts }) => (hasProducts ? 'min-height: 60vh;' : 'min-height: 30vh;')}
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
    const { products, isLoading, error, addProduct, updateProduct, deleteProduct } = useProductContext();
    const { mode } = useThemeContext();
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedProduct, setSelectedProduct] = React.useState<IProduct | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenModal = (productData: IProduct) => {
        setIsModalOpen(true);
        setSelectedProduct(productData);
        console.log('Product detail modal opened');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        console.log('Product detail modal closed');
    };

    if (error) {
        return (
            <CenteredBox hasProducts={false}>
                <Typography variant="h6">Error loading user products</Typography>
            </CenteredBox>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Title>Orders</Title>
            {isLoading ? (
                <OrderSkeleton />
            ) : products?.length === 0 ? (
                <CenteredBox hasProducts={false}>
                    <FunMessage>
                        Oops! Looks like you haven't added any products yet.
                        <br />
                        Go ahead and add some — your inventory is feeling a bit lonely! 🛒
                    </FunMessage>
                </CenteredBox>
            ) : (
                <TableContainer>
                    <Table size="small" aria-label="products table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell align="right">Price</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products?.map((product) => (
                                <StyledTableRow key={product.id} onClick={() => handleOpenModal(product)}>
                                    <TableCell>{formatDate(product.createdAt)}</TableCell>
                                    <TableCell>{product.productName}</TableCell>
                                    <TableCell>{product.category}</TableCell>
                                    <TableCell>{product.paymentMethod}</TableCell>
                                    <TableCell align="right">{`$${product.price}`}</TableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
            <Link href="#" onClick={preventDefault} sx={{ mt: 3 }} underline="hover">
                See more orders
            </Link>
            {selectedProduct && (
                <ProductDetailModal
                    open={isModalOpen}
                    handleClose={handleCloseModal}
                    product={selectedProduct}
                />
            )}
        </ThemeProvider>
    );
}