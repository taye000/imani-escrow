import { UserProvider } from '@auth0/nextjs-auth0/client';
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from 'react-hot-toast'; // Import toast from react-hot-toast

export default function App({ Component, pageProps }: AppProps) {
  const [isComponentRendered, setIsComponentRendered] = React.useState(false);

  React.useEffect(() => {
    setIsComponentRendered(true);
  }, []);

  if (!isComponentRendered) {
    return null;
  }
  return (
    <UserProvider>
      <ThemeProvider>
        <Component {...pageProps} />
        <Toaster />
      </ThemeProvider>
    </UserProvider>
  );
}