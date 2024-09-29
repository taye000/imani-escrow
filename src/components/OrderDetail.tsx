import * as React from "react";
import styled from "styled-components";
import {
    Typography,
    Button,
    Box,
    CssBaseline,
    Grid,
    Container,
    Paper,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AppAppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import getLPTheme from "@/getLPTheme";
import { useThemeContext } from '@/context/ThemeContext';
import { IProduct } from "@/context/ProductContext";

const DetailContainer = styled(Paper)`
  padding: 24px;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const SectionTitle = styled(Typography)`
  font-weight: bold;
  margin-bottom: 16px;
`;

const OrderInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const InfoItem = styled(Typography)`
  margin-top: 8px;
`;

const OrderItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const OrderItem = styled(Box)`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ccc;
`;

const PriceTag = styled(Typography)`
  font-weight: bold;
  color: #3f51b5; /* Example color */
`;

const BackButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  text-transform: none;
  padding: 8px;
`;

interface OrderDetailProps {
    order: {
        id: string;
        items: {
            productId: string;
            quantity: number;
            productDetails?: IProduct;
        }[];
        totalAmount: number;
        paymentDetails: {
            method: string;
            status: string;
            transactionId?: string;
        };
        deliveryAddress: {
            fullName: string;
            address: string;
            city: string;
            country: string;
            phone: string;
        };
        status: string;
        createdAt: string;
        updatedAt: string;
    };
    onBack: () => void;
}

function OrderDetail({ order, onBack }: OrderDetailProps) {
    const { mode, toggleColorMode } = useThemeContext();
    const theme = createTheme(getLPTheme(mode));

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: "background.default", p: 4, pt: 12 }}>
                    <DetailContainer elevation={3}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                {/* Order Items */}
                                <OrderInfoContainer>
                                    <SectionTitle variant="h5">Order Items</SectionTitle>
                                    <OrderItemContainer>
                                        {order.items.map((item, index) => (
                                            <OrderItem key={index}>
                                                <Typography>
                                                    {item.productDetails?.productName || 'Unknown Product'} (x{item.quantity})
                                                </Typography>
                                                <PriceTag>${(Number(item.productDetails?.price) * item.quantity).toFixed(2)}</PriceTag>
                                            </OrderItem>
                                        ))}
                                    </OrderItemContainer>
                                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold' }}>
                                        Total: ${order.totalAmount.toFixed(2)}
                                    </Typography>
                                </OrderInfoContainer>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                {/* Delivery and Payment Details */}
                                <OrderInfoContainer>
                                    <SectionTitle variant="h5">Delivery Address</SectionTitle>
                                    <InfoItem>Full Name: {order.deliveryAddress.fullName}</InfoItem>
                                    <InfoItem>Address: {order.deliveryAddress.address}</InfoItem>
                                    <InfoItem>City: {order.deliveryAddress.city}</InfoItem>
                                    <InfoItem>Country: {order.deliveryAddress.country}</InfoItem>
                                    <InfoItem>Phone: {order.deliveryAddress.phone}</InfoItem>

                                    <SectionTitle variant="h5" sx={{ mt: 4 }}>
                                        Payment Details
                                    </SectionTitle>
                                    <InfoItem>Method: {order.paymentDetails.method}</InfoItem>
                                    <InfoItem>Status: {order.paymentDetails.status}</InfoItem>
                                    {order.paymentDetails.transactionId && (
                                        <InfoItem>Transaction ID: {order.paymentDetails.transactionId}</InfoItem>
                                    )}

                                    <SectionTitle variant="h5" sx={{ mt: 4 }}>
                                        Order Status
                                    </SectionTitle>
                                    <InfoItem>Status: {order.status}</InfoItem>
                                    <InfoItem>Created At: {new Date(order.createdAt).toLocaleString()}</InfoItem>
                                    <InfoItem>Updated At: {new Date(order.updatedAt).toLocaleString()}</InfoItem>
                                </OrderInfoContainer>
                            </Grid>
                        </Grid>
                    </DetailContainer>

                    <BackButton variant="outlined" color="inherit" onClick={onBack}>
                        Back to Orders
                    </BackButton>
                    <Footer />
                </Box>
            </Container>
        </ThemeProvider>
    );
}

export default OrderDetail;
