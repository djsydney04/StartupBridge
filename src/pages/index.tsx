import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/utils/AuthContext'

export default function Index() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // If user is authenticated, go to home
        router.replace('/home')
      } else {
        // If not authenticated, go to landing
        router.replace('/landing')
      }
    }
  }, [isLoading, user, router])

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
        <h1>Loading FounderConnect...</h1>
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
  )
} 