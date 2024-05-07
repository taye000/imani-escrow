import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AutoFixHighRoundedIcon from '@mui/icons-material/AutoFixHighRounded';
import ConstructionRoundedIcon from '@mui/icons-material/ConstructionRounded';
import QueryStatsRoundedIcon from '@mui/icons-material/QueryStatsRounded';
import SettingsSuggestRoundedIcon from '@mui/icons-material/SettingsSuggestRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import ThumbUpAltRoundedIcon from '@mui/icons-material/ThumbUpAltRounded';

const items = [
    {
        icon: <SettingsSuggestRoundedIcon />,
        title: 'Agreement on Terms',
        description:
            'Buyer and Seller reach a mutual agreement on the terms of the transaction.This encompasses a detailed item description, the sale price, the specified inspection period for the Buyer, and any pertinent shipping information.',
    },
    {
        icon: <ConstructionRoundedIcon />,
        title: 'Secure Fund Deposit',
        description:
            'The Buyer securely deposits funds into Imani Escrow Services while associating the transaction with the item and the Sellers unique identification.',
    },
    {
        icon: <ThumbUpAltRoundedIcon />,
        title: 'Hassle-Free Shipping',
        description:
            'With the assurance of deposited funds, the Seller proceeds to ship the item, knowing their transaction is safeguarded.',
    },
    {
        icon: <AutoFixHighRoundedIcon />,
        title: 'Verification and Release',
        description:
            'Upon receiving the item as expected, the Buyer verifies its condition and marks the order as complete. At this point, the funds are released to the Seller, ensuring a smooth and secure transaction process.',
    },
    {
        icon: <SupportAgentRoundedIcon />,
        title: 'Dispute Resolution',
        description:
            'In the event of a dispute between the Buyer and Seller regarding the items condition or other transaction-related issues, our escrow service provides a platform for mediation and conflict resolution.',
    },
    {
        icon: <QueryStatsRoundedIcon />,
        title: 'Return or Refund Process',
        description:
            'If the Buyer is not completely satisfied with the received item and wishes to initiate a return, we have a well-defined return and refund process in place. Buyers can request a return within a specified timeframe and provide reasons for the return. Once the item is returned and inspected, we facilitate a prompt refund or replacement, as per the agreed terms.',
    },
];

export default function Highlights() {
    return (
        <Box
            id="highlights"
            sx={{
                pt: { xs: 4, sm: 12 },
                pb: { xs: 8, sm: 16 },
                color: 'white',
                bgcolor: '#06090a',
            }}
        >
            <Container
                sx={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: { xs: 3, sm: 6 },
                }}
            >
                <Box
                    sx={{
                        width: { sm: '100%', md: '60%' },
                        textAlign: { sm: 'left', md: 'center' },
                    }}
                >
                    <Typography component="h2" variant="h4">
                        Features
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'grey.400' }}>
                        Explore why our product stands out: the features that make it unique and reliable.
                    </Typography>
                </Box>
                <Grid container spacing={2.5}>
                    {items.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Stack
                                direction="column"
                                color="inherit"
                                component={Card}
                                spacing={1}
                                useFlexGap
                                sx={{
                                    p: 3,
                                    height: '100%',
                                    border: '1px solid',
                                    borderColor: 'grey.800',
                                    background: 'transparent',
                                    backgroundColor: 'grey.900',
                                }}
                            >
                                <Box sx={{ opacity: '50%' }}>{item.icon}</Box>
                                <div>
                                    <Typography fontWeight="medium" gutterBottom>
                                        {item.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'grey.400' }}>
                                        {item.description}
                                    </Typography>
                                </div>
                            </Stack>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}