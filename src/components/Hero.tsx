import * as React from 'react';
import { alpha } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Link from 'next/link';
import router from 'next/router';
import toast from 'react-hot-toast';

export const currencies = [
    { code: 'USD', label: '🇺🇸 USD' },
    { code: 'EUR', label: '🇪🇺 EUR' },
    { code: 'GBP', label: '🇬🇧 POUND' },
    { code: 'KES', label: '🇰🇪 KES' },
    { code: 'UGX', label: '🇺🇬 UGX' },
    { code: 'RWF', label: '🇷🇼 RWF' },
    { code: 'TZS', label: '🇹🇿 TZS' },
];


export default function Hero() {
    const [transactionType, setTransactionType] = React.useState('selling');
    const [price, setPrice] = React.useState('');
    const [item, setItem] = React.useState('');
    const [currency, setCurrency] = React.useState('USD');

    const handleTransactionTypeChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setTransactionType(event.target.value);
    };

    const handleCurrencyChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setCurrency(event.target.value);
    };

    const handlePriceChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPrice(event.target.value);
    };

    const handleItemChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setItem(event.target.value);
    };

    const handleGetStarted = () => {
        if (!item || !price) {
            toast.error('Please fill in all required fields.');
            return;
        }

        router.push({
            pathname: '/escrow',
            query: {
                transactionType,
                item,
                price,
                currency,
            },
        });
    };

    return (
        <Box
            id="hero"
            sx={(theme) => ({
                width: '100%',
                backgroundImage:
                    theme.palette.mode === 'light'
                        ? 'linear-gradient(180deg, #CEE5FD, #FFF)'
                        : `linear-gradient(#02294F, ${alpha('#090E10', 0.0)})`,
                backgroundSize: '100% 20%',
                backgroundRepeat: 'no-repeat',
            })}
        >
            <Container
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    pt: { xs: 14, sm: 20 },
                    pb: { xs: 8, sm: 12 },
                }}
            >
                <Stack spacing={2} useFlexGap sx={{ width: { xs: '100%', sm: '70%' } }}>
                    <Typography
                        variant="h1"
                        sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', md: 'row' },
                            alignSelf: 'center',
                            textAlign: 'center',
                            fontSize: 'clamp(3.5rem, 10vw, 4rem)',
                        }}
                    >
                        Imani Escrow&nbsp;
                        <Typography
                            component="span"
                            variant="h1"
                            sx={{
                                fontSize: 'clamp(3rem, 10vw, 4rem)',
                                color: (theme) =>
                                    theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
                            }}
                        >
                            Services
                        </Typography>
                    </Typography>
                    <Typography
                        textAlign="center"
                        color="text.secondary"
                        sx={{ alignSelf: 'center', width: { sm: '100%', md: '80%' } }}
                    >
                        Elevating trust and security for small businesses and individuals by
                        harnessing the power of blockchain technology to enhance our
                        exceptional escrow services. Your safe transactions, our priority.
                    </Typography>
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        alignSelf="center"
                        spacing={1}
                        useFlexGap
                        sx={{ pt: 2, width: { xs: '100%', sm: 'auto' } }}
                    >
                        <FormControl size="small" variant="outlined" sx={{ minWidth: 120 }}>
                            <InputLabel id="transaction-type-label">I'm</InputLabel>
                            <Select
                                labelId="transaction-type-label"
                                id="transaction-type"
                                value={transactionType}
                                onChange={handleTransactionTypeChange}
                                label="I'm"
                            >
                                <MenuItem value="buying">Buying</MenuItem>
                                <MenuItem value="selling">Selling</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            id="item"
                            hiddenLabel
                            size="small"
                            onChange={handleItemChange}
                            value={item}
                            variant="outlined"
                            label="Item"
                            placeholder="Laptops, vehicles..."
                            sx={{ flex: 2 }}
                            inputProps={{
                                autoComplete: 'off',
                                'aria-label': 'Enter the item',
                            }}
                        />
                        <TextField
                            id="price"
                            hiddenLabel
                            size="small"
                            onChange={handlePriceChange}
                            value={price}
                            variant="outlined"
                            label="Price"
                            placeholder="800"
                            sx={{ flex: 1, marginLeft: 2 }}
                            inputProps={{
                                autoComplete: 'off',
                                'aria-label': 'Enter the price',
                            }}
                        />
                        <FormControl size="small" variant="outlined" sx={{ minWidth: 80 }}>
                            <InputLabel id="currency-label">Currency</InputLabel>
                            <Select
                                labelId="currency-label"
                                id="currency"
                                value={currency}
                                onChange={handleCurrencyChange}
                                label="Currency"
                            >
                                {currencies.map((currency) => (
                                    <MenuItem key={currency.code} value={currency.code}>
                                        {currency.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" sx={{ ml: 2 }} onClick={handleGetStarted}>
                            Start now
                        </Button>
                    </Stack>
                    <Typography variant="caption" textAlign="center" sx={{ opacity: 0.8 }}>
                        By clicking &quot;Start now&quot; you agree to our&nbsp;
                        <Link href="#" color="primary">
                            Terms & Conditions
                        </Link>
                        .
                    </Typography>
                </Stack>
                <Box
                    id="image"
                    sx={(theme) => ({
                        mt: { xs: 8, sm: 10 },
                        alignSelf: 'center',
                        height: { xs: 200, sm: 700 },
                        width: '100%',
                        backgroundImage:
                            theme.palette.mode === 'light'
                                ? 'url("/imanilogo.png")'
                                : 'url("/imanilogo.png")',
                        backgroundSize: 'cover',
                        borderRadius: '10px',
                        outline: '1px solid',
                        outlineColor:
                            theme.palette.mode === 'light'
                                ? alpha('#BFCCD9', 0.5)
                                : alpha('#9CCCFC', 0.1),
                        boxShadow:
                            theme.palette.mode === 'light'
                                ? `0 0 12px 8px ${alpha('#9CCCFC', 0.2)}`
                                : `0 0 24px 12px ${alpha('#033363', 0.2)}`,
                    })}
                />
            </Container>
        </Box>
    );
}
