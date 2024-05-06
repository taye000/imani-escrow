import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Hero = () => {

    return (
        <section id="hero">
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                sx={{ padding: { xs: 2, md: 6 }, marginTop: { xs: 2, sm: 10, md: 20 } }}
            >
                <Grid item xs={12} md={6} sx={{ order: { xs: 2, md: 1 } }} > {/* Adjust column order */}
                    <Box sx={{ marginBottom: 4 }}>
                        <Typography variant="h3" component="h1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            Welcome to imani escrow services.
                        </Typography>
                        <Typography variant="body1" sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                            Elevating trust and security for small businesses and individuals by
                            harnessing the power of blockchain technology to enhance our
                            exceptional escrow services. Your safe transactions, our priority.
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={6} sx={{ order: { xs: 1, md: 2 } }} >
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}> {/* Center the image */}
                        <img src="/imanilogo.png" style={{ borderRadius: 8, boxShadow: '0px 4px 10px rgba(0,0,0,0.1)' }} />
                    </Box>
                </Grid>
            </Grid>
        </section>
    );
};

export default Hero;