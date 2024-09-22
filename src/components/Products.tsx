import * as React from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Box, createTheme, ThemeProvider } from '@mui/material';
import useSWR from 'swr';
import styled from 'styled-components';
import Title from './Title';
import { useThemeContext } from '@/context/ThemeContext';
import { Product } from '@/pages/marketplace';
import OrderSkeleton from './orderskeleton';
import ProductDetailModal from './ProductDetailModal';
import { formatDate } from '@/utils/formatDate';

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

const CenteredBox = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  height: 60vh;
`;

function preventDefault(event: React.MouseEvent) {
    event.preventDefault();
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Orders() {
    const { mode } = useThemeContext();
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedProduct, setSelectedProduct] = React.useState<Product | null>(null);
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const { data: products, error } = useSWR<Product[]>('/api/product/user', fetcher);

    const handleOpenModal = (productData: Product) => {
        setIsModalOpen(true);
        setSelectedProduct(productData);
        console.log('order detail Modal opened');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        console.log('order detailModal closed');
    };

    const handleBackdropClick = () => {
        handleCloseModal();
    };

    if (error) {
        return (
            <CenteredBox>
                <div>Error loading user products</div>
            </CenteredBox>
        );
    }

    return (
        <ThemeProvider theme={defaultTheme}>
            <Title>Added Products</Title>
            {!products ? (
                <OrderSkeleton />
            ) : (
                <Table size="small">
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
                        {products.map((product) => (
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
            )}
            <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
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
