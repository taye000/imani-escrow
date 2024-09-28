import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Stack, Divider, Button } from '@mui/material';
import { formatDate } from '@/utils/formatDate';

interface OrderDetailProps {
    open: boolean;
    handleClose: () => void;
    order: {
        id: string;
        createdAt: string;
        status: string;
        totalAmount: number;
        paymentDetails: {
            method: string;
        };
        items: Array<{
            productName: string;
            quantity: number;
            price: number;
        }>;
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

export default function OrderDetailModal({ open, handleClose, order }: OrderDetailProps) {
    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="order-modal-title">
            <Box sx={modalStyle} onClick={(e) => e.stopPropagation()}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" id="order-modal-title">
                        Order #{order.id}
                    </Typography>
                </Stack>

                <Divider sx={{ mb: 2 }} />

                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Date: {formatDate(order.createdAt)}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Status: {order.status}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Payment Method: {order.paymentDetails.method}
                </Typography>
                <Typography variant="body1" color="textSecondary" gutterBottom>
                    Total Amount: ${order.totalAmount.toFixed(2)}
                </Typography>

                <Divider sx={{ mb: 2, mt: 2 }} />

                <Typography variant="h6" gutterBottom>
                    Items:
                </Typography>

                {order.items.map((item, index) => (
                    <Box key={index} sx={{ mb: 2 }}>
                        <Typography variant="body1">
                            {item.productName} (x{item.quantity})
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Price: ${item.price.toFixed(2)}
                        </Typography>
                    </Box>
                ))}

                <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                    <Button onClick={handleClose} variant="outlined" color="primary">
                        Close
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
