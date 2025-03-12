'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  UsersIcon, 
  BriefcaseIcon, 
  CalendarIcon, 
  BookOpenIcon, 
  ChatBubbleLeftRightIcon, 
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Find Co-Founders', href: '/co-founders', icon: UsersIcon },
  { name: 'Job Board', href: '/jobs', icon: BriefcaseIcon },
  { name: 'Events & Networking', href: '/events', icon: CalendarIcon },
  { name: 'Resources', href: '/resources', icon: BookOpenIcon },
  { name: 'Messages', href: '/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Profile & Settings', href: '/profile', icon: UserCircleIcon },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
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

  return (
    <div className="dashboard-layout">
      {/* Mobile header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 lg:hidden">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="Toggle sidebar"
            >
              {isSidebarOpen ? (
                <XMarkIcon className="h-6 w-6 text-gray-600" />
              ) : (
                <Bars3Icon className="h-6 w-6 text-gray-600" />
              )}
            </button>
            <span className="ml-4 text-lg font-semibold text-purple-600">FounderConnect</span>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <aside 
        className={`dashboard-sidebar ${isMobile && !isSidebarOpen ? '-translate-x-full' : ''}`}
        aria-label="Sidebar"
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-gray-200">
          <Link href="/dashboard" className="text-xl font-bold text-purple-600 hover:text-purple-700 transition-colors">
            FounderConnect
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-5 px-2 space-y-1" aria-label="Main navigation">
          {navItems.map((item) => {
            const isActive = router.pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`
                  group flex items-center px-4 py-3 text-sm font-medium rounded-md
                  transition-colors duration-150 ease-in-out
                  ${isActive 
                    ? 'bg-purple-50 text-purple-600' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }
                `}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => isMobile && setIsSidebarOpen(false)}
              >
                <item.icon
                  className={`
                    mr-3 h-5 w-5 flex-shrink-0
                    ${isActive ? 'text-purple-600' : 'text-gray-400 group-hover:text-gray-500'}
                  `}
                  aria-hidden="true"
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="dashboard-content">
        <main className="dashboard-main mt-16 lg:mt-0">
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