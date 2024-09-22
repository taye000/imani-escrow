import * as React from "react";
import styled from "styled-components";
import {
    Typography,
    Button,
    Box,
    CssBaseline,
    Divider,
    Grid,
    Container,
} from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import AppAppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import getLPTheme from "@/getLPTheme";
import { useThemeContext } from '@/context/ThemeContext';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import toast from 'react-hot-toast';

const DetailContainer = styled.div`
  display: flex;
  background-color: primary;
  padding: 24px;
  border-radius: 8px;
`;

const ProductDetailsContainer = styled.div`
  flex: 1;
  padding-left: 24px;
  display: flex;
  flex-direction: column;
`;

const ImageContainer = styled.div`
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center thumbnails horizontally */
`;

const DetailsContent = styled.div`
  flex: 1; 
`;

const MainImage = styled.img`
  width: 100%; /* Take full width */
  border-radius: 8px; 
  height: 300px;
  object-fit: cover;
  margin-bottom: 16px; /* Add spacing between main image and thumbnails */
`;

const ThumbnailsContainer = styled.div`
  display: flex;
  justify-content: center; /* Center thumbnails horizontally */
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
  margin-top: 16px;
`;

const Thumbnail = styled.img<{ selected: boolean }>`
  width: 60px;
  height: 60px;
  object-fit: cover;
  margin-bottom: 8px;
  border-radius: 8px; 
  cursor: pointer; // Make thumbnails clickable (later)

  &:last-child {
    margin-bottom: 0;
  }

  ${({ selected }) => {
        const theme = useTheme();
        return selected && `border: 2px solid ${theme.palette.primary.main};`
    }}
`;

const Title = styled(Typography)`
  font-weight: bold;
  color: primary;
  margin-top: 16px;
`;

const Description = styled(Typography)`
  color: primary;
  font-size: 14px;
  margin-top: 8px;
`;

const PriceSizeContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 8px;
`;

const PriceTag = styled(Typography)`
  font-weight: bold;
  color: primary;
`;

const AddToCartButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  text-transform: none;
  padding: 8px 16px;
  font-size: 14px;
`;

const BackButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  text-transform: none;
  padding-top: 8px;
  padding-bottom: 8px;
  margin-top: 16px;
`;

interface ProductDetailProps {
    product: {
        image?: string;
        additionalImages?: string[];
        category: string;
        productName: string;
        size?: string;
        description: string;
        price: string;
        id?: string;
        createdAt: string;
        paymentMethod: string;
        updatedAt: string;
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
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: "100dvw",
                position: "fixed",
                bottom: 24,
            }}
        ></Box>
    );
}

function ProductDetail({ product, onBack }: ProductDetailProps) {
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const { mode, toggleColorMode } = useThemeContext();
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedImage, setSelectedImage] = React.useState(product.image);

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    const handleThumbnailClick = (image: string) => {
        setSelectedImage(image);
    };

    const handleAddtoCart = async () => {
        try {
            const response = await fetch('/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    productId: product.id,
                    quantity: 1,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(`${product.productName} added to cart`);
            } else {
                console.error('Error adding to cart:', response.status);
                toast.error(`Failed to add ${product.productName} to cart`);
            }
        } catch (error) {
            console.error('Unexpected error adding to cart:', error);
            toast.error(`Unexpected error while adding ${product.productName} to cart`); // Show unexpected error toast
        }
    };

    return (
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <CssBaseline />
            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: "background.default", p: 4, pt: 12 }}>
                    <DetailContainer>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                {" "}
                                <ImageContainer>
                                    <MainImage
                                        src={`/${selectedImage || (product.image ? product.image : 'iphone11.jpg')}`}
                                        alt={product.productName}
                                    />
                                    <ThumbnailsContainer>
                                        {[(product.image || 'iphone11.jpg'), ...product.additionalImages!].map((img, index) => (
                                            <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme} key={index}>
                                                <Thumbnail
                                                    src={`/${img || 'iphone11.jpg'}`}
                                                    alt={`thumbnail-${index}`}
                                                    onClick={() => handleThumbnailClick(img || 'iphone11.jpg')}
                                                    selected={img === selectedImage}
                                                />
                                            </ThemeProvider>
                                        ))}
                                    </ThumbnailsContainer>
                                </ImageContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ProductDetailsContainer>
                                    <DetailsContent>
                                        <Title variant="h4">{product.productName}</Title>
                                        <Title variant="h6">Category: {product.category}</Title>
                                        <PriceSizeContainer>
                                            <PriceTag variant="h6">Price: ${product.price}</PriceTag>
                                            <Typography variant="subtitle1" color="white">
                                                Size: {product.size}
                                            </Typography>
                                        </PriceSizeContainer>
                                        <Description variant="body1">Description: {product.description}</Description>
                                        <Divider />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <AddToCartButton
                                                    onClick={handleAddtoCart}
                                                    variant="contained"
                                                    startIcon={<AddShoppingCartIcon />}
                                                >
                                                    +1
                                                </AddToCartButton>
                                            </Grid>
                                            <Divider />
                                            <Grid item xs={12}>
                                                <BackButton variant="outlined" color="inherit" onClick={onBack}>
                                                    Back to Marketplace
                                                </BackButton>
                                            </Grid>
                                        </Grid>
                                    </DetailsContent>
                                </ProductDetailsContainer>
                            </Grid>
                        </Grid>
                    </DetailContainer>
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

export default ProductDetail;
