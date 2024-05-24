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
        id: number;
        date: string;
        name: string;
        shipTo: string;
        paymentMethod: string;
        amount: number;
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
                        Client: {order.name}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Order Total: $ {order.amount}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Shipping Address: {order.shipTo}
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Payment Method: {order.paymentMethod}
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
