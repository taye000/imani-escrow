import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Stack, Divider, Button } from '@mui/material';
import { formatDate } from '@/utils/formatDate';
import { IFetchOrder } from '@/context/OrderContext'; // Import the correct interface
import { useRouter } from 'next/router';

interface OrderDetailProps {
    open: boolean;
    handleClose: () => void;
    order: IFetchOrder; // Use the IFetchOrder interface here
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
    const router = useRouter();
    const handleGoToDetailPage = () => {
        router.push(`/orders/${order.id}`);
    };

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
                            {item.productDetails?.productName || 'Unknown Product'} (x{item.quantity})
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Price: ${parseFloat(item.productDetails?.price ?? '0').toFixed(2)}
                        </Typography>
                    </Box>
                ))}

                <Stack direction="row" justifyContent="flex-end" spacing={2} mt={3}>
                    <Button onClick={handleClose} variant="outlined" color="primary">
                        Close
                    </Button>
                    <Button onClick={handleGoToDetailPage} variant="contained" color="primary">
                        View Details
                    </Button>
                </Stack>
            </Box>
        </Modal>
    );
}
