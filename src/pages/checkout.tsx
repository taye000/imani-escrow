import * as React from 'react';
import { Grid, Typography, Button, IconButton, RadioGroup, FormControlLabel, Radio, TextField, Card, CardMedia, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '@/components/AppBar';
import Footer from '@/components/Footer';
import getLPTheme from '@/getLPTheme';
import { useThemeContext } from '@/context/ThemeContext';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import styled from 'styled-components';
import { productData } from './marketplace';
import { ICartItem } from '@/models/cart';
import { Types } from 'mongoose';
import toast from 'react-hot-toast';

const ProductCardContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ProductDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const TitlePriceContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline; 
`;

const CheckoutContainer = styled.div`
  padding: 24px;
  max-width: 960px;
  margin: 0 auto; 
  display: flex;
  justify-content: space-between;
  height: 100vh; 
`;

const ProductImage = styled(CardMedia)`
  height: 80px;
  width: 80px;
  margin-right: 16px;
  border-radius: 8px;
`;

const SectionTitle = styled(Typography)`
  font-weight: bold;
  margin-bottom: 16px;
`;

const OrderSummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
`;

interface ToggleCustomThemeProps {
    showCustomTheme: boolean;
    toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
    showCustomTheme,
    toggleCustomTheme,
}: ToggleCustomThemeProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100dvw',
                position: 'fixed',
                bottom: 24,
            }}
        >
        </Box>
    );
}

const updateCart = async (cartItems: ICartItem[]) => {
    try {
        const response = await fetch("/api/edit-cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ items: cartItems }),
        });

        if (response.ok) {
            const result = await response.json();
            console.log("Cart updated successfully:", result);
            toast.success("Cart updated successfully");
        } else {
            console.error("Failed to update cart");
            toast.error("Failed to update cart");
        }
    } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to update cart, try again later.");
    }
};

export default function Checkout() {
    const { mode, toggleColorMode } = useThemeContext();
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('card');
    const [cartItems, setCartItems] = React.useState<ICartItem[]>([]);

    React.useEffect(() => {
        // Initialize cart items from product data or fetch from backend if necessary
        const initialCartItems = productData.map(product => ({
            productId: new Types.ObjectId(product.id),
            quantity: 1, // Default quantity
        }));
        setCartItems(initialCartItems);
    }, []);

    const handleUpdateCart = (productId: string, quantity: number) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.productId.toString() === productId
                    ? { ...item, quantity }
                    : item
            ).filter(item => item.quantity > 0); // Remove items with 0 quantity
            updateCart(updatedItems);
            return updatedItems;
        });
    };

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    return (
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <CssBaseline />
            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: 'background.default', p: 4, pt: 12 }}>
                    <CheckoutContainer>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <SectionTitle variant="h6">Check out</SectionTitle>
                                {productData.map((product) => (
                                    <ProductCardContainer key={product.id}>
                                        <ProductImage image={product.image} />
                                        <ProductDetails>
                                            <TitlePriceContainer>
                                                <Typography variant="body1">{product.productName}</Typography>
                                                <Typography variant="body1">{product.price}</Typography>
                                            </TitlePriceContainer>
                                            <Typography variant="body2">{product.description}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton onClick={() => handleUpdateCart(product.id, 0)} color="secondary">
                                                    <RemoveIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleUpdateCart(product.id, 1)} color="primary">
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </ProductDetails>
                                    </ProductCardContainer>
                                ))}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <SectionTitle variant="h6">Payment method</SectionTitle>
                                <RadioGroup defaultValue="card" onChange={handlePaymentMethodChange} value={selectedPaymentMethod}>
                                    <FormControlLabel
                                        value="mpesa"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <PhoneIphoneIcon sx={{ mr: 1 }} /> M-pesa
                                            </Box>
                                        }
                                    />
                                    <FormControlLabel
                                        value="card"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <CreditCardIcon sx={{ mr: 1 }} /> Debit/Credit card
                                            </Box>
                                        }
                                    />
                                </RadioGroup>

                                {selectedPaymentMethod === 'mpesa' ? (
                                    <TextField label="Phone Number" fullWidth margin="normal" />
                                ) : (
                                    <>
                                        <TextField label="Cardholder name" fullWidth margin="normal" />
                                        <TextField label="Card number" fullWidth margin="normal" />
                                        <TextField label="Expiry date" fullWidth margin="normal" />
                                        <TextField label="CVC" fullWidth margin="normal" />
                                    </>
                                )}

                                <SectionTitle variant="h6" sx={{ mt: 3 }}>Order Details</SectionTitle>
                                <OrderSummaryItem>
                                    <Typography variant="body2">Subtotal</Typography>
                                    <Typography variant="body2">$945.97</Typography>
                                </OrderSummaryItem>

                                <Button variant="contained" fullWidth sx={{ mt: 2 }}>Pay now</Button>
                            </Grid>
                        </Grid>
                    </CheckoutContainer>
                    <Divider />
                    <Footer />
                </Box>
            </Container>
            <ToggleCustomTheme showCustomTheme={showCustomTheme} toggleCustomTheme={toggleCustomTheme} />
        </ThemeProvider>
    );
}
