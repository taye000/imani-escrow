import * as React from 'react';
import { PaletteMode, Grid, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '@/components/AppBar';
import Footer from '@/components/Footer';
import getLPTheme from '@/getLPTheme';
import ProductCard from '@/components/ProductCard';

//sample data
export const productData = [
    {
        image: "iphone11.jpg",
        title: "iPhone 11",
        size: "64GB",
        description: "A powerful and versatile smartphone with a stunning dual-camera system.",
        price: "$599.99",
        id: "1",
    },
    {
        image: "iphone11.jpg",
        title: "Samsung Galaxy S21",
        size: "128GB",
        description: "A cutting-edge phone with a vibrant display and powerful processor.",
        price: "$799.99",
        id: "2",
    },
    {
        image: "iphone11.jpg",
        title: "Google Pixel 6",
        size: "256GB",
        description: "A smart and innovative phone with a focus on AI features.",
        price: "$899.99",
        id: "3",
    },
    {
        image: "iphone11.jpg",
        title: "OnePlus 9 Pro",
        size: "128GB",
        description: "A flagship phone with a fast charging battery and Hasselblad camera.",
        price: "$699.99",
        id: "4",
    },
    {
        image: "iphone11.jpg",
        title: "Xiaomi 12",
        size: "256GB",
        description: "A compact and powerful phone with a 120Hz AMOLED display.",
        price: "$549.99",
        id: "5",
    }
];



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

export default function Marketplace() {
    const [mode, setMode] = React.useState<PaletteMode>('dark');
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    const toggleColorMode = () => {
        setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    return (
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <CssBaseline />
            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
            <Box sx={{ bgcolor: 'background.default', p: 4, pt: 12 }}>
                <Container maxWidth="lg">
                    <Grid container justifyContent="center">
                        {productData.map((product) => (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.title}>
                                <ProductCard product={product} />
                            </Grid>
                        ))}
                    </Grid>
                </Container>
                <Divider />
                <Footer />
            </Box>
            <ToggleCustomTheme
                showCustomTheme={showCustomTheme}
                toggleCustomTheme={toggleCustomTheme}
            />
        </ThemeProvider>
    );
}