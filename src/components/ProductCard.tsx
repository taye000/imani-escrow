import React, { useState } from "react";
import styled from "styled-components";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Divider,
  Grid,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from '@mui/icons-material/Favorite';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useRouter } from "next/router";
import { productData } from "@/pages/marketplace";

interface ProductCardProps {
  product: {
    id: string;
    image: string;
    additionalImages: string[];
    category: string;
    title: string;
    size: string;
    description: string;
    price: string;
  };
}

const ProductCardContainer = styled(Card)`
  width: 250px;
  background-color: primary;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  margin: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductImage = styled(CardMedia)`
  height: 140px;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

const ProductContent = styled(CardContent)`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProductTitle = styled(Typography)`
  font-weight: bold;
  color: primary;
`;

const ProductDetails = styled(Typography)`
  color: primary;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const ProductCategory = styled(Typography)`
  color: primary;
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const PriceSizeContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto; // 1 flexible column, 1 auto-sized column
  gap: 4px;
  align-items: baseline;
`;

const PriceTag = styled(Typography)`
  font-weight: bold;
  color: primary;
  margin-top: 8px;
`;

const AddToCartButton = styled(Button)`
  width: 100%;
  margin-top: 16px;
  text-transform: none;
  padding: 8px 16px;
  font-size: 14px;
`;

const ButtonRow = styled(Grid)`
  display: flex;
  justify-content: center;
  margin: auto;
  margin-top: 16px;
  width: 100%;
  box-sizing: border-box;
  align-items: center;
`;


function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const router = useRouter();

  const handleViewItem = () => {
    router.push(`/products/${product.id}`); // Navigate to item detail page
  };

  const handleAddtoCart = async () => {
    try {
      const response = await fetch('/api/add-to-cart', {
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
        console.log('Product added to cart:', data);
        // You can update your UI here (e.g., show a toast notification)
      } else {
        console.error('Error adding to cart:', response.status);
        // Handle the error (e.g., show an error message to the user)
      }
    } catch (error) {
      console.error('Unexpected error adding to cart:', error);
      // Handle unexpected errors
    }
  };

  const handleFavoriteClick = () => {
    setIsFavorite(!isFavorite);
  };

  const FavoriteIconStyled = styled(isFavorite ? FavoriteIcon : FavoriteBorderIcon)`
    color: white;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
  `;

  return (
    <ProductCardContainer>
      <FavoriteIconStyled onClick={handleFavoriteClick} />
      <ProductImage image={product.image} />
      <Divider />
      <ProductContent>
        <ProductTitle variant="h6">{product.title}</ProductTitle>
        <ProductCategory variant="h6">{product.category}</ProductCategory>
        <ProductDetails variant="body2">{product.description}</ProductDetails>
        <PriceSizeContainer>
          <PriceTag variant="body1">${product.price}</PriceTag>
          <Typography variant="body2" color="white">
            {product.size}
          </Typography>
        </PriceSizeContainer>
        <ButtonRow container spacing={1}>
          <Grid item xs={8}> {/* 'View Item' takes 8/12 (66%) of the width */}
            <AddToCartButton onClick={handleViewItem} variant="contained">
              View Item
            </AddToCartButton>
          </Grid>
          <Grid item xs={4}> {/* 'Add to Cart' takes 4/12 (33%) of the width */}
            <AddToCartButton
              onClick={handleAddtoCart}
              variant="contained"
              startIcon={<AddShoppingCartIcon />}
            >
              +1
            </AddToCartButton>
          </Grid>
        </ButtonRow>
      </ProductContent>
    </ProductCardContainer>
  );
}

export default ProductCard;
