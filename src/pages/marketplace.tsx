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
    createdAt?: string;
    updatedAt?: string;
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

export default function Marketplace() {
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const { mode, toggleColorMode } = useThemeContext();
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [products, setProducts] = React.useState<Product[]>([]);
    const [loading, setLoading] = React.useState(true);

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    React.useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/product');
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                const data: Product[] = await response.json();
                setProducts(data);
                console.log(data);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <CssBaseline />
            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: 'background.default', p: 4, pt: 12 }}>
                    <MainLayout>
                        <Container >
                            <Grid container justifyContent="center">
                                {products.map((product) => (
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