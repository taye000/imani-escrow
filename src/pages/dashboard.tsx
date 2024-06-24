import * as React from 'react';
import {
    Container, Grid, Button, ListItemIcon, ListItemText, Paper,
    CssBaseline, Box, Divider, Typography, ThemeProvider, createTheme
} from '@mui/material';
import { useThemeContext } from '@/context/ThemeContext';
import AppAppBar from '@/components/AppBar';
import Footer from '@/components/Footer';
import getLPTheme from '@/getLPTheme';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import AddProductModal from '@/components/AddProductModal';
import Chart from '@/components/Chart';
import Deposits from '@/components/Deposits';
import Orders from '@/components/Orders';

interface ToggleCustomThemeProps {
    showCustomTheme: Boolean;
    toggleCustomTheme: () => void;
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

function ToggleCustomTheme({ showCustomTheme, toggleCustomTheme }: ToggleCustomThemeProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100vw',
                position: 'fixed',
                bottom: 24,
            }}
        >
        </Box>
    );
}

export default function Dashboard() {
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
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        console.log('Modal opened');
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        console.log('Modal closed');
    };

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
            const data = await response.json();
            toast.success(`${data.productName} added successfully`);
        } catch (error) {
            console.error("There was a problem submitting the form:", error);
            toast.error("There was a problem submitting the form");
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
            <Container maxWidth="lg" sx={{ bgcolor: 'background.default', p: 4, pt: 12 }}>
                <MainLayout>
                    <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
                        Dashboard
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <Button onClick={handleOpenModal} sx={{ mb: 2 }}>
                        <ListItemIcon>
                            <AddCircleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Add Product" />
                    </Button>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8} lg={9}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 240,
                                }}
                            >
                                <Chart />
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Paper
                                sx={{
                                    p: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: 240,
                                }}
                            >
                                <Deposits />
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                                <Orders />
                            </Paper>
                        </Grid>
                    </Grid>
                </MainLayout>
                <Divider sx={{ mt: 4, mb: 4 }} />
                <Footer />
            </Container>
            <ToggleCustomTheme
                showCustomTheme={showCustomTheme}
                toggleCustomTheme={toggleCustomTheme}
            />
            <AddProductModal open={isModalOpen} handleClose={handleCloseModal} onSubmit={handleSubmit} />
        </ThemeProvider>
    );
}
