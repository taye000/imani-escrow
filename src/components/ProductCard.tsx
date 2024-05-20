import React from 'react';
import styled from 'styled-components';
import { Button, Card, CardContent, CardMedia, Typography, Box, Divider } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const ProductCardContainer = styled(Card)`
  width: 250px;
  background-color: black;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin: 16px;
`;

const ProductImage = styled(CardMedia)`
  height: 140px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const ProductContent = styled(CardContent)`
  padding: 16px;
`;

const ProductTitle = styled(Typography)`
  font-weight: bold;
  color: white;
`;

const ProductDetails = styled(Typography)`
  color: #D8D8D8; // Light grey
  font-size: 14px;
`;

const PriceTag = styled(Typography)`
  font-weight: bold;
  color: white;
  margin-top: 8px;
`;

const AddToCartButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  text-transform: none;
`;

const FavoriteIcon = styled(FavoriteBorderIcon)`
  color: white;
  position: absolute;
  top: 10px;
  right: 10px;
`;

function ProductCard() {
    return (
        <ProductCardContainer>
            <FavoriteIcon />
            <ProductImage image="iphone11.jpg" />
            <Divider/>
            <ProductContent>
                <Box display="flex" justifyContent="space-between">
                    <ProductTitle variant="h6">Nike Running Shoe</ProductTitle>
                    <Typography variant="body2" color="white">EU38</Typography>
                </Box>
                <ProductDetails variant="body2">
                    Crossing hardwood comfort with off-court flair. '80s-inspired construction, bold details
                    and nothin'-but-net style.
                </ProductDetails>
                <PriceTag variant="body1">$69.99</PriceTag>
                <AddToCartButton variant="contained">Add to Cart</AddToCartButton>
            </ProductContent>
        </ProductCardContainer>
    );
}

export default ProductCard;
