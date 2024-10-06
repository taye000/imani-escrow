import * as React from 'react';
import { Grid, Typography, Button, IconButton, RadioGroup, FormControlLabel, Radio, TextField, CardMedia, Container, Collapse, CircularProgress, Modal } from '@mui/material';
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WalletIcon from '@mui/icons-material/Wallet';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import withAuth from '@/components/withAuth';
import Loading from '@/loading';
import { useCartContext } from '@/context/CartContext';
import { IOrder, useOrderContext } from '@/context/OrderContext';
import router from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useCustomFuelHook } from '@/context/WalletContext';

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
    const { user } = useUser();
    if (!user) return <div>Please sign in to view this page.</div>;

    const { cart, isLoading, error, updateCart, removeItem, clearCart } = useCartContext();
    const { createOrder } = useOrderContext();
    const { isConnecting, isWalletConnected, connectWallet, disconnectWallet, walletAddress } = useCustomFuelHook();
    if (isWalletConnected) {
        console.log("wallet address", walletAddress);
    }

    const { mode, toggleColorMode } = useThemeContext();
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<'wallet' | 'mpesa' | 'card'>('wallet');
    const [fullName, setFullName] = React.useState('');
    const [address, setAddress] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [city, setCity] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [status, setStatus] = React.useState('Pending');
    const [mpesaPhoneNumber, setMpesaPhoneNumber] = React.useState('');
    const [cardDetailsFilled, setCardDetailsFilled] = React.useState(false);
    const [cardDetails, setCardDetails] = React.useState<CardDetails>({
        cardholderName: '',
        cardNumber: '',
        expiryDate: '',
        cvc: '',
    });

    const [isShippingOpen, setIsShippingOpen] = React.useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = React.useState(false);
    const [confirmationOpen, setConfirmationOpen] = React.useState(false);

    const toggleShippingSection = () => {
        setIsShippingOpen((prev) => !prev);
        if (isPaymentOpen) setIsPaymentOpen(false); // Collapse payment when expanding shipping
    };

    const togglePaymentSection = () => {
        setIsPaymentOpen((prev) => !prev);
        if (isShippingOpen) setIsShippingOpen(false); // Collapse shipping when expanding payment
    };

    const handleWalletConnection = async () => {
        try {
            if (!isWalletConnected) {
                const connected = await connectWallet();
                if (connected) {
                    console.log("connected");
                    toast.success("Wallet Connected Successfully");
                }
            }
        } catch (error: any) {
            console.error("Error handling wallet connection:", error.message);
            toast.error("Error Connecting Wallet");
        }
    };

    const handleWalletDisconnection = async () => {
        try {
            if (isWalletConnected) {
                const disconnect = await disconnectWallet();
                if (disconnect) {
                    console.log("Wallet Disconnected");
                    toast.success("Wallet Disconnected Successfully");
                }
            }
        } catch (error: any) {
            console.error("Error handling wallet disconnection:", error.message);
            toast.error("Error disconnecting Wallet");
        }
    };

    const handleUpdateCart = (productId: string, change: number) => {
        updateCart(productId, change);
    };

    const handleRemoveItem = (productId: string) => {
        removeItem(productId);
    };

    const handlePaymentMethodChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const method = event.target.value as 'wallet' | 'mpesa' | 'card'; // Cast the value
        setSelectedPaymentMethod(method);
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
        setConfirmationOpen(true);
    };

    const handleConfirmPayment = async () => {
        if (!cart || !cart.id) {
            toast.error("Please add products to your cart before proceeding.");
        } else if (selectedPaymentMethod === 'mpesa' && !mpesaPhoneNumber) {
            toast.error("Please enter your M-pesa phone number.");
        } else if (selectedPaymentMethod === 'card' && !cardDetailsFilled) {
            toast.error("Please fill in your card details.");
        } else {
            toast.success("Payment processed successfully!");
            setConfirmationOpen(false);
            setStatus('Paid');
            await handleSaveOrder(cart.id, cart.totalAmount);
            await clearCart();
            router.push("/dashboard");
        }
    };

    const handleSaveOrder = async (cartId: string, totalAmount: number) => {
        if (!user?.sub) {
            toast.error("User is not authenticated");
            return;
        }

        const orderData: IOrder = {
            deliveryAddress: {
                fullName,
                address,
                city,
                country,
                phone,
            },
            paymentDetails: {
                method: selectedPaymentMethod,
                status: status,
                transactionId: undefined, // Update with actual transaction ID after payment.
                ...(selectedPaymentMethod === 'mpesa' && { mpesaPhoneNumber }),
                ...(selectedPaymentMethod === 'card' && { cardDetails }),
                ...(selectedPaymentMethod === 'wallet' && { wallet: walletAddress }),
            },
            cartId,
            totalAmount,
            status: 'pending',
            userId: user.sub,
        };

        try {
            await createOrder(orderData);
        } catch (error) {
            console.error("There was a problem submitting the form:", error);
            throw error;
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
                                {isLoading ? (
                                    <Loading />
                                ) : error ? (
                                    <div>Error Fetching the Data</div>
                                ) : cart?.items.length === 0 ? (
                                    <NoItemsContainer>
                                        <Typography variant="h6">
                                            Uh-oh! Looks like your cart is as empty as a techie's coffee cup at 3 PM.
                                        </Typography>
                                        <Typography variant="body1">
                                            Continue shopping and find something fabulous!
                                        </Typography>
                                        <Button variant="contained" onClick={() => router.push("/marketplace")}>
                                            Continue Shopping
                                        </Button>
                                    </NoItemsContainer>
                                ) : (
                                    cart?.items.map((cartItem: any) => (
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
                                                    <Typography variant="body2">{cartItem.quantity}</Typography>
                                                    <IconButton onClick={() => handleUpdateCart(cartItem.productId.toString(), 1)} color="primary">
                                                        <AddIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleRemoveItem(cartItem.id.toString())} color="secondary">
                                                        <DeleteOutlineIcon />
                                                    </IconButton>
                                                </Box>
                                            </ProductDetails>
                                        </ProductCardContainer>
                                    ))
                                )}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Box>
                                    <SectionTitle variant="h6" onClick={toggleShippingSection} sx={{ cursor: 'pointer' }}>
                                        Delivery/Shipping
                                        <IconButton sx={{ marginLeft: 1 }}>
                                            {isShippingOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </SectionTitle>
                                    <Collapse in={isShippingOpen}>
                                        <form
                                        // onSubmit={handleSubmit}
                                        >
                                            <Grid container spacing={2}>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Full Name"
                                                        value={fullName}
                                                        name="fullName"
                                                        onChange={(e) => setFullName(e.target.value)}
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Address"
                                                        value={address}
                                                        name="address"
                                                        onChange={(e) => setAddress(e.target.value)}
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="City"
                                                        value={city}
                                                        name="city"
                                                        onChange={(e) => setCity(e.target.value)}
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Country"
                                                        value={country}
                                                        name="country"
                                                        onChange={(e) => setCountry(e.target.value)}
                                                        margin="normal"
                                                    />
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        label="Phone"
                                                        value={phone}
                                                        name="phone"
                                                        onChange={(e) => setPhone(e.target.value)}
                                                        margin="normal"
                                                        rows={4}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </form>
                                    </Collapse>
                                </Box>

                                <Box sx={{ mt: 2 }}>
                                    <SectionTitle variant="h6" onClick={togglePaymentSection} sx={{ cursor: 'pointer' }}>
                                        Payment method
                                        <IconButton sx={{ marginLeft: 1 }}>
                                            {isPaymentOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                        </IconButton>
                                    </SectionTitle>
                                    <Collapse in={isPaymentOpen}>
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
                                                {isWalletConnected ? (
                                                    <DisconnectWalletButton onClick={handleWalletDisconnection}>
                                                        Disconnect Wallet
                                                    </DisconnectWalletButton>
                                                ) : (
                                                    <ConnectWalletButton onClick={handleWalletConnection}>
                                                        Connect Wallet
                                                    </ConnectWalletButton>
                                                )}
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
                                            <Typography variant="body2">${cart?.totalAmount}</Typography>
                                        </OrderSummaryItem>

                                        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={handlePayNow}>Pay now</Button>
                                    </Collapse>
                                </Box>
                            </Grid>
                        </Grid>
                    </CheckoutContainer>
                    <Divider />
                    <Footer />
                </Box>
            </Container>
            {/* Confirmation Modal */}
            <ConfirmationModal
                open={confirmationOpen}
                onClose={() => setConfirmationOpen(false)}
            >
                <ModalContent>
                    <Typography variant="h6" align="center">Confirm Payment</Typography>
                    <Typography variant="body1" align="center">
                        Are you sure you want to proceed with the payment?
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: 2,
                            mt: 2
                        }}
                    >
                        <Button
                            variant="contained"
                            onClick={handleConfirmPayment}
                        >
                            Confirm
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={() => setConfirmationOpen(false)}
                        >
                            Cancel
                        </Button>
                    </Box>
                </ModalContent>

            </ConfirmationModal>
            <ToggleCustomTheme showCustomTheme={showCustomTheme} toggleCustomTheme={toggleCustomTheme} />
        </ThemeProvider>
    );
}

export default withAuth(Checkout);


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

const DisconnectWalletButton = styled(Button)`
  width: 50%;
  padding: 16px;
  margin-top: 16px;
  background-color: secondary.light};
  color: white;

  &:hover {
    background-color: secondary.dark};
  }
`;

const ConfirmationModal = styled(Modal)({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
});

const ModalContent = styled(Box)`
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    outline: none;
`;

const NoItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  background-color: #f9f9f9;
  color: #333;
  text-align: center;

  & > p {
    margin: 10px 0;
    font-size: 18px;
  }

  & > button {
    margin-top: 20px;
  }
`;