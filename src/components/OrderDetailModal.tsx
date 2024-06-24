import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

interface OrderDetailProps {
    open: boolean;
    handleClose: () => void;
    order: {
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
        currency: string;
        transactionType: string;
    };
}

export default function OrderDetailModal({ open, handleClose, order }: OrderDetailProps) {
    return (
        <div>
            <Modal open={open} onClose={handleClose} >
                <Box sx={style} onClick={(e) => e.stopPropagation()}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Order Details
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Order ID: {order.id}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Order Date: {order.date}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Name: {order.productName}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Order Total: $ {order.price}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Shipping Address: {order.address}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Payment Method: {order.paymentMethod}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
