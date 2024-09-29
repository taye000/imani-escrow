import * as React from "react";
import {
  Container,
  Grid,
  Paper,
  CssBaseline,
  Box,
  Divider,
  ThemeProvider,
  createTheme,
} from "@mui/material";
import { useThemeContext } from "@/context/ThemeContext";
import AppAppBar from "@/components/AppBar";
import Footer from "@/components/Footer";
import getLPTheme from "@/getLPTheme";
import styled from "styled-components";
import AddProductModal from "@/components/AddProductModal";
import ProductsComponent from "@/components/Products";
import withAuth from "@/components/withAuth";

interface ToggleCustomThemeProps {
  showCustomTheme: Boolean;
  toggleCustomTheme: () => void;
}

const MainLayout = styled.div`
  display: flex;
  background-color: primary;
  flex-direction: column;
  min-height: 100vh;
  max-width: 80vw;
  align-items: center;
  margin: 0 auto;
  margin-bottom: 20px;
`;

function ToggleCustomTheme({
  showCustomTheme,
  toggleCustomTheme,
}: ToggleCustomThemeProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100vw",
        position: "fixed",
        bottom: 24,
      }}
    ></Box>
  );
}

function Products() {
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const { mode, toggleColorMode } = useThemeContext();
  const LPtheme = createTheme(getLPTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  // Get data from URL query parameters
  const urlParams = new URLSearchParams(window.location.search);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  return (
    <ThemeProvider theme={showCustomTheme ? LPtheme : defaultTheme}>
      <CssBaseline />
      <AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
      <Container
        maxWidth="lg"
        sx={{ bgcolor: "background.default", p: 4, pt: 12 }}
      >
        <MainLayout>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
                <ProductsComponent />
              </Paper>
            </Grid>
          </Grid>
        </MainLayout>
        <Divider sx={{ mt: 4, mb: 4 }} />
        <Footer />
      </Container>
      <ToggleCustomTheme
        showCustomTheme={showCustomTheme}
        toggleCustomTheme={toggleCustomTheme}
      />
      <AddProductModal open={isModalOpen} handleClose={handleCloseModal} />
    </ThemeProvider>
  );
}

export default withAuth(Products);
