import React from 'react';
import styled from 'styled-components';
import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Grid,
    Skeleton
} from '@mui/material';

const SkeletonCardContainer = styled(Card)`
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

const SkeletonImage = styled(CardMedia)`
  height: 140px;
`;

const SkeletonContent = styled(CardContent)`
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const SkeletonButton = styled(Skeleton)`
  width: 100%;
  margin-top: 16px;
  height: 36px;
`;

function ProductCardSkeleton() {
    return (
        <SkeletonCardContainer>
            <SkeletonImage>
                <Skeleton variant="rectangular" width="100%" height="140px" />
            </SkeletonImage>
            <SkeletonContent>
                <Typography variant="h6">
                    <Skeleton width="80%" />
                </Typography>
                <Typography variant="h6">
                    <Skeleton width="60%" />
                </Typography>
                <Typography variant="body2">
                    <Skeleton width="100%" />
                </Typography>
                <Skeleton width="50%" />
                <Skeleton width="30%" />
                <Grid container spacing={1} justifyContent="center" marginTop="16px">
                    <Grid item xs={8}>
                        <SkeletonButton />
                    </Grid>
                    <Grid item xs={4}>
                        <SkeletonButton />
                    </Grid>
                </Grid>
            </SkeletonContent>
        </SkeletonCardContainer>
    );
}

export default ProductCardSkeleton;
