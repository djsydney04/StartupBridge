import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';
import Head from 'next/head';

export default function Profile() {
  const router = useRouter();
  const { user, profile, isLoading, signOut } = useAuth();

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/signin');
    }
  }, [isLoading, user, router]);

  const handleSignOut = async () => {
    await signOut();
    // signOut function already handles redirection in AuthContext
  };

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
        <title>FounderConnect - Profile</title>
        <meta name="description" content="Your FounderConnect profile" />
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
          <h1 
            style={{ margin: 0, cursor: 'pointer' }}
            onClick={() => router.push('/home')}
          >
            FounderConnect
          </h1>
          <button 
            onClick={handleSignOut}
            style={{
              backgroundColor: 'transparent',
              border: '1px solid white',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Sign Out
          </button>
        </header>
        
        <main>
          <section style={{
            backgroundColor: 'rgba(255,255,255,0.05)',
            padding: '2rem',
            borderRadius: '1rem',
            marginBottom: '2rem'
          }}>
            <h2>Your Profile</h2>
            
            <div style={{ marginTop: '1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Email</h3>
                <p style={{ margin: 0 }}>{user?.email}</p>
              </div>
              
              {profile && (
                <>
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Full Name</h3>
                    <p style={{ margin: 0 }}>{profile.full_name || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>University</h3>
                    <p style={{ margin: 0 }}>{profile.university || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Major</h3>
                    <p style={{ margin: 0 }}>{profile.major || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Year</h3>
                    <p style={{ margin: 0 }}>{profile.year || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Bio</h3>
                    <p style={{ margin: 0 }}>{profile.bio || 'Not provided'}</p>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Interests</h3>
                    {profile.interests && profile.interests.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {profile.interests.map((interest, index) => (
                          <li key={index}>{interest}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0 }}>No interests provided</p>
                    )}
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>Skills</h3>
                    {profile.skills && profile.skills.length > 0 ? (
                      <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                        {profile.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                      </ul>
                    ) : (
                      <p style={{ margin: 0 }}>No skills provided</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>
        </main>
      </div>
    </>
  );
} 