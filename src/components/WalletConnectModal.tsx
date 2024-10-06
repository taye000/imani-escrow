import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import React from "react";
import { useCustomFuelHook } from '@/context/WalletContext';
import Loading from '@/loading';

interface WalletConnectModalProps {
    open: boolean; // Control modal open state
    onClose: () => void;
}

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({ open, onClose }) => {
    const { isConnecting, isWalletConnected, connectWallet } = useCustomFuelHook();

    const handleWalletConnection = async () => {
        try {
            if (!isWalletConnected) {
                const connected = await connectWallet();
                if (connected) {
                    // close modal if wallet connected successfully
                    onClose();
                }
            }
        } catch (error) {
            console.error("Error handling wallet connection:", error);
            // Optionally handle error here (e.g., show a toast)
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(15, 18, 20, 0.8)", // Semi-transparent background
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "300px",
                        height: "150px",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#1c1f22",
                        borderRadius: "10px",
                        padding: "20px",
                    }}
                >
                    <Typography variant="h6" color="white" sx={{ marginBottom: 2 }}>
                        Connect Your Wallet
                    </Typography>
                    <Button
                        sx={{ padding: "0 20px" }}
                        onClick={handleWalletConnection}
                        disabled={isConnecting}
                    >
                        {isConnecting ? <Loading /> : "Connect Wallet"}
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default WalletConnectModal;
