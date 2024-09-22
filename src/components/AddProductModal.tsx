import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import { TextField, Grid } from '@mui/material';
import toast from 'react-hot-toast';
import { useProductContext } from '@/context/ProductContext';

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

interface AddProductModalProps {
    open: boolean;
    handleClose: () => void;
}

export default function AddProductModal({ open, handleClose }: AddProductModalProps) {
    const [productName, setProductName] = React.useState("");
    const [paymentMethod, setPaymentMethod] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [category, setCategory] = React.useState("");
    const [transactionType, setTransactionType] = React.useState("selling");
    const [price, setPrice] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [currency, setCurrency] = React.useState("USD");

    const { addProduct } = useProductContext();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const productData = {
            productName,
            description,
            price,
            paymentMethod,
            category,
            transactionType,
            currency,
        };

        try {
            await addProduct(productData);
            handleClose();
            console.error("There was a problem submitting the form:", Error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Add Product
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                value={productName}
                                name="productName"
                                onChange={(e) => setProductName(e.target.value)}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Category"
                                value={category}
                                name="category"
                                onChange={(e) => setCategory(e.target.value)}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Price"
                                value={price}
                                name="price"
                                onChange={(e) => setPrice(e.target.value)}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Payment Method"
                                value={paymentMethod}
                                name="paymentMethod"
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                margin="normal"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={description}
                                name="description"
                                onChange={(e) => setDescription(e.target.value)}
                                margin="normal"
                                multiline
                                rows={4}
                            />
                        </Grid>
                        <Grid item xs={12} sx={{ textAlign: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={isLoading}
                                endIcon={isLoading && <CircularProgress size={20} />}
                            >
                                Add Product
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Box>
        </Modal>
    );
}
