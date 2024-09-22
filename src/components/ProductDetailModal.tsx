import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Stack, Divider, Button } from '@mui/material';
import { useProductContext } from '@/context/ProductContext';
import { formatDate } from '@/utils/formatDate';

interface ProductDetailProps {
    open: boolean;
    handleClose: () => void;
    product: {
        image: string;
        additionalImages: string[];
        category: string;
        productName: string;
        size: string;
        description: string;
        price: string;
        id: string;
        createdAt: string;
        paymentMethod: string;
        updatedAt: string;
    };
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
    outline: 'none',
};

export default function ProductDetailModal({ open, handleClose, product }: ProductDetailProps) {
    const { deleteProduct } = useProductContext();

    const handleDeleteProduct = (productId: string) => {
        deleteProduct(productId);
        handleClose(); // Close modal after delete
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="product-modal-title">
            <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" id="product-modal-title">
                        {product.productName}
                    </Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Date: {formatDate(product.createdAt)}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Price: $ {product.price}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Category: {product.category}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Payment Method: {product.paymentMethod}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Description: {product.description}
                </Typography>

                <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                    <Button onClick={handleClose} variant="outlined" color="primary">
                        Close
                    </Button>
                    <Button onClick={() => handleDeleteProduct(product.id)} variant="contained" color="error">
                        Delete
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
