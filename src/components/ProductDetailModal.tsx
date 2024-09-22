import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { formatDate } from '@/utils/formatDate';

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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
        address: string;
    };
}

export default function ProductDetailModal({ open, handleClose, product }: ProductDetailProps) {
    return (
        <div>
            <Modal open={open} onClose={handleClose} >
                <Box sx={style} onClick={(e) => e.stopPropagation()}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Product Details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        ID: {product.id}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Date Added: {formatDate(product.createdAt)}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Name: {product.productName}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Price: $ {product.price}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Category: {product.category}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Payment Method: {product.paymentMethod}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Description: {product.description}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
