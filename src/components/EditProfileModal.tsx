import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CircularProgress from '@mui/material/CircularProgress';
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

export interface userData {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    photo: string;
}

interface EditProfileModalProps {
    open: boolean;
    handleClose: () => void;
    onSubmit: (profileData: userData) => void;
}

export default function EditProfileModal({ open, handleClose, onSubmit }: EditProfileModalProps) {
    const [name, setName] = React.useState("");
    const [phone, setPhone] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [address, setAddress] = React.useState("");
    const [photo, setPhoto] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setIsLoading(true);

        const profileData: any = {
            name,
            phone,
            email,
            address,
            photo,
        };

        try {
            const response = await fetch("api/edit-profile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            handleClose();
            onSubmit({
                id: profileData.id,
                name,
                phone,
                email,
                address,
                photo,
            });
        } catch (error) {
            console.error("There was a problem updating the profile:", error);
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
                            value={name}
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="phone"
                            value={phone}
                            name="phone"
                            onChange={(e) => setPhone(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            label="photo"
                            value={photo}
                            name="photo"
                            onChange={(e) => setPhoto(e.target.value)}
                            margin="normal"
                            multiline
                            rows={4}
                        />

                        <Button type="submit" variant="contained" color="primary" onClick={handleSubmit} disabled={isLoading} endIcon={isLoading && <CircularProgress size={20} />}>
                            Add Product
                        </Button>
                    </form>
                </Box>
            </Modal>
        </div>
    );
}
