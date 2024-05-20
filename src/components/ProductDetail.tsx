import * as React from 'react';
import styled from 'styled-components';
import { Typography, Button, Box, PaletteMode, CssBaseline, Divider } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '@/components/AppBar';
import Footer from '@/components/Footer';
import getLPTheme from '@/getLPTheme';

const DetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #212121;
  padding: 24px;
  border-radius: 8px;
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 300px; /* Adjust the height as needed */
  overflow: hidden;
`;

const DetailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Title = styled(Typography)`
  font-weight: bold;
  color: white;
  margin-top: 16px;
`;

const Description = styled(Typography)`
  color: #D8D8D8;
  font-size: 14px;
  margin-top: 8px;
`;

const PriceSizeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
`;

const PriceTag = styled(Typography)`
  font-weight: bold;
  color: white;
`;

const BackButton = styled(Button)`
  margin-top: 24px;
`;

interface ProductDetailProps {
    product: {
        image: string;
        title: string;
        size: string;
        description: string;
        price: string;
    };
    onBack: () => void; // Function to handle "Back" button click
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

function ProductDetail({ product, onBack }: ProductDetailProps) {
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
                <DetailContainer>
                    <ImageContainer>
                        <DetailImage src={`/${product.image}`} alt={product.image} />
                    </ImageContainer>
                    <Title variant="h4">{product.title}</Title>
                    <Description variant="body1">{product.description}</Description>
                    <PriceSizeContainer>
                        <PriceTag variant="h6">${product.price}</PriceTag>
                        <Typography variant="subtitle1" color="white">
                            Size: {product.size}
                        </Typography>
                    </PriceSizeContainer>
                    <BackButton variant="outlined" color="inherit" onClick={onBack}>
                        Back
                    </BackButton>
                </DetailContainer>
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

export default ProductDetail;
