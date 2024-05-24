import * as React from 'react';
import { PaletteMode, Grid, Container, Typography, Avatar, Button } from '@mui/material';
import styled from "styled-components";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from '@/components/AppBar';
import Footer from '@/components/Footer';
import getLPTheme from '@/getLPTheme';
import Link from 'next/link';
import EditIcon from '@mui/icons-material/Edit';
import { useThemeContext } from '@/context/ThemeContext';

const user = {
    name: "John Doe",
    bio: "I'm a software engineer who loves building web applications.",
    profilePicture: "/avatar.jpg",
    email: "john.doe@example.com",
    phoneNumber: "123-456-7890",
    address: "123 Main St, Anytown, USA",
};

interface ToggleCustomThemeProps {
    showCustomTheme: Boolean;
    toggleCustomTheme: () => void;
}

function ToggleCustomTheme({
    showCustomTheme,
    toggleCustomTheme,
}: ToggleCustomThemeProps) {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '100dvw',
                position: 'fixed',
                bottom: 24,
            }}
        >
        </Box>
    );
}

const ProfileContainer = styled.div`
  display: flex;
  margin-top: 120px;
  margin-bottom: 80px;
  padding: 48px;
`;

const ProfileHeaderContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
  position: relative;
`;

const ProfileImage = styled(Avatar)`
  width: 120px;
  height: 120px;
  margin-bottom: 16px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.3);
`;

const ProfileDetails = styled.div`
  text-align: center; 
`;

const UserName = styled(Typography)`
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 8px;
`;

const UserBio = styled(Typography)`
  font-size: 16px;
  margin-bottom: 16px;
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ContactItem = styled(Typography)`
  font-size: 14px;
  margin-bottom: 4px;
`;

const EditButton = styled(Button)`
  position: absolute;
  top: 16px;
  right: 16px;
`;


export default function Profile() {
    const { mode, toggleColorMode } = useThemeContext();
    const [showCustomTheme, setShowCustomTheme] = React.useState(true);
    const LPtheme = createTheme(getLPTheme(mode));
    const defaultTheme = createTheme({ palette: { mode } });

    const toggleCustomTheme = () => {
        setShowCustomTheme((prev) => !prev);
    };

    const handleEditClick = () => {
        // Add your logic to handle the edit action here
        // open a modal.
    };

    return (
        <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
            <CssBaseline />
            <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
            <Container maxWidth="lg">
                <Box sx={{ bgcolor: 'background.default', p: 4, pt: 12 }}>
                    <Container maxWidth="lg">
                        <Divider />
                        <ProfileContainer>
                            <Grid container spacing={3} justifyContent="center">
                                <Grid item xs={12} md={8}>
                                    <ProfileHeaderContainer>
                                        {/* Profile Picture */}
                                        <ProfileImage src={user.profilePicture} alt={user.name} variant="rounded" sx={{
                                            width: { xs: 100, sm: 150, md: 200 }, // Different sizes for different screens
                                            height: { xs: 100, sm: 150, md: 200 },
                                        }} />

                                        {/* Profile Details */}
                                        <ProfileDetails>
                                            <UserName variant="h4">{user.name}</UserName>
                                            <UserBio variant="body1">{user.bio}</UserBio>

                                            <ContactInfo>
                                                <ContactItem variant="body2">
                                                    <Link href={`mailto:${user.email}`} color="inherit">
                                                        {user.email}
                                                    </Link>
                                                </ContactItem>
                                                <ContactItem variant="body2">{user.phoneNumber}</ContactItem>
                                                <ContactItem variant="body2">{user.address}</ContactItem>
                                            </ContactInfo>
                                        </ProfileDetails>
                                        <EditButton
                                            variant="outlined"
                                            color="inherit"
                                            startIcon={<EditIcon />} // Add the EditIcon
                                            onClick={handleEditClick}
                                        >
                                            Edit
                                        </EditButton>
                                    </ProfileHeaderContainer>
                                </Grid>
                            </Grid>
                        </ProfileContainer>
                    </Container>
                    <Divider />
                    <Footer />
                </Box>
            </Container>
            <ToggleCustomTheme
                showCustomTheme={showCustomTheme}
                toggleCustomTheme={toggleCustomTheme}
            />
        </ThemeProvider >
    );
}