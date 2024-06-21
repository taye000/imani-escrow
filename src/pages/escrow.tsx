import * as React from 'react';
import { Grid, Container, TextField, FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '@/components/AppBar';
import Footer from '@/components/Footer';
import getLPTheme from '@/getLPTheme';
import styled from 'styled-components';
import { useThemeContext } from '@/context/ThemeContext';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import toast from 'react-hot-toast';
import { currencies } from '@/components/Hero';

interface ToggleCustomThemeProps {
    showCustomTheme: Boolean;
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

const MainLayout = styled.div`
  display: flex;
  background-color: primary;
  flex-direction: column;
  min-height: 100vh;
  max-width: 80vw;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 20px;
`;

export default function Marketplace() {
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const { mode, toggleColorMode } = useThemeContext();
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    // Get data from URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const transactionType = urlParams.get('transactionType');
    const item = urlParams.get('item');
    const price = urlParams.get('price');
    const currency = urlParams.get('currency');

    const [productName, setProductName] = React.useState(item || "");
    const [paymentMethod, setPaymentMethod] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedTransactionType, setSelectedTransactionType] = React.useState(transactionType || "");
    const [selectedPrice, setSelectedPrice] = React.useState(price || "");
    const [selectedCurrency, setSelectedCurrency] = React.useState(currency || "");

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!productName || !description || !category || !selectedPrice || !paymentMethod || !selectedTransactionType || !selectedCurrency) {
            toast.error("Please fill in all fields");
            return;
        }
        setIsLoading(true);

        const productData = {
            productName,
            description,
            category,
            price: selectedPrice,
            paymentMethod,
            transactionType: selectedTransactionType,
            currency: selectedCurrency,
        };

        try {
            const response = await fetch("api/products", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(productData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (error) {
            console.error("There was a problem submitting the form:", error);
        } finally {
            setIsLoading(false);
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
                    <MainLayout>
                        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                            Initiate Escrow Transaction
                        </Typography>
                        <Divider />
                        <form onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={6}
                                        sx={{ width: '100%', mb: 2 }}
                                    >
                                        <FormControl fullWidth size="small" variant="outlined">
                                            <InputLabel id="transaction-type-label">Transaction</InputLabel>
                                            <Select
                                                labelId="transaction-type-label"
                                                id="transaction-type"
                                                value={selectedTransactionType}
                                                onChange={(e) => setSelectedTransactionType(e.target.value)}
                                                label="Transaction"
                                            >
                                                <MenuItem value="buying">Buying</MenuItem>
                                                <MenuItem value="selling">Selling</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <TextField
                                            fullWidth
                                            id="item"
                                            label="Item Name"
                                            size="small"
                                            onChange={(e) => setProductName(e.target.value)}
                                            value={productName}
                                            variant="outlined"
                                            placeholder="Laptops, vehicles..."
                                            inputProps={{
                                                autoComplete: 'off',
                                                'aria-label': 'Enter the item',
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            id="price"
                                            label="Price"
                                            size="small"
                                            onChange={(e) => setSelectedPrice(e.target.value)}
                                            value={selectedPrice}
                                            variant="outlined"
                                            placeholder="800"
                                            inputProps={{
                                                autoComplete: 'off',
                                                'aria-label': 'Enter the price',
                                            }}
                                        />
                                        <FormControl fullWidth size="small" variant="outlined">
                                            <InputLabel id="currency-label">Currency</InputLabel>
                                            <Select
                                                labelId="currency-label"
                                                id="currency"
                                                value={selectedCurrency}
                                                onChange={(e) => setSelectedCurrency(e.target.value)}
                                                label="Currency"
                                            >
                                                {currencies.map((currency) => (
                                                    <MenuItem key={currency.code} value={currency.code}>
                                                        {currency.label}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <Stack
                                        direction={{ xs: 'column', sm: 'row' }}
                                        spacing={2}
                                        sx={{ width: '100%', mb: 2 }}
                                    >
                                        <FormControl fullWidth size="small" variant="outlined">
                                            <InputLabel id="Category-type-label">Category</InputLabel>
                                            <Select
                                                labelId="Category-type-label"
                                                id="Category"
                                                value={category}
                                                onChange={(e) => setCategory(e.target.value)}
                                                label="Category"
                                            >
                                                <MenuItem value="vehicles">Vehicles</MenuItem>
                                                <MenuItem value="laptops">Laptops</MenuItem>
                                            </Select>
                                        </FormControl>
                                        <FormControl fullWidth size="small" variant="outlined">
                                            <InputLabel id="payment-method-label">Payment Method</InputLabel>
                                            <Select
                                                labelId="payment-method-label"
                                                id="payment-method"
                                                value={paymentMethod}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                label="Payment Method"
                                            >
                                                <MenuItem value="mpesa">M-PESA</MenuItem>
                                                <MenuItem value="card">CARD</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Stack>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        value={description}
                                        name="description"
                                        onChange={(e) => setDescription(e.target.value)}
                                        margin="normal"
                                        multiline
                                        rows={4}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ textAlign: 'center' }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="primary"
                                        disabled={isLoading}
                                        endIcon={isLoading && <CircularProgress size={20} />}
                                    >
                                        Create Escrow
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </MainLayout>
                    <Divider />
                    <Footer />
                </Box>
            </Container>
            <ToggleCustomTheme
                showCustomTheme={showCustomTheme}
                toggleCustomTheme={toggleCustomTheme}
            />
        </ThemeProvider>
    );
}
