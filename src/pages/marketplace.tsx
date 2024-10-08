import React from 'react';
import useSWR from 'swr';
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
import ProductCardSkeleton from '@/components/productcardskeleton';

export interface Product {
    image: string;
    additionalImages: string[];
    category: string;
    productName: string;
    size: string;
    description: string;
    price: string;
    id: string;
    date: string;
    paymentMethod: string;
    address: string;
    currency?: string;
    transactionType?: string;
    createdAt: string;
    updatedAt: string;
}

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Marketplace() {
    const { mode, toggleColorMode } = useThemeContext();
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    const { data: products, error } = useSWR<Product[]>('/api/product', fetcher);

    return (
        <ThemeProvider theme={LPtheme}>
            <CssBaseline />
            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: 'background.default', p: 4, pt: 12 }}>
                    <MainLayout>
                        <Container>
                            <Grid container justifyContent="center">
                                {error ? (
                                    <div
                                        style={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        Error loading products
                                    </div>
                                ) : !products ? (
                                    <Grid container justifyContent="center">
                                        {Array.from(new Array(8)).map((_, index) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                                                <ProductCardSkeleton />
                                            </Grid>
                                        ))}
                                    </Grid>
                                ) : (
                                    <Grid container justifyContent="center" spacing={2}>
                                        {products.map((product) => (
                                            <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                                                <ProductCard product={product} />
                                            </Grid>
                                        ))}
                                    </Grid>
                                )}
                            </Grid>
                        </Container>
                    </MainLayout>
                    <Divider />
                    <Footer />
                </Box>
            </Container>
        </ThemeProvider>
    );
}
