import * as React from 'react';
import { Grid, Container } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '@/components/AppBar';
import Footer from '@/components/Footer';
import getLPTheme from '@/getLPTheme';
import ProductCard from '@/components/ProductCard';
import styled from 'styled-components';
import { useThemeContext } from '@/context/ThemeContext';

//sample data
export const productData = [
    {
        image: "iphone11.jpg",
        additionalImages: ["imanilogo.png", "avatar.jpg", "Milky_Way_at_Bear_Lake_4_nxqjo2.jpg"],
        category: "Electronics",
        productName: "iPhone 11",
        size: "64GB",
        description: "A powerful and versatile smartphone with a stunning dual-camera system.",
        price: "$599.99",
        id: "10d5ec49f4d3f915b4e47f0b",
    },
    {
        image: "iphone11.jpg",
        additionalImages: ["imanilogo.png", "avatar.jpg", "Milky_Way_at_Bear_Lake_4_nxqjo2.jpg"],
        category: "Electronics",
        productName: "Samsung Galaxy S21",
        size: "128GB",
        description: "A cutting-edge phone with a vibrant display and powerful processor.",
        price: "$799.99",
        id: "20d5ec49f4d3f915b4e47f0b",
    },
    {
        image: "iphone11.jpg",
        additionalImages: ["imanilogo.png", "avatar.jpg", "Milky_Way_at_Bear_Lake_4_nxqjo2.jpg"],
        category: "Electronics",
        productName: "Google Pixel 6",
        size: "256GB",
        description: "A smart and innovative phone with a focus on AI features.",
        price: "$899.99",
        id: "30d5ec49f4d3f915b4e47f0b",
    },
    {
        image: "iphone11.jpg",
        additionalImages: ["imanilogo.png", "avatar.jpg", "Milky_Way_at_Bear_Lake_4_nxqjo2.jpg"],
        category: "Electronics",
        productName: "OnePlus 9 Pro",
        size: "128GB",
        description: "A flagship phone with a fast charging battery and Hasselblad camera.",
        price: "$699.99",
        id: "40d5ec49f4d3f915b4e47f0b",
    },
    {
        image: "iphone11.jpg",
        additionalImages: ["imanilogo.png", "avatar.jpg", "Milky_Way_at_Bear_Lake_4_nxqjo2.jpg"],
        category: "Electronics",
        productName: "Xiaomi 12",
        size: "256GB",
        description: "A compact and powerful phone with a 120Hz AMOLED display.",
        price: "$549.99",
        id: "50d5ec49f4d3f915b4e47f0b",
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
                        <Container >
                            <Grid container justifyContent="center">
                                {productData.map((product) => (
                                    <Grid item xs={12} sm={6} md={4} lg={3} key={product.productName}>
                                        <ProductCard product={product} />
                                    </Grid>
                                ))}
                            </Grid>
                        </Container>
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