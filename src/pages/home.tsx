import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';
import Head from 'next/head';

export default function Home() {
  const router = useRouter();
  const { user, profile, isLoading } = useAuth();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/signin');
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#090618',
        color: 'white',
        fontFamily: 'system-ui, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h1>Loading...</h1>
          <div style={{ 
            marginTop: '1rem',
            width: '50px',
            height: '50px',
            border: '5px solid rgba(255,255,255,0.1)',
            borderTopColor: '#805ad5',
            borderRadius: '50%',
            display: 'inline-block',
            animation: 'spin 1s ease-in-out infinite'
          }}>
          </div>
          <style jsx>{`
            @keyframes spin {
              to { transform: rotate(360deg) }
            }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>FounderConnect - Home</title>
        <meta name="description" content="Your FounderConnect dashboard" />
      </Head>
      <div style={{
        backgroundColor: '#090618',
        minHeight: '100vh',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        padding: '2rem'
      }}>
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ margin: 0 }}>FounderConnect</h1>
          <button 
            onClick={() => router.push('/profile')}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Profile
          </button>
        </header>
        
        <main>
          <section style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem'
          }}>
            <h2>Welcome, {profile?.full_name || user?.email}!</h2>
            <p>This is your personal dashboard where you can connect with other founders, find resources, and manage your startup journey.</p>
          </section>
          
          <section style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem'
          }}>
            <h2>Events</h2>
            <p>No upcoming events at this time.</p>
          </section>
          
          <section style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: '2rem',
            borderRadius: '1rem'
          }}>
            <h2>Resources</h2>
            <ul style={{ paddingLeft: '1.5rem' }}>
              <li>Chapman Entrepreneurship Program</li>
              <li>Funding Opportunities</li>
              <li>Mentorship Network</li>
            </ul>
          </section>
        </main>
      </div>
    </>
  );
} 