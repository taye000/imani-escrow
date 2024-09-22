import * as React from 'react';
import { Grid, Typography, Button, IconButton, RadioGroup, FormControlLabel, Radio, TextField, CardMedia, Container } from '@mui/material';
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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import WalletIcon from '@mui/icons-material/Wallet';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import withAuth from '@/components/withAuth';
import Loading from '@/loading';
import { useCartContext } from '@/context/CartContext';

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

const ConnectWalletContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 16px;
    padding: 16px;
`;

const ConnectWalletButton = styled(Button)`
  width: 50%;
  padding: 16px;
  margin-top: 16px;
  background-color: primary.light};
  color: white;
  
  &:hover {
    background-color: primary.dark};
  }
`;

export interface CardDetails {
    cardholderName: string;
    cardNumber: string;
    expiryDate: string;
    cvc: string;
}

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

function Checkout() {
    const { cart, isLoading, error, updateCart, removeItem } = useCartContext();

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return <div>Error Fetching the Data</div>;
    }

    if (!cart || cart.items.length === 0) {
        return <div>No items in the cart</div>;
    }

    const handleUpdateCart = (productId: string, change: number) => {
        updateCart(productId, change);
    };

    const handleRemoveItem = (productId: string) => {
        removeItem(productId);
        console.log("Removing item from cart", productId);
    };

    const { mode, toggleColorMode } = useThemeContext();
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState('wallet');
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = React.useState('');
    const [cardDetailsFilled, setCardDetailsFilled] = React.useState(false);
    const [cardDetails, setCardDetails] = React.useState<CardDetails>({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedPaymentMethod(event.target.value);
    };

    const handleMpesaPhoneNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMpesaPhoneNumber(event.target.value);
    };

    const handleCardDetailsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setCardDetails(prevDetails => ({
            ...prevDetails,
            [name]: value
        }));

        setCardDetailsFilled(
            cardDetails.cardholderName !== '' &&
            cardDetails.cardNumber !== '' &&
            cardDetails.expiryDate !== '' &&
            cardDetails.cvc !== ''
        );
    };


    const handlePayNow = () => {
        if (cart.items.length === 0) {
            toast.error("Please add products to your cart before proceeding.");
        } else if (selectedPaymentMethod === 'mpesa' && !mpesaPhoneNumber) {
            toast.error("Please enter your M-pesa phone number.");
        } else if (selectedPaymentMethod === 'card' && !cardDetailsFilled) {
            toast.error("Please fill in your card details.");
        } else {
            // Proceed with payment logic
            console.log("Payment processed successfully!");
            toast.success("Payment processed successfully!");
        }
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
                                {cart.items.map((cartItem: any) => (
                                    <ProductCardContainer key={cartItem.id}>
                                        <ProductImage image={cartItem.productId.additionalImages[0] || 'iphone11.jpg'} />
                                        <ProductDetails>
                                            <TitlePriceContainer>
                                                <Typography variant="body1">Item: {cartItem.productId.productName}</Typography>
                                                <Typography variant="body1">Price: {cartItem.productId.price} {cartItem.productId.currency}</Typography>
                                            </TitlePriceContainer>
                                            <Typography variant="body2">Description: {cartItem.productId.description}</Typography>
                                            <Typography variant="body2">Quantity: {cartItem.quantity}</Typography>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <IconButton onClick={() => handleUpdateCart(cartItem.productId.toString(), -1)} color="secondary">
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography variant="body2">{cartItem.quantity}</Typography> {/* Display current quantity */}
                                                <IconButton onClick={() => handleUpdateCart(cartItem.productId.toString(), 1)} color="primary">
                                                    <AddIcon />
                                                </IconButton>
                                                <IconButton onClick={() => handleRemoveItem(cartItem.id.toString())} color="secondary">
                                                    <DeleteOutlineIcon />
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
                                    <FormControlLabel
                                        value="wallet"
                                        control={<Radio />}
                                        label={
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <WalletIcon sx={{ mr: 1 }} /> Wallet
                                            </Box>
                                        }
                                    />
                                </RadioGroup>

                                {selectedPaymentMethod === 'mpesa' ? (
                                    <TextField label="Phone Number"
                                        fullWidth margin="normal"
                                        value={mpesaPhoneNumber}
                                        onChange={handleMpesaPhoneNumberChange} />
                                ) : selectedPaymentMethod === 'wallet' ? (
                                    <ConnectWalletContainer>
                                        <ConnectWalletButton variant="contained">
                                            Connect Wallet
                                        </ConnectWalletButton>
                                    </ConnectWalletContainer>

                                ) : (
                                    <>
                                        <TextField label="Cardholder name"
                                            name='CardholderName'
                                            fullWidth margin="normal"
                                            onChange={handleCardDetailsChange} />
                                        <TextField label="Card number"
                                            name='CardNumber'
                                            fullWidth margin="normal"
                                            onChange={handleCardDetailsChange} />
                                        <TextField label="Expiry date"
                                            name='ExpiryDate'
                                            fullWidth margin="normal"
                                            onChange={handleCardDetailsChange} />
                                        <TextField label="CVC"
                                            name='cvc'
                                            fullWidth margin="normal"
                                            onChange={handleCardDetailsChange} />
                                    </>
                                )}

                                <SectionTitle variant="h6" sx={{ mt: 3 }}>Order Details</SectionTitle>
                                <OrderSummaryItem>
                                    <Typography variant="body2">Subtotal</Typography>
                                    <Typography variant="body2">${cart.totalAmount}</Typography>
                                </OrderSummaryItem>

                                <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handlePayNow}>Pay now</Button>
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

export default withAuth(Checkout);