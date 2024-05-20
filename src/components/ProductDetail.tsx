import * as React from "react";
import styled from "styled-components";
import {
    Typography,
    Button,
    Box,
    PaletteMode,
    CssBaseline,
    Divider,
    Grid,
    Container,
} from "@mui/material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import AppAppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import getLPTheme from "@/getLPTheme";

const DetailContainer = styled.div`
  display: flex;
  background-color: #212121;
  padding: 24px;
  border-radius: 8px;
`;

const ProductDetailsContainer = styled.div`
  flex: 1; // Take up remaining space
  padding-left: 24px; // Add spacing from the image
  display: flex;
  flex-direction: column;
  justify-content: space-between; // Distribute space evenly
`;

const ImageContainer = styled.div`
  display: flex; /* Use flexbox for layout */
  flex-direction: column; /* Stack children vertically */
  align-items: center; /* Center thumbnails horizontally */
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
  color: white;
  margin-top: 16px;
`;

const Description = styled(Typography)`
  color: #d8d8d8;
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
  width: 100%;
  margin-top: 16px;
  text-transform: none;
`;

interface ProductDetailProps {
    product: {
        image: string;
        additionalImages: string[];
        category: string;
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
    const [mode, setMode] = React.useState<PaletteMode>("dark");
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });
    const [selectedImage, setSelectedImage] = React.useState(product.image);

    const handleThumbnailClick = (image: string) => {
        setSelectedImage(image);
    };

    const toggleColorMode = () => {
        setMode((prev) => (prev === "dark" ? "light" : "dark"));
    };

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
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
                                    <MainImage src={`/${selectedImage}`} alt={product.title} />
                                    <ThumbnailsContainer>
                                        {[product.image, ...product.additionalImages].map(
                                            (img, index) => (
                                                <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
                                                    <Thumbnail
                                                        key={index}
                                                        src={`/${img}`}
                                                        alt={`thumbnail-${index}`}
                                                        onClick={() => handleThumbnailClick(img)}
                                                        selected={img === selectedImage}
                                                    />
                                                </ThemeProvider>
                                            )
                                        )}
                                    </ThumbnailsContainer>
                                </ImageContainer>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ProductDetailsContainer>
                                    <Title variant="h4">{product.title}</Title>
                                    <Title variant="h6">{product.category}</Title>
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
