import Head from "next/head";
import styles from '@/styles/Home.module.css';
import LandingPage from "@/landingPage";

export default function Home() {
  return (
    <>
      <Head>
        <title>Imani Escrow Service</title>
        <meta name="description" content="Secure Online Purchases" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="icon" href="/imanilogo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />

      </Head>
      <main className={`${styles.main}`}>
        <LandingPage />
      </main>
    </>
  );
}
