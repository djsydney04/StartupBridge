'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAuth } from '@/utils/AuthContext';
import { 
  HomeIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Find Co-Founders', href: '/co-founders', icon: UsersIcon },
  { name: 'Job Board', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Events', href: '/events', icon: CalendarIcon },
  { name: 'Resources', href: '/resources', icon: BookOpenIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { signOut } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 1024;
      setIsMobile(isMobileView);
      setIsSidebarOpen(!isMobileView);
    };

    // Check initial size
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      router.push('/auth/signin');
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              )}
            </button>
            <Link href="/dashboard" className="hover:opacity-90 transition-opacity ml-2">
              <Image 
                src="/images/FounderConnectLogo.svg" 
                alt="FounderConnect Logo" 
                width={120} 
                height={30}
                priority
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Sidebar - fixed on desktop */}
      <aside 
        className={`dashboard-sidebar ${isMobile && !isSidebarOpen ? '-translate-x-full' : ''}`}
        aria-label="Sidebar"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200 p-2">
          <Link href="/dashboard" className="hover:opacity-90 transition-opacity">
            <Image 
              src="/images/FounderConnectLogo.svg" 
              alt="FounderConnect Logo" 
              width={180} 
              height={40}
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2 flex flex-col h-[calc(100%-4rem)] justify-between" aria-label="Main navigation">
          {/* Main menu items */}
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = router.pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-md
                    transition-colors duration-150 ease-in-out mb-1
                    ${isActive 
                      ? 'bg-gray-100 text-black' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => isMobile && setIsSidebarOpen(false)}
                >
                  <item.icon
                    className={`
                      mr-3 h-5 w-5 flex-shrink-0
                      ${isActive ? 'text-black' : 'text-gray-400 group-hover:text-gray-500'}
                    `}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Profile & Settings at bottom */}
          <div className="border-t border-gray-200 pt-2 pb-6">
            <Link
              href="/profile"
              className={`
                group flex items-center px-4 py-3 text-sm font-medium rounded-md
                transition-colors duration-150 ease-in-out mb-1
                ${router.pathname.startsWith('/profile') 
                  ? 'bg-gray-100 text-black' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
              aria-current={router.pathname.startsWith('/profile') ? 'page' : undefined}
              onClick={() => isMobile && setIsSidebarOpen(false)}
            >
              <UserCircleIcon
                className={`
                  mr-3 h-5 w-5 flex-shrink-0
                  ${router.pathname.startsWith('/profile') ? 'text-black' : 'text-gray-400 group-hover:text-gray-500'}
                `}
                aria-hidden="true"
              />
              <span>Profile & Settings</span>
            </Link>

            {/* Sign Out Button */}
            <button
              onClick={handleSignOut}
              className="w-full group flex items-center px-4 py-3 text-sm font-medium rounded-md
                transition-colors duration-150 ease-in-out
                text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <ArrowRightOnRectangleIcon
                className="mr-3 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                aria-hidden="true"
              />
              <span>Sign Out</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content - scrollable */}
      <div className="dashboard-content">
        <main className="dashboard-main">
          {children}
        </main>
      </div>

      {/* Mobile sidebar backdrop */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
} 