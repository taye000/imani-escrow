import * as React from 'react';
import { IconButton, PaletteMode } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ToggleColorMode from './ToggleColorMode';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Link from 'next/link';
import router from 'next/router';
import { useUser } from '@auth0/nextjs-auth0/client';

const activeStyle = {
    fontWeight: 'bold',
    borderBottom: '2px solid',
};

interface AppAppBarProps {
    mode: PaletteMode;
    toggleColorMode: () => void;
}

function AppAppBar({ mode, toggleColorMode }: AppAppBarProps) {
    const { user, isLoading, error } = useUser();

    const [open, setOpen] = React.useState(false);

    const toggleDrawer = (newOpen: boolean) => () => {
        setOpen(newOpen);
    };

    const scrollToSection = (sectionId: string) => {
        const sectionElement = document.getElementById(sectionId);
        const offset = 128;
        if (sectionElement) {
            const targetScroll = sectionElement.offsetTop - offset;
            sectionElement.scrollIntoView({ behavior: 'smooth' });
            window.scrollTo({
                top: targetScroll,
                behavior: 'smooth',
            });
            setOpen(false);
        }
    };

    const isActive = (path: string) => router.pathname === path;

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                    boxShadow: 0,
                    bgcolor: 'transparent',
                    backgroundImage: 'none',
                    mt: 2,
                }}
            >
                <Container maxWidth="lg">
                    <Toolbar
                        variant="regular"
                        sx={(theme) => ({
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexShrink: 0,
                            borderRadius: '999px',
                            bgcolor:
                                theme.palette.mode === 'light'
                                    ? 'rgba(255, 255, 255, 0.4)'
                                    : 'rgba(0, 0, 0, 0.4)',
                            backdropFilter: 'blur(24px)',
                            maxHeight: 40,
                            border: '1px solid',
                            borderColor: 'divider',
                            boxShadow:
                                theme.palette.mode === 'light'
                                    ? `0 0 1px rgba(85, 166, 246, 0.1), 1px 1.5px 2px -1px rgba(85, 166, 246, 0.15), 4px 4px 12px -2.5px rgba(85, 166, 246, 0.15)`
                                    : '0 0 1px rgba(2, 31, 59, 0.7), 1px 1.5px 2px -1px rgba(2, 31, 59, 0.65), 4px 4px 12px -2.5px rgba(2, 31, 59, 0.65)',
                        })}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                display: 'flex',
                                alignItems: 'center',
                                ml: '-18px',
                                px: 0,
                            }}
                        >
                            <Link href="/">
                                <Typography variant="body2" color="text.primary">
                                    Imani Escrow
                                </Typography>
                            </Link>
                            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <MenuItem
                                    sx={{ ...(isActive('/marketplace') && activeStyle) }}
                                >
                                    <Link href="/marketplace">
                                        <Typography variant="body2" color="text.primary">
                                            MarketPlace
                                        </Typography>
                                    </Link>
                                </MenuItem>
                                {user && (
                                    <MenuItem sx={{ py: '6px', px: '12px' }}>
                                        <Link href="/dashboard">
                                            <Typography variant="body2" color="text.primary">
                                                Dashboard
                                            </Typography>
                                        </Link>
                                    </MenuItem>
                                )}
                                <MenuItem
                                    onClick={() => scrollToSection('highlights')}
                                    sx={{ py: '6px', px: '12px' }}
                                >
                                    <Typography variant="body2" color="text.primary">
                                        Features
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => scrollToSection('testimonials')}
                                    sx={{ py: '6px', px: '12px' }}
                                >
                                    <Typography variant="body2" color="text.primary">
                                        Testimonials
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    onClick={() => scrollToSection('faq')}
                                    sx={{ py: '6px', px: '12px' }}
                                >
                                    <Typography variant="body2" color="text.primary">
                                        FAQ
                                    </Typography>
                                </MenuItem>
                            </Box>
                        </Box>
                        <Box
                            sx={{
                                display: { xs: 'none', md: 'flex' },
                                gap: 0.5,
                                alignItems: 'center',
                            }}
                        >
                            <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                            <Link href="/checkout">
                                <IconButton color="primary" aria-label="shopping cart">
                                    <ShoppingCartIcon />
                                </IconButton>
                            </Link>
                            {!user ? (
                                <Button
                                    color="primary"
                                    variant="text"
                                    size="small"
                                    component="a"
                                    href="/api/auth/login"
                                >
                                    Sign in
                                </Button>
                            ) : (
                                <>
                                    <Link href="/profile">
                                        <Typography variant="body2" color="text.primary">
                                            {user.name}
                                        </Typography>
                                    </Link>
                                    <Box sx={{ marginLeft: '10px' }}>
                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="small"
                                            component="a"
                                            href="/api/auth/logout"
                                        >
                                            Sign Out
                                        </Button>
                                    </Box>
                                </>
                            )}
                        </Box>
                        <Box sx={{ display: { sm: '', md: 'none' } }}>
                            <Button
                                variant="text"
                                color="primary"
                                aria-label="menu"
                                onClick={toggleDrawer(true)}
                                sx={{ minWidth: '30px', p: '4px' }}
                            >
                                <MenuIcon />
                            </Button>
                            <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
                                <Box
                                    sx={{
                                        minWidth: '60dvw',
                                        p: 2,
                                        backgroundColor: 'background.paper',
                                        flexGrow: 1,
                                    }}
                                >
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'end',
                                            flexGrow: 1,
                                        }}
                                    >
                                        <ToggleColorMode mode={mode} toggleColorMode={toggleColorMode} />
                                    </Box>
                                    <MenuItem onClick={() => scrollToSection('features')}>
                                        Features
                                    </MenuItem>
                                    <MenuItem onClick={() => scrollToSection('testimonials')}>
                                        Testimonials
                                    </MenuItem>
                                    <MenuItem onClick={() => scrollToSection('highlights')}>
                                        Highlights
                                    </MenuItem>
                                    <MenuItem onClick={() => scrollToSection('pricing')}>
                                        Pricing
                                    </MenuItem>
                                    <MenuItem onClick={() => scrollToSection('faq')}>FAQ</MenuItem>
                                    <Divider />
                                    <MenuItem>
                                        {!user ? (
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                component="a"
                                                href="/api/auth/login"
                                                target="_blank"
                                                sx={{ width: '100%' }}
                                            >
                                                Sign in
                                            </Button>
                                        ) : (
                                            <Button
                                                color="primary"
                                                variant="outlined"
                                                component="a"
                                                href="/api/auth/logout"
                                                target="_blank"
                                                sx={{ width: '100%' }}
                                            >
                                                Sign Out
                                            </Button>
                                        )}
                                    </MenuItem>
                                </Box>
                            </Drawer>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </div>
    );
}

export default AppAppBar;
