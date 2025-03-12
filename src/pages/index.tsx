import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/landing')
  }, [router])

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