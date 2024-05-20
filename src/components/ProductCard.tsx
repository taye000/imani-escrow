import React from "react";
import styled from "styled-components";
import {
    Button,
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Divider,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useRouter } from "next/router";

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
  background-color: #212121;
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
  color: white;
`;

const ProductDetails = styled(Typography)`
  color: #d8d8d8; // Light grey
  font-size: 14px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const ProductCategory = styled(Typography)`
  color: #d8d8d8; // Light grey
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

function ProductCard({ product }: ProductCardProps) {
    const router = useRouter();
    const handleViewItem = () => {
        router.push(`/products/${product.id}`); // Navigate to item detail page
    };
    return (
        <ProductCardContainer>
            <FavoriteIcon />
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
                <AddToCartButton onClick={handleViewItem} variant="contained">View Item</AddToCartButton>
            </ProductContent>
        </ProductCardContainer>
    );
}

export default ProductCard;
