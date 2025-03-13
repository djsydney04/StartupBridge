'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <Image 
              src="/images/FounderConnectLogo.svg" 
              alt="FounderConnect Logo" 
              width={150} 
              height={35}
              priority
            />
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <Link 
              href="/founders"
              className={`${isActive('/founders') ? 'text-black font-medium' : 'text-gray-600'} hover:text-black transition`}
            >
              Find Co-Founders
            </Link>
            <Link 
              href="/jobs"
              className={`${isActive('/jobs') ? 'text-black font-medium' : 'text-gray-600'} hover:text-black transition`}
            >
              Jobs
            </Link>
            <Link 
              href="/resources"
              className={`${isActive('/resources') ? 'text-black font-medium' : 'text-gray-600'} hover:text-black transition`}
            >
              Resources
            </Link>
            <Link 
              href="/events"
              className={`${isActive('/events') ? 'text-black font-medium' : 'text-gray-600'} hover:text-black transition`}
            >
              Events
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/profile"
              className="text-gray-600 hover:text-black transition"
            >
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 