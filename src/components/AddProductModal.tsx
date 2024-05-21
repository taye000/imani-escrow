import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';

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
    onSubmit: (productData: any) => void;
}

export default function AddProductModal({ open, handleClose, onSubmit }: AddProductModalProps) {
    const [productName, setProductName] = React.useState("");
    const [paymentMethod, setPaymentMethod] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [price, setPrice] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append("productName", productName);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("paymentMethod", paymentMethod);

        try {
            const response = await fetch("products", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            handleClose();
            onSubmit({
                productName,
                description,
                paymentMethod,
                price,
            });
        } catch (error) {
            console.error("There was a problem submitting the form:", error);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <Modal open={open} onClose={handleClose}>
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Add Product
                    </Typography>
                    <form>
                        <TextField
                            fullWidth
                            label="Product Name"
                            value={productName}
                            name="productName"
                            onChange={(e) => setProductName(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Price"
                            value={price}
                            name="price"
                            onChange={(e) => setPrice(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Payment Method"
                            value={paymentMethod}
                            name="paymentMethod"
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            margin="normal"
                        />
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

                        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading}>
                            Add Product
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
