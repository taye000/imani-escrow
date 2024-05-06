import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <Head>
        <title>Imani Escrow Service</title>
        <meta name="description" content="Secure Online Purchases" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/imanilogo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin /> */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        />

      </Head>
      <main className={`${styles.main} ${inter.className}`}>

      </main>
    </>
  );
}
