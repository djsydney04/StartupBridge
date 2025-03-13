import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@/utils/AuthContext'

export default function Home() {
  const router = useRouter()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        router.push('/dashboard')
      } else {
        router.push('/auth/signin')
      }
    }
  }, [user, isLoading, router])

  // Show nothing while redirecting
  return null
} 