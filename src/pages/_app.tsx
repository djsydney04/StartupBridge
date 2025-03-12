import type { AppProps } from 'next/app'
import Head from 'next/head'
import { AuthProvider } from '../utils/AuthContext'
import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>FounderConnect - Chapman University</title>
        <meta name="description" content="Connect with fellow Chapman University founders, find co-founders, and access startup resources." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </>
  )
} 