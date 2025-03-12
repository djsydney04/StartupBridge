import Link from 'next/link'
import Head from 'next/head'

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found</title>
      </Head>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#1a202c',
        color: 'white',
        padding: '1rem',
        textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif'
      }}>
        <div style={{ maxWidth: '600px', padding: '2rem' }}>
          <div style={{ 
            fontSize: '6rem',
            fontWeight: 'bold',
            color: '#805ad5',
            marginBottom: '1rem'
          }}>
            404
          </div>
          <h1 style={{ 
            fontSize: '2rem',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Page Not Found
          </h1>
          <p style={{ 
            color: '#a0aec0',
            marginBottom: '2rem',
            maxWidth: '400px',
            marginLeft: 'auto',
            marginRight: 'auto'
          }}>
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            backgroundColor: '#805ad5',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            textDecoration: 'none',
            fontWeight: 500,
            transition: 'background-color 0.3s'
          }}>
            Return Home
          </Link>
        </div>
      </div>
    </>
  )
} 